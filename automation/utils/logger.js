const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config/automation.config');

// Ensure logs directory exists
const logsDir = config.general.logsDirectory || './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'youtube-shorts-automation' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write errors to error.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write job-specific logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'jobs.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
          if (info.jobId || info.scheduleId) {
            return `${info.timestamp} [${info.level}] ${info.message} ${JSON.stringify({
              jobId: info.jobId,
              scheduleId: info.scheduleId,
              ...info.metadata
            })}`;
          }
          return null;
        }),
        winston.format.uncolorize()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
});

// Add console transport if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Helper functions for structured logging
logger.logJob = (level, message, jobId, metadata = {}) => {
  logger.log(level, message, { jobId, ...metadata });
};

logger.logSchedule = (level, message, scheduleId, metadata = {}) => {
  logger.log(level, message, { scheduleId, ...metadata });
};

module.exports = logger;