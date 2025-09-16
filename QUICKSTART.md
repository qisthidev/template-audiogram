# YouTube Shorts Automation - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Automation System
```bash
npm run automation:setup
```

### 3. Start Redis (Required for Queue)
```bash
# Using Docker (Recommended)
docker run -d -p 6379:6379 redis

# Or install locally
brew install redis  # Mac
sudo apt-get install redis-server  # Ubuntu
```

### 4. Configure Environment
Edit `.env` file with your settings (optional):
- Webhook URLs
- Email notifications
- Slack integration

### 5. Start the Automation Server
```bash
npm run automation:start
```

## 📹 Creating Your First YouTube Short

### Option 1: Using the CLI
```bash
# Create a single YouTube Short
npm run automation:cli job:create \
  -c YouTubeShort \
  -u "https://youtube.com/watch?v=dQw4w9WgXcQ" \
  -s 0 \
  -e 30 \
  -t "My First Short"

# Check job status
npm run automation:cli job:status <job-id>
```

### Option 2: Using the API
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "YouTubeShort",
    "props": {
      "videoUrl": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "startTime": 0,
      "endTime": 30,
      "layout": "vertical",
      "titleText": "My YouTube Short"
    }
  }'
```

### Option 3: Batch Processing
```bash
curl -X POST http://localhost:3000/api/youtube/process \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://youtube.com/watch?v=YOUR_LONG_VIDEO",
    "clips": [
      {"startTime": 0, "endTime": 30, "title": "Intro"},
      {"startTime": 60, "endTime": 90, "title": "Main Point"},
      {"startTime": 120, "endTime": 150, "title": "Conclusion"}
    ],
    "layout": "vertical"
  }'
```

## ⏰ Setting Up Automated Schedules

### Daily YouTube Short at 9 AM
```bash
curl -X POST http://localhost:3000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Morning Short",
    "cronExpression": "0 9 * * *",
    "compositionId": "YouTubeShort",
    "propsTemplate": {
      "videoUrl": "https://youtube.com/watch?v=VIDEO_ID",
      "startTime": 0,
      "endTime": 30,
      "titleText": "Daily Update - {{date}}"
    }
  }'
```

### View All Schedules
```bash
npm run automation:cli schedule:list
```

## 📊 Monitoring

### Check Queue Status
```bash
npm run automation:cli queue:status
```

### View Statistics
```bash
npm run automation:cli stats -d 7
```

### View Logs
```bash
tail -f logs/combined.log
```

## 🎨 Customization Options

### Layouts
- `vertical` - Video on top, captions below (9:16)
- `horizontal` - Side by side layout
- `overlay` - Full video with overlay captions
- `video-only` - Just the video clip

### Visual Effects
- Oscilloscope audio visualizer
- Customizable colors and styles
- Caption animations
- Title overlays

## 🔧 Common Commands

```bash
# Start automation server
npm run automation:start

# Create a job
npm run automation:cli job:create -c YouTubeShort -u "URL" -s 0 -e 30

# List schedules
npm run automation:cli schedule:list

# Queue status
npm run automation:cli queue:status

# Job statistics
npm run automation:cli stats

# Cancel a job
npm run automation:cli job:cancel <job-id>
```

## 📚 Next Steps

1. Read the full [Automation Documentation](AUTOMATION_README.md)
2. Explore [example scripts](automation/examples/)
3. Set up webhooks for notifications
4. Create custom schedules for your content
5. Integrate with your existing workflow

## 🆘 Need Help?

- Check logs: `logs/error.log`
- Verify Redis is running: `redis-cli ping`
- Ensure .env is configured correctly
- Review API documentation at http://localhost:3000/api-docs

Happy automating! 🎬