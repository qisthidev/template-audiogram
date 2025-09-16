# YouTube Shorts Automation System

A comprehensive automation system for creating YouTube Shorts at scale with scheduling, queue management, and webhook integration.

## Features

- 🎬 **Automated Video Processing**: Batch process YouTube videos into multiple shorts
- ⏰ **Scheduling System**: Create recurring jobs with cron expressions
- 📊 **Queue Management**: Process multiple videos concurrently with priority support
- 🔗 **Webhook Integration**: Get real-time updates on job status
- 📈 **Analytics & Monitoring**: Track job statistics and performance
- 🛠️ **REST API**: Full-featured API for integration with external systems
- 💻 **CLI Tool**: Command-line interface for easy management

## Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Copy the environment configuration:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

4. Start Redis (required for queue management):
```bash
# Using Docker
docker run -d -p 6379:6379 redis

# Or install locally
# Mac: brew install redis
# Ubuntu: sudo apt-get install redis-server
```

## Usage

### Starting the Automation Server

```bash
# Production mode
npm run automation:start

# Development mode with auto-reload
npm run automation:dev
```

The server will start on `http://localhost:3000` by default.

### Using the CLI

```bash
# Make CLI executable
chmod +x automation/cli.js

# Create a job
npm run automation:cli job:create -c YouTubeShort -u "https://youtube.com/watch?v=VIDEO_ID" -s 0 -e 30 -t "My Short"

# List schedules
npm run automation:cli schedule:list

# Get queue status
npm run automation:cli queue:status

# Get statistics
npm run automation:cli stats -d 7
```

### API Endpoints

#### Jobs

**Create a job**
```bash
POST /api/jobs
{
  "compositionId": "YouTubeShort",
  "props": {
    "videoUrl": "https://youtube.com/watch?v=VIDEO_ID",
    "startTime": 0,
    "endTime": 30,
    "layout": "vertical"
  },
  "priority": 5
}
```

**Get job status**
```bash
GET /api/jobs/:jobId
```

**Cancel a job**
```bash
DELETE /api/jobs/:jobId
```

#### Schedules

**Create a schedule**
```bash
POST /api/schedules
{
  "name": "Daily Morning Short",
  "cronExpression": "0 9 * * *",
  "compositionId": "YouTubeShort",
  "propsTemplate": {
    "videoUrl": "https://youtube.com/watch?v=VIDEO_ID",
    "startTime": 0,
    "endTime": 30,
    "titleText": "Daily Update - {{date}}"
  }
}
```

**List schedules**
```bash
GET /api/schedules
```

**Update schedule**
```bash
PUT /api/schedules/:scheduleId
{
  "enabled": false
}
```

#### Batch Processing

**Process YouTube video clips**
```bash
POST /api/youtube/process
{
  "videoUrl": "https://youtube.com/watch?v=LONG_VIDEO",
  "clips": [
    { "startTime": 0, "endTime": 30, "title": "Part 1" },
    { "startTime": 60, "endTime": 90, "title": "Part 2" }
  ],
  "layout": "vertical"
}
```

### Scheduling Examples

#### Daily Shorts
```javascript
// Every day at 9 AM
"0 9 * * *"

// Twice daily at 9 AM and 6 PM
"0 9,18 * * *"

// Every 30 minutes
"*/30 * * * *"

// Weekdays only at 2 PM
"0 14 * * 1-5"
```

#### Template Variables

Use these variables in your schedule templates:
- `{{date}}` - Current date (YYYY-MM-DD)
- `{{time}}` - Current time (HH:MM:SS)
- `{{timestamp}}` - Unix timestamp
- `{{year}}`, `{{month}}`, `{{day}}`
- `{{hour}}`, `{{minute}}`
- `{{random}}` - Random string

### Webhook Integration

Configure webhooks in your `.env` file:
```env
WEBHOOK_JOB_START=https://your-webhook.com/job-start
WEBHOOK_JOB_COMPLETE=https://your-webhook.com/job-complete
WEBHOOK_JOB_FAILED=https://your-webhook.com/job-failed
```

Webhook payload format:
```json
{
  "event": "job.completed",
  "timestamp": "2023-12-01T10:00:00Z",
  "data": {
    "job_id": "uuid",
    "output_path": "/output/video.mp4",
    "renderTime": 15000,
    "fileSize": 5242880
  }
}
```

## Architecture

### Components

1. **Scheduler** - Manages cron-based scheduled jobs
2. **Queue Manager** - Handles job processing with Bull/Redis
3. **Database** - SQLite for job tracking and analytics
4. **Webhook Client** - Sends notifications to external systems
5. **API Server** - Express.js REST API
6. **CLI Tool** - Command-line interface

### Database Schema

- `jobs` - Tracks all rendering jobs
- `schedules` - Stores recurring job schedules
- `job_history` - Analytics and performance data
- `webhook_logs` - Webhook delivery tracking

## Configuration

Edit `automation/config/automation.config.js` to customize:
- Output directories
- Concurrent job limits
- Retry settings
- Renderer options
- Schedule presets

## Monitoring

### Logs
Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `jobs.log` - Job-specific logs

### Statistics
```bash
# Get weekly stats
npm run automation:cli stats -d 7

# Via API
GET /api/stats?days=30
```

## Best Practices

1. **Resource Management**
   - Limit concurrent jobs based on system resources
   - Use appropriate priority levels for jobs
   - Monitor disk space for output files

2. **Scheduling**
   - Test cron expressions before deploying
   - Use template variables for dynamic content
   - Consider timezone settings

3. **Error Handling**
   - Configure retry attempts for transient failures
   - Set up webhook notifications for failures
   - Monitor error logs regularly

4. **Performance**
   - Use Redis for better queue performance
   - Optimize video clip lengths
   - Consider using multiple worker processes

## Troubleshooting

### Common Issues

1. **Jobs stuck in pending**
   - Check if Redis is running
   - Verify queue worker is processing
   - Check for errors in logs

2. **Schedule not triggering**
   - Validate cron expression
   - Check schedule is enabled
   - Verify server timezone

3. **Webhook failures**
   - Check webhook URL accessibility
   - Verify webhook timeout settings
   - Review webhook logs in database

## Examples

See `automation/examples/` for:
- Daily YouTube shorts scheduling
- Batch processing scripts
- Custom automation workflows

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Submit pull requests

## License

See LICENSE file for details.