module.exports = {
  // General settings
  general: {
    outputDirectory: './output',
    tempDirectory: './temp',
    logsDirectory: './logs',
    maxConcurrentJobs: 2,
    retryAttempts: 3,
    retryDelay: 5000, // ms
  },

  // Renderer settings
  renderer: {
    codec: 'h264',
    imageFormat: 'jpeg',
    jpegQuality: 95,
    frameRange: null,
    everyNthFrame: 1,
    numberOfGifLoops: null,
    concurrency: 1,
    timeoutInMilliseconds: 30000,
    chromiumOptions: {},
    scale: 1,
    port: null,
    envVariables: {},
  },

  // Schedule presets
  schedules: {
    daily: '0 9 * * *', // Every day at 9 AM
    twice_daily: '0 9,18 * * *', // 9 AM and 6 PM
    hourly: '0 * * * *', // Every hour
    every_30_min: '*/30 * * * *', // Every 30 minutes
    weekdays: '0 9 * * 1-5', // Monday to Friday at 9 AM
    weekends: '0 10 * * 0,6', // Weekends at 10 AM
  },

  // Video sources configuration
  sources: {
    youtube: {
      defaultClipDuration: 30, // seconds
      defaultLayout: 'vertical',
      qualityPreference: 'highest', // highest, high, medium, low
    },
    local: {
      watchDirectory: './watch',
      processedDirectory: './processed',
      supportedFormats: ['.mp4', '.mov', '.avi', '.webm'],
    },
  },

  // Webhook settings
  webhooks: {
    onJobStart: process.env.WEBHOOK_JOB_START,
    onJobComplete: process.env.WEBHOOK_JOB_COMPLETE,
    onJobFailed: process.env.WEBHOOK_JOB_FAILED,
    timeout: 5000,
    retries: 2,
  },

  // Database settings
  database: {
    path: './automation/database/automation.db',
    backupInterval: '0 0 * * *', // Daily at midnight
    maxBackups: 7,
  },

  // Queue settings
  queue: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
    },
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  },

  // Notification settings
  notifications: {
    email: {
      enabled: process.env.EMAIL_ENABLED === 'true',
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
    },
    slack: {
      enabled: process.env.SLACK_ENABLED === 'true',
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
    },
  },
};