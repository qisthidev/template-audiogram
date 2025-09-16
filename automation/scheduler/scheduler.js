const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const logger = require('../utils/logger');
const config = require('../config/automation.config');

class JobScheduler {
  constructor() {
    this.scheduledTasks = new Map();
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }

    logger.info('Starting job scheduler...');
    this.isRunning = true;

    // Load and start all active schedules
    await this.loadActiveSchedules();

    // Start cleanup cron job
    this.startCleanupJob();

    logger.info('Job scheduler started successfully');
  }

  async stop() {
    logger.info('Stopping job scheduler...');
    
    // Stop all scheduled tasks
    for (const [scheduleId, task] of this.scheduledTasks) {
      task.stop();
      logger.info(`Stopped schedule: ${scheduleId}`);
    }
    
    this.scheduledTasks.clear();
    this.isRunning = false;
    
    logger.info('Job scheduler stopped');
  }

  async loadActiveSchedules() {
    try {
      const schedules = db.getActiveSchedules();
      
      for (const schedule of schedules) {
        await this.activateSchedule(schedule);
      }
      
      logger.info(`Loaded ${schedules.length} active schedules`);
    } catch (error) {
      logger.error('Failed to load active schedules:', error);
    }
  }

  async activateSchedule(schedule) {
    try {
      // Validate cron expression
      if (!cron.validate(schedule.cron_expression)) {
        logger.error(`Invalid cron expression for schedule ${schedule.schedule_id}: ${schedule.cron_expression}`);
        return;
      }

      // Create and start the cron job
      const task = cron.schedule(schedule.cron_expression, async () => {
        await this.executeScheduledJob(schedule);
      }, {
        scheduled: true,
        timezone: process.env.TZ || 'UTC'
      });

      this.scheduledTasks.set(schedule.schedule_id, task);
      logger.info(`Activated schedule: ${schedule.name} (${schedule.cron_expression})`);

      // Update next run time
      const nextRun = this.getNextRunTime(schedule.cron_expression);
      db.updateSchedule(schedule.schedule_id, { next_run: nextRun });
    } catch (error) {
      logger.error(`Failed to activate schedule ${schedule.schedule_id}:`, error);
    }
  }

  async deactivateSchedule(scheduleId) {
    const task = this.scheduledTasks.get(scheduleId);
    if (task) {
      task.stop();
      this.scheduledTasks.delete(scheduleId);
      logger.info(`Deactivated schedule: ${scheduleId}`);
    }
  }

  async executeScheduledJob(schedule) {
    logger.info(`Executing scheduled job: ${schedule.name}`);
    
    try {
      // Generate job data from template
      const jobData = this.generateJobFromTemplate(schedule);
      
      // Create job in database
      const jobId = uuidv4();
      db.createJob({
        job_id: jobId,
        type: 'scheduled',
        status: 'pending',
        composition_id: schedule.composition_id,
        props: jobData.props,
        priority: 5,
        metadata: {
          schedule_id: schedule.schedule_id,
          schedule_name: schedule.name,
        }
      });

      // Update schedule last run time
      db.updateSchedule(schedule.schedule_id, {
        last_run: new Date().toISOString(),
        next_run: this.getNextRunTime(schedule.cron_expression)
      });

      logger.info(`Created job ${jobId} from schedule ${schedule.schedule_id}`);
    } catch (error) {
      logger.error(`Failed to execute scheduled job for ${schedule.schedule_id}:`, error);
    }
  }

  generateJobFromTemplate(schedule) {
    const template = schedule.props_template;
    const props = { ...template };

    // Replace template variables
    const now = new Date();
    const replacements = {
      '{{date}}': now.toISOString().split('T')[0],
      '{{time}}': now.toTimeString().split(' ')[0],
      '{{timestamp}}': now.getTime(),
      '{{year}}': now.getFullYear(),
      '{{month}}': String(now.getMonth() + 1).padStart(2, '0'),
      '{{day}}': String(now.getDate()).padStart(2, '0'),
      '{{hour}}': String(now.getHours()).padStart(2, '0'),
      '{{minute}}': String(now.getMinutes()).padStart(2, '0'),
      '{{random}}': Math.random().toString(36).substring(7),
    };

    // Deep replace template variables in props
    const replaceTemplateVars = (obj) => {
      if (typeof obj === 'string') {
        let result = obj;
        for (const [key, value] of Object.entries(replacements)) {
          result = result.replace(new RegExp(key, 'g'), value);
        }
        return result;
      } else if (Array.isArray(obj)) {
        return obj.map(replaceTemplateVars);
      } else if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = replaceTemplateVars(value);
        }
        return result;
      }
      return obj;
    };

    return {
      props: replaceTemplateVars(props)
    };
  }

  getNextRunTime(cronExpression) {
    try {
      const interval = cron.schedule(cronExpression, () => {}, { scheduled: false });
      const nextDate = new Date();
      
      // Simple implementation - you might want to use a more sophisticated library
      // This is a placeholder that adds 1 minute for demonstration
      nextDate.setMinutes(nextDate.getMinutes() + 1);
      
      return nextDate.toISOString();
    } catch (error) {
      logger.error('Failed to calculate next run time:', error);
      return null;
    }
  }

  startCleanupJob() {
    // Run cleanup daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      logger.info('Running database cleanup...');
      try {
        const result = db.cleanupOldRecords(30);
        logger.info(`Cleanup complete: ${JSON.stringify(result)}`);
      } catch (error) {
        logger.error('Cleanup failed:', error);
      }
    });
  }

  // API methods for managing schedules
  async createSchedule(scheduleData) {
    const scheduleId = uuidv4();
    const schedule = {
      schedule_id: scheduleId,
      ...scheduleData
    };

    db.createSchedule(schedule);
    
    if (scheduleData.enabled !== false) {
      await this.activateSchedule(schedule);
    }

    return scheduleId;
  }

  async updateSchedule(scheduleId, updates) {
    db.updateSchedule(scheduleId, updates);
    
    // If cron expression changed, restart the task
    if (updates.cron_expression || updates.enabled !== undefined) {
      await this.deactivateSchedule(scheduleId);
      
      if (updates.enabled !== false) {
        const schedule = db.getActiveSchedules().find(s => s.schedule_id === scheduleId);
        if (schedule) {
          await this.activateSchedule(schedule);
        }
      }
    }
  }

  async deleteSchedule(scheduleId) {
    await this.deactivateSchedule(scheduleId);
    db.updateSchedule(scheduleId, { enabled: false });
  }

  getScheduleStatus() {
    const schedules = db.getActiveSchedules();
    return schedules.map(schedule => ({
      ...schedule,
      is_running: this.scheduledTasks.has(schedule.schedule_id)
    }));
  }
}

module.exports = new JobScheduler();