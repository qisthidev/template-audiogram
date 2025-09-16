const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/automation.config');

class AutomationDatabase {
  constructor() {
    this.dbPath = config.database.path;
    this.ensureDirectoryExists();
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  ensureDirectoryExists() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  initializeSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    this.db.exec(schema);
  }

  // Job management
  createJob(jobData) {
    const stmt = this.db.prepare(`
      INSERT INTO jobs (job_id, type, status, composition_id, props, priority, metadata)
      VALUES (@job_id, @type, @status, @composition_id, @props, @priority, @metadata)
    `);
    
    return stmt.run({
      ...jobData,
      props: JSON.stringify(jobData.props),
      metadata: jobData.metadata ? JSON.stringify(jobData.metadata) : null,
    });
  }

  updateJob(jobId, updates) {
    const fields = Object.keys(updates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const stmt = this.db.prepare(`
      UPDATE jobs SET ${fields} WHERE job_id = @job_id
    `);
    
    return stmt.run({ ...updates, job_id: jobId });
  }

  getJob(jobId) {
    const stmt = this.db.prepare('SELECT * FROM jobs WHERE job_id = ?');
    const job = stmt.get(jobId);
    
    if (job) {
      job.props = JSON.parse(job.props);
      if (job.metadata) job.metadata = JSON.parse(job.metadata);
    }
    
    return job;
  }

  getPendingJobs(limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM jobs 
      WHERE status = 'pending' 
      ORDER BY priority DESC, created_at ASC 
      LIMIT ?
    `);
    
    const jobs = stmt.all(limit);
    return jobs.map(job => ({
      ...job,
      props: JSON.parse(job.props),
      metadata: job.metadata ? JSON.parse(job.metadata) : null,
    }));
  }

  // Schedule management
  createSchedule(scheduleData) {
    const stmt = this.db.prepare(`
      INSERT INTO schedules (schedule_id, name, cron_expression, composition_id, props_template)
      VALUES (@schedule_id, @name, @cron_expression, @composition_id, @props_template)
    `);
    
    return stmt.run({
      ...scheduleData,
      props_template: JSON.stringify(scheduleData.props_template),
    });
  }

  updateSchedule(scheduleId, updates) {
    const fields = Object.keys(updates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const stmt = this.db.prepare(`
      UPDATE schedules 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP 
      WHERE schedule_id = @schedule_id
    `);
    
    if (updates.props_template) {
      updates.props_template = JSON.stringify(updates.props_template);
    }
    
    return stmt.run({ ...updates, schedule_id: scheduleId });
  }

  getActiveSchedules() {
    const stmt = this.db.prepare(`
      SELECT * FROM schedules 
      WHERE enabled = 1
    `);
    
    const schedules = stmt.all();
    return schedules.map(schedule => ({
      ...schedule,
      props_template: JSON.parse(schedule.props_template),
    }));
  }

  // Job history and analytics
  recordJobHistory(historyData) {
    const stmt = this.db.prepare(`
      INSERT INTO job_history (job_id, schedule_id, render_time_ms, file_size_bytes, composition_id, success)
      VALUES (@job_id, @schedule_id, @render_time_ms, @file_size_bytes, @composition_id, @success)
    `);
    
    return stmt.run(historyData);
  }

  getJobStats(days = 7) {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total_jobs,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_jobs,
        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_jobs,
        AVG(render_time_ms) as avg_render_time,
        SUM(file_size_bytes) as total_file_size
      FROM job_history
      WHERE created_at > datetime('now', '-' || ? || ' days')
    `);
    
    return stmt.get(days);
  }

  // Webhook logging
  logWebhook(webhookData) {
    const stmt = this.db.prepare(`
      INSERT INTO webhook_logs (webhook_type, url, payload, response_status, response_body, success)
      VALUES (@webhook_type, @url, @payload, @response_status, @response_body, @success)
    `);
    
    return stmt.run({
      ...webhookData,
      payload: JSON.stringify(webhookData.payload),
      response_body: webhookData.response_body ? JSON.stringify(webhookData.response_body) : null,
    });
  }

  // Cleanup old records
  cleanupOldRecords(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const stmt1 = this.db.prepare('DELETE FROM jobs WHERE created_at < ? AND status IN ("completed", "failed")');
    const stmt2 = this.db.prepare('DELETE FROM job_history WHERE created_at < ?');
    const stmt3 = this.db.prepare('DELETE FROM webhook_logs WHERE created_at < ?');
    
    const result = this.db.transaction(() => {
      const r1 = stmt1.run(cutoffDate.toISOString());
      const r2 = stmt2.run(cutoffDate.toISOString());
      const r3 = stmt3.run(cutoffDate.toISOString());
      return {
        jobs: r1.changes,
        history: r2.changes,
        webhooks: r3.changes,
      };
    })();
    
    return result;
  }

  close() {
    this.db.close();
  }
}

module.exports = new AutomationDatabase();