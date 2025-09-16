# YouTube Shorts Functionality Guide

This template now includes functionality to create YouTube Shorts by clipping sections from YouTube videos and combining them with audio visualizers and captions.

## Features

- **YouTube Video Clipping**: Extract specific time ranges from YouTube videos
- **Multiple Layout Options**: Choose from vertical, horizontal, overlay, or video-only layouts
- **Audio Visualizer**: Add oscilloscope visualization to your shorts
- **Captions Support**: Add subtitles with customizable styling
- **Flexible Audio**: Use the original video audio or replace with custom audio

## Usage

### Basic YouTube Short

```typescript
<Composition
  id="YouTubeShort"
  component={YouTubeShort}
  width={1080}
  height={1920}
  defaultProps={{
    videoUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
    startTime: 10, // Start at 10 seconds
    endTime: 40,   // End at 40 seconds
    layout: "vertical",
  }}
/>
```

### Layout Options

1. **vertical** - Video on top, captions and visualizer below
2. **horizontal** - Video on left, captions and visualizer on right
3. **overlay** - Full-screen video with overlaid captions and visualizer
4. **video-only** - Just the video clip, no additional elements

### Adding Custom Audio

Replace the video's audio with your own:

```typescript
defaultProps={{
  videoUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  startTime: 0,
  endTime: 30,
  audioFileUrl: staticFile("custom-audio.mp3"),
  audioOffsetInSeconds: 0,
}}
```

### Customizing the Visualizer

```typescript
visualizer: {
  type: "oscilloscope",
  color: "#F4B941",
  numberOfSamples: "128",
  windowInSeconds: 0.1,
  posterization: 3,
  amplitude: 4,
  padding: 50,
}
```

### Adding Captions

Place your caption file in the `public` folder and reference it:

```typescript
captionsFileName: staticFile("captions.json"),
captionsTextColor: "rgba(255, 255, 255, 0.93)",
onlyDisplayCurrentSentence: true,
```

## Command Line Usage

To render a YouTube Short:

```bash
npx remotion render src/index.ts YouTubeShort out/youtube-short.mp4 \
  --props='{"videoUrl":"https://youtube.com/watch?v=VIDEO_ID","startTime":0,"endTime":30}'
```

## Tips

- Use 9:16 aspect ratio (1080x1920) for standard YouTube Shorts format
- Keep clips under 60 seconds for YouTube Shorts compatibility
- Test different layouts to find what works best for your content
- The overlay layout works well for videos with less visual content at the bottom
- Use high-contrast colors for captions when using overlay mode

## YouTube URL Support

The following YouTube URL formats are supported:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

## Troubleshooting

- If the video doesn't load, check that the YouTube URL is valid
- Some videos may have embedding restrictions
- For best results, ensure your caption timings match the clipped section