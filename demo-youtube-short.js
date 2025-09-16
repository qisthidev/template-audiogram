#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('YouTube Short Demo - Remotion');
console.log('==============================\n');

// Example configurations
const examples = [
  {
    name: 'Vertical Layout',
    compositionId: 'YouTubeShort',
    props: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      startTime: 0,
      endTime: 30,
      layout: 'vertical',
      titleText: 'Never Gonna Give You Up - Short Clip',
      backgroundColor: '#1a1a1a',
    }
  },
  {
    name: 'Overlay Layout',
    compositionId: 'YouTubeShort',
    props: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      startTime: 10,
      endTime: 40,
      layout: 'overlay',
      captionsTextColor: 'rgba(255, 255, 255, 1)',
      backgroundColor: '#000000',
    }
  },
  {
    name: 'Video Only',
    compositionId: 'YouTubeShort',
    props: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      startTime: 0,
      endTime: 60,
      layout: 'video-only',
    }
  }
];

console.log('Available Examples:');
examples.forEach((example, index) => {
  console.log(`${index + 1}. ${example.name}`);
});

console.log('\nTo render a YouTube Short, use:');
console.log(`npx remotion render src/index.ts YouTubeShort out/youtube-short.mp4 --props='${JSON.stringify(examples[0].props)}'`);

console.log('\nOr use the Remotion Studio to preview and edit:');
console.log('npm run dev');

console.log('\nYouTube Short Features:');
console.log('- Extract clips from any YouTube video');
console.log('- Add audio visualizers (oscilloscope)');
console.log('- Include captions/subtitles');
console.log('- Multiple layout options');
console.log('- Custom audio replacement');
console.log('- 9:16 aspect ratio for YouTube Shorts format');

console.log('\nSupported YouTube URL formats:');
console.log('- https://www.youtube.com/watch?v=VIDEO_ID');
console.log('- https://youtu.be/VIDEO_ID');
console.log('- https://www.youtube.com/shorts/VIDEO_ID');