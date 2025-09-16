require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('./database/db');
const scheduler = require('./scheduler/scheduler');
const queueManager = require('./queue/queue-manager');
const webhooks = require('./webhooks/webhook-client');
const logger = require('./utils/logger');
const config = require('./config/automation.config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip, 
    userAgent: req.get('user-agent') 
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes

// Create a new render job
app.post('/api/jobs', async (req, res) => {
  try {
    const { compositionId, props, priority = 5, webhook } = req.body;

    if (!compositionId || !props) {
      return res.status(400).json({
        error: 'Missing required fields: compositionId, props'
      });
    }

    const result = await queueManager.addJob({
      compositionId,
      props,
      priority
    });

    // Send custom webhook if provided
    if (webhook) {
      webhooks.sendCustomWebhook(webhook, {
        event: 'job.created',
        job_id: result.jobId,
        output_path: result.outputPath
      });
    }

    res.json({
      jobId: result.jobId,
      queueJobId: result.queueJobId,
      outputPath: result.outputPath,
      status: 'pending'
    });
  } catch (error) {
    logger.error('Failed to create job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job status
app.get('/api/jobs/:jobId', async (req, res) => {
  try {
    const status = await queueManager.getJobStatus(req.params.jobId);
    
    if (!status) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(status);
  } catch (error) {
    logger.error('Failed to get job status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel a job
app.delete('/api/jobs/:jobId', async (req, res) => {
  try {
    await queueManager.cancelJob(req.params.jobId);
    res.json({ message: 'Job cancelled successfully' });
  } catch (error) {
    logger.error('Failed to cancel job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get queue status
app.get('/api/queue/status', async (req, res) => {
  try {
    const status = await queueManager.getQueueStatus();
    res.json(status);
  } catch (error) {
    logger.error('Failed to get queue status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new schedule
app.post('/api/schedules', async (req, res) => {
  try {
    const { name, cronExpression, compositionId, propsTemplate, enabled = true } = req.body;

    if (!name || !cronExpression || !compositionId || !propsTemplate) {
      return res.status(400).json({
        error: 'Missing required fields: name, cronExpression, compositionId, propsTemplate'
      });
    }

    const scheduleId = await scheduler.createSchedule({
      name,
      cron_expression: cronExpression,
      composition_id: compositionId,
      props_template: propsTemplate,
      enabled
    });

    res.json({
      scheduleId,
      message: 'Schedule created successfully'
    });
  } catch (error) {
    logger.error('Failed to create schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all schedules
app.get('/api/schedules', (req, res) => {
  try {
    const schedules = scheduler.getScheduleStatus();
    res.json(schedules);
  } catch (error) {
    logger.error('Failed to get schedules:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a schedule
app.put('/api/schedules/:scheduleId', async (req, res) => {
  try {
    await scheduler.updateSchedule(req.params.scheduleId, req.body);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    logger.error('Failed to update schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a schedule
app.delete('/api/schedules/:scheduleId', async (req, res) => {
  try {
    await scheduler.deleteSchedule(req.params.scheduleId);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job statistics
app.get('/api/stats', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const stats = db.getJobStats(days);
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Batch job creation
app.post('/api/jobs/batch', async (req, res) => {
  try {
    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ error: 'Jobs array is required' });
    }

    const results = await Promise.all(
      jobs.map(job => queueManager.addJob({
        compositionId: job.compositionId,
        props: job.props,
        priority: job.priority || 5
      }))
    );

    res.json({
      message: `${results.length} jobs created successfully`,
      jobs: results
    });
  } catch (error) {
    logger.error('Failed to create batch jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test webhook endpoint
app.post('/api/webhooks/test', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await webhooks.testWebhook(url);
    res.json(result);
  } catch (error) {
    logger.error('Failed to test webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// YouTube video processing endpoint
app.post('/api/youtube/process', async (req, res) => {
  try {
    const { 
      videoUrl, 
      clips, // Array of { startTime, endTime, title }
      layout = 'vertical',
      visualizer = true,
      captions = true 
    } = req.body;

    if (!videoUrl || !clips || !Array.isArray(clips)) {
      return res.status(400).json({ 
        error: 'Missing required fields: videoUrl, clips' 
      });
    }

    const jobs = clips.map((clip, index) => ({
      compositionId: 'YouTubeShort',
      props: {
        videoUrl,
        startTime: clip.startTime,
        endTime: clip.endTime,
        layout,
        titleText: clip.title || `Clip ${index + 1}`,
        visualizer: visualizer ? {
          type: 'oscilloscope',
          color: '#F4B941',
          numberOfSamples: '64',
          windowInSeconds: 0.1,
          posterization: 3,
          amplitude: 4,
          padding: 50,
        } : undefined,
        captionsFileName: captions ? 'captions.json' : undefined,
      },
      priority: 5
    }));

    const results = await Promise.all(
      jobs.map(job => queueManager.addJob(job))
    );

    res.json({
      message: `${results.length} YouTube clips queued for processing`,
      jobs: results
    });
  } catch (error) {
    logger.error('Failed to process YouTube video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
  try {
    // Ensure required directories exist
    const dirs = [
      config.general.outputDirectory,
      config.general.tempDirectory,
      config.general.logsDirectory
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Start scheduler
    await scheduler.start();

    // Start processing pending jobs
    setInterval(async () => {
      await queueManager.processNextJob();
    }, 5000);

    // Start server
    app.listen(PORT, () => {
      logger.info(`Automation server started on port ${PORT}`);
      console.log(`
╔═══════════════════════════════════════════╗
║   YouTube Shorts Automation Server        ║
║   Running on http://localhost:${PORT}        ║
╚═══════════════════════════════════════════╝

API Endpoints:
- POST   /api/jobs                Create a new render job
- GET    /api/jobs/:id            Get job status
- DELETE /api/jobs/:id            Cancel a job
- POST   /api/jobs/batch          Create multiple jobs
- GET    /api/queue/status        Get queue status
- POST   /api/schedules           Create a schedule
- GET    /api/schedules           List all schedules
- PUT    /api/schedules/:id       Update a schedule
- DELETE /api/schedules/:id       Delete a schedule
- GET    /api/stats               Get job statistics
- POST   /api/youtube/process     Process YouTube video clips
- POST   /api/webhooks/test       Test a webhook URL

Press Ctrl+C to stop the server.
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  
  try {
    await scheduler.stop();
    await queueManager.close();
    db.close();
    
    logger.info('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
start();