const Queue = require('bull');
const { renderMedia } from '@remotion/renderer';
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const logger = require('../utils/logger');
const config = require('../config/automation.config');
const webhooks = require('../webhooks/webhook-client');

class QueueManager {
  constructor() {
    this.renderQueue = new Queue('youtube-shorts-render', {
      redis: config.queue.redis
    });
    
    this.setupQueueHandlers();
    this.setupQueueEvents();
  }

  setupQueueHandlers() {
    // Process render jobs
    this.renderQueue.process(config.general.maxConcurrentJobs, async (job) => {
      const { jobId, compositionId, props, outputPath } = job.data;
      
      logger.logJob('info', `Starting render job`, jobId, { compositionId });
      
      try {
        // Update job status
        db.updateJob(jobId, { 
          status: 'processing',
          started_at: new Date().toISOString()
        });

        // Send webhook notification
        await webhooks.sendJobStarted(jobId, compositionId, props);

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Render the video
        const startTime = Date.now();
        
        await renderMedia({
          composition: compositionId,
          serveUrl: path.join(__dirname, '../../src/index.ts'),
          outputLocation: outputPath,
          inputProps: props,
          codec: config.renderer.codec,
          imageFormat: config.renderer.imageFormat,
          jpegQuality: config.renderer.jpegQuality,
          frameRange: config.renderer.frameRange,
          everyNthFrame: config.renderer.everyNthFrame,
          numberOfGifLoops: config.renderer.numberOfGifLoops,
          concurrency: config.renderer.concurrency,
          timeoutInMilliseconds: config.renderer.timeoutInMilliseconds,
          chromiumOptions: config.renderer.chromiumOptions,
          scale: config.renderer.scale,
          port: config.renderer.port,
          envVariables: config.renderer.envVariables,
          onProgress: (progress) => {
            job.progress(progress.progress * 100);
            logger.logJob('debug', `Render progress: ${Math.round(progress.progress * 100)}%`, jobId);
          },
        });

        const renderTime = Date.now() - startTime;
        const fileStats = fs.statSync(outputPath);

        // Update job as completed
        db.updateJob(jobId, {
          status: 'completed',
          completed_at: new Date().toISOString(),
          output_path: outputPath
        });

        // Record job history
        db.recordJobHistory({
          job_id: jobId,
          schedule_id: job.data.scheduleId || null,
          render_time_ms: renderTime,
          file_size_bytes: fileStats.size,
          composition_id: compositionId,
          success: true
        });

        // Send success webhook
        await webhooks.sendJobCompleted(jobId, outputPath, {
          renderTime,
          fileSize: fileStats.size
        });

        logger.logJob('info', `Render job completed successfully`, jobId, {
          renderTime,
          fileSize: fileStats.size,
          outputPath
        });

        return { success: true, outputPath, renderTime };
      } catch (error) {
        logger.logJob('error', `Render job failed: ${error.message}`, jobId, { error: error.stack });
        
        // Update job as failed
        db.updateJob(jobId, {
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message,
          retry_count: db.getJob(jobId).retry_count + 1
        });

        // Record failure in history
        db.recordJobHistory({
          job_id: jobId,
          schedule_id: job.data.scheduleId || null,
          render_time_ms: 0,
          file_size_bytes: 0,
          composition_id: compositionId,
          success: false
        });

        // Send failure webhook
        await webhooks.sendJobFailed(jobId, error.message);

        throw error;
      }
    });
  }

  setupQueueEvents() {
    this.renderQueue.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed successfully`);
    });

    this.renderQueue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed:`, err);
      
      // Check if we should retry
      const jobData = db.getJob(job.data.jobId);
      if (jobData && jobData.retry_count < config.general.retryAttempts) {
        logger.info(`Retrying job ${job.data.jobId} (attempt ${jobData.retry_count + 1}/${config.general.retryAttempts})`);
        
        setTimeout(() => {
          this.addJob({
            ...job.data,
            isRetry: true
          });
        }, config.general.retryDelay);
      }
    });

    this.renderQueue.on('stalled', (job) => {
      logger.warn(`Job ${job.id} stalled and will be retried`);
    });

    this.renderQueue.on('progress', (job, progress) => {
      logger.debug(`Job ${job.id} progress: ${progress}%`);
    });
  }

  async addJob(jobData) {
    const {
      jobId = uuidv4(),
      compositionId,
      props,
      priority = 5,
      scheduleId = null,
      delay = 0,
      isRetry = false
    } = jobData;

    // Generate output path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `${compositionId}_${timestamp}.mp4`;
    const outputPath = path.join(config.general.outputDirectory, outputFilename);

    // Create job in database if not a retry
    if (!isRetry) {
      db.createJob({
        job_id: jobId,
        type: scheduleId ? 'scheduled' : 'manual',
        status: 'pending',
        composition_id: compositionId,
        props: props,
        priority: priority,
        metadata: scheduleId ? { schedule_id: scheduleId } : null
      });
    }

    // Add to queue
    const job = await this.renderQueue.add({
      jobId,
      compositionId,
      props,
      outputPath,
      scheduleId
    }, {
      priority,
      delay,
      attempts: config.queue.defaultJobOptions.attempts,
      backoff: config.queue.defaultJobOptions.backoff,
      removeOnComplete: config.queue.defaultJobOptions.removeOnComplete,
      removeOnFail: config.queue.defaultJobOptions.removeOnFail
    });

    logger.logJob('info', `Job added to queue`, jobId, { 
      queueJobId: job.id,
      compositionId,
      priority,
      delay
    });

    return {
      jobId,
      queueJobId: job.id,
      outputPath
    };
  }

  async processNextJob() {
    const pendingJobs = db.getPendingJobs(1);
    
    if (pendingJobs.length > 0) {
      const job = pendingJobs[0];
      await this.addJob({
        jobId: job.job_id,
        compositionId: job.composition_id,
        props: job.props,
        priority: job.priority,
        scheduleId: job.metadata?.schedule_id
      });
    }
  }

  async getQueueStatus() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.renderQueue.getWaitingCount(),
      this.renderQueue.getActiveCount(),
      this.renderQueue.getCompletedCount(),
      this.renderQueue.getFailedCount(),
      this.renderQueue.getDelayedCount()
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed
    };
  }

  async getJobStatus(jobId) {
    const dbJob = db.getJob(jobId);
    if (!dbJob) {
      return null;
    }

    const queueJobs = await this.renderQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
    const queueJob = queueJobs.find(j => j.data.jobId === jobId);

    return {
      ...dbJob,
      queueStatus: queueJob ? await queueJob.getState() : 'not_in_queue',
      progress: queueJob ? queueJob.progress() : 0
    };
  }

  async cancelJob(jobId) {
    const queueJobs = await this.renderQueue.getJobs(['waiting', 'active', 'delayed']);
    const queueJob = queueJobs.find(j => j.data.jobId === jobId);

    if (queueJob) {
      await queueJob.remove();
      logger.logJob('info', 'Job cancelled', jobId);
    }

    db.updateJob(jobId, {
      status: 'cancelled',
      completed_at: new Date().toISOString()
    });

    return true;
  }

  async clearQueue() {
    await this.renderQueue.empty();
    logger.info('Queue cleared');
  }

  async close() {
    await this.renderQueue.close();
    logger.info('Queue manager closed');
  }
}

module.exports = new QueueManager();