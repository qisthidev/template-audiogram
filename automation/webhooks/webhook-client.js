const axios = require('axios');
const db = require('../database/db');
const logger = require('../utils/logger');
const config = require('../config/automation.config');

class WebhookClient {
  constructor() {
    this.axios = axios.create({
      timeout: config.webhooks.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YouTube-Shorts-Automation/1.0'
      }
    });
  }

  async sendWebhook(type, url, payload) {
    if (!url) {
      return;
    }

    const maxRetries = config.webhooks.retries || 2;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.axios.post(url, payload);
        
        // Log successful webhook
        db.logWebhook({
          webhook_type: type,
          url,
          payload,
          response_status: response.status,
          response_body: response.data,
          success: true
        });

        logger.info(`Webhook ${type} sent successfully to ${url}`);
        return response.data;
      } catch (error) {
        lastError = error;
        
        // Log failed attempt
        db.logWebhook({
          webhook_type: type,
          url,
          payload,
          response_status: error.response?.status || 0,
          response_body: error.response?.data || error.message,
          success: false
        });

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          logger.warn(`Webhook ${type} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error(`Webhook ${type} failed after ${maxRetries + 1} attempts:`, lastError.message);
    throw lastError;
  }

  async sendJobStarted(jobId, compositionId, props) {
    const url = config.webhooks.onJobStart;
    if (!url) return;

    const payload = {
      event: 'job.started',
      timestamp: new Date().toISOString(),
      data: {
        job_id: jobId,
        composition_id: compositionId,
        props,
      }
    };

    try {
      await this.sendWebhook('job_started', url, payload);
    } catch (error) {
      // Don't fail the job if webhook fails
      logger.error('Failed to send job started webhook:', error.message);
    }
  }

  async sendJobCompleted(jobId, outputPath, metadata = {}) {
    const url = config.webhooks.onJobComplete;
    if (!url) return;

    const payload = {
      event: 'job.completed',
      timestamp: new Date().toISOString(),
      data: {
        job_id: jobId,
        output_path: outputPath,
        ...metadata
      }
    };

    try {
      await this.sendWebhook('job_completed', url, payload);
    } catch (error) {
      logger.error('Failed to send job completed webhook:', error.message);
    }
  }

  async sendJobFailed(jobId, errorMessage, metadata = {}) {
    const url = config.webhooks.onJobFailed;
    if (!url) return;

    const payload = {
      event: 'job.failed',
      timestamp: new Date().toISOString(),
      data: {
        job_id: jobId,
        error: errorMessage,
        ...metadata
      }
    };

    try {
      await this.sendWebhook('job_failed', url, payload);
    } catch (error) {
      logger.error('Failed to send job failed webhook:', error.message);
    }
  }

  // Custom webhook for external integrations
  async sendCustomWebhook(url, payload) {
    return this.sendWebhook('custom', url, payload);
  }

  // Batch webhook for multiple job updates
  async sendBatchUpdate(jobUpdates) {
    const url = config.webhooks.onBatchUpdate;
    if (!url) return;

    const payload = {
      event: 'batch.update',
      timestamp: new Date().toISOString(),
      data: {
        jobs: jobUpdates
      }
    };

    try {
      await this.sendWebhook('batch_update', url, payload);
    } catch (error) {
      logger.error('Failed to send batch update webhook:', error.message);
    }
  }

  // Test webhook endpoint
  async testWebhook(url) {
    const payload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook from YouTube Shorts Automation'
      }
    };

    try {
      const response = await this.sendWebhook('test', url, payload);
      return { success: true, response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status
      };
    }
  }
}

module.exports = new WebhookClient();