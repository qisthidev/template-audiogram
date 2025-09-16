import React from "react";
import { IframeEmbed, OffthreadVideo } from "remotion";
import { z } from "zod";
import { extractYouTubeId, createYouTubeEmbedUrl } from "../helpers/youtube-utils";

export const youTubeVideoSchema = z.object({
  videoUrl: z.string().url(),
  startTime: z.number().min(0).describe("Start time in seconds"),
  endTime: z.number().min(0).describe("End time in seconds"),
  muted: z.boolean().default(false),
});

export type YouTubeVideoProps = z.infer<typeof youTubeVideoSchema>;

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  videoUrl,
  startTime,
  endTime,
  muted,
}) => {
  const videoId = extractYouTubeId(videoUrl);
  
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  // Create YouTube embed URL with autoplay and time parameters
  const embedUrl = createYouTubeEmbedUrl(videoId, {
    startTime,
    endTime,
    muted,
    autoplay: true,
    controls: false,
    loop: false,
  });

  return (
    <IframeEmbed
      src={embedUrl}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
};

// Alternative component using direct video file URL (if available)
export const YouTubeVideoOffthread: React.FC<{
  videoUrl: string;
  startTime: number;
  endTime: number;
  muted?: boolean;
}> = ({ videoUrl, startTime, endTime, muted = false }) => {
  return (
    <OffthreadVideo
      src={videoUrl}
      startFrom={startTime * 30} // Assuming 30 fps
      endAt={endTime * 30}
      muted={muted}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
};