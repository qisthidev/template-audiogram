const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Example: Create a daily schedule for YouTube Shorts
async function createDailyYouTubeSchedule() {
  try {
    // Schedule 1: Daily motivational short at 9 AM
    const motivationalSchedule = await axios.post(`${API_URL}/schedules`, {
      name: 'Daily Motivational Short',
      cronExpression: '0 9 * * *', // Every day at 9 AM
      compositionId: 'YouTubeShort',
      propsTemplate: {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        startTime: 0,
        endTime: 30,
        layout: 'vertical',
        titleText: 'Daily Motivation - {{date}}',
        backgroundColor: '#1a1a1a',
        visualizer: {
          type: 'oscilloscope',
          color: '#F4B941',
          numberOfSamples: '64',
          windowInSeconds: 0.1,
          posterization: 3,
          amplitude: 4,
          padding: 50
        }
      }
    });

    console.log('Created motivational schedule:', motivationalSchedule.data);

    // Schedule 2: Tech tips every weekday at 2 PM
    const techTipsSchedule = await axios.post(`${API_URL}/schedules`, {
      name: 'Weekday Tech Tips',
      cronExpression: '0 14 * * 1-5', // Monday to Friday at 2 PM
      compositionId: 'YouTubeShort',
      propsTemplate: {
        videoUrl: 'https://www.youtube.com/watch?v=TECH_VIDEO_ID',
        startTime: 10,
        endTime: 40,
        layout: 'overlay',
        titleText: 'Tech Tip #{{random}}',
        captionsTextColor: 'rgba(255, 255, 255, 1)',
        backgroundColor: '#000000'
      }
    });

    console.log('Created tech tips schedule:', techTipsSchedule.data);

    // Schedule 3: Weekend entertainment shorts
    const weekendSchedule = await axios.post(`${API_URL}/schedules`, {
      name: 'Weekend Entertainment',
      cronExpression: '0 18 * * 0,6', // Saturday and Sunday at 6 PM
      compositionId: 'YouTubeShort',
      propsTemplate: {
        videoUrl: 'https://www.youtube.com/watch?v=ENTERTAINMENT_ID',
        startTime: 0,
        endTime: 60,
        layout: 'video-only'
      }
    });

    console.log('Created weekend schedule:', weekendSchedule.data);

  } catch (error) {
    console.error('Failed to create schedules:', error.response?.data || error.message);
  }
}

// Example: Process multiple clips from a single YouTube video
async function processBatchYouTubeClips() {
  try {
    const response = await axios.post(`${API_URL}/youtube/process`, {
      videoUrl: 'https://www.youtube.com/watch?v=YOUR_LONG_VIDEO',
      clips: [
        { startTime: 0, endTime: 30, title: 'Introduction' },
        { startTime: 60, endTime: 90, title: 'Main Point #1' },
        { startTime: 120, endTime: 150, title: 'Main Point #2' },
        { startTime: 180, endTime: 210, title: 'Conclusion' }
      ],
      layout: 'vertical',
      visualizer: true,
      captions: true
    });

    console.log('Batch processing started:', response.data);
  } catch (error) {
    console.error('Failed to process batch:', error.response?.data || error.message);
  }
}

// Example: Create a one-time render job
async function createSingleJob() {
  try {
    const response = await axios.post(`${API_URL}/jobs`, {
      compositionId: 'YouTubeShort',
      props: {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        startTime: 15,
        endTime: 45,
        layout: 'vertical',
        titleText: 'Custom YouTube Short',
        backgroundColor: '#1a1a1a',
        visualizer: {
          type: 'oscilloscope',
          color: '#00ff00',
          numberOfSamples: '128',
          windowInSeconds: 0.1,
          posterization: 5,
          amplitude: 3,
          padding: 30
        }
      },
      priority: 8, // Higher priority
      webhook: 'https://your-webhook-url.com/job-updates'
    });

    console.log('Job created:', response.data);

    // Check job status after 5 seconds
    setTimeout(async () => {
      const status = await axios.get(`${API_URL}/jobs/${response.data.jobId}`);
      console.log('Job status:', status.data);
    }, 5000);

  } catch (error) {
    console.error('Failed to create job:', error.response?.data || error.message);
  }
}

// Example: Get statistics
async function getStats() {
  try {
    const response = await axios.get(`${API_URL}/stats?days=7`);
    console.log('Weekly Statistics:', response.data);
  } catch (error) {
    console.error('Failed to get stats:', error.response?.data || error.message);
  }
}

// Run examples
async function runExamples() {
  console.log('YouTube Shorts Automation Examples\n');
  
  console.log('1. Creating daily schedules...');
  await createDailyYouTubeSchedule();
  
  console.log('\n2. Processing batch clips...');
  await processBatchYouTubeClips();
  
  console.log('\n3. Creating single job...');
  await createSingleJob();
  
  console.log('\n4. Getting statistics...');
  await getStats();
}

// Run if executed directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  createDailyYouTubeSchedule,
  processBatchYouTubeClips,
  createSingleJob,
  getStats
};