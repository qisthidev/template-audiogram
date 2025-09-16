import React from "react";
import { Composition, staticFile } from "remotion";
import { YouTubeShort } from "./Main";
import { youTubeShortSchema } from "./schema";
import { getSubtitles } from "../helpers/fetch-captions";
import { FPS } from "../helpers/ms-to-frame";
import { parseMedia } from "@remotion/media-parser";

// Example configurations for different YouTube Short layouts
export const YouTubeShortExamples = () => {
  return (
    <>
      {/* Vertical Layout - Video on top, captions below */}
      <Composition
        id="YouTubeShort-Vertical"
        component={YouTubeShort}
        width={1080}
        height={1920}
        schema={youTubeShortSchema}
        defaultProps={{
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          startTime: 0,
          endTime: 30,
          audioFileUrl: staticFile("audio.wav"),
          audioOffsetInSeconds: 0,
          captions: null,
          captionsFileName: staticFile("captions.json"),
          onlyDisplayCurrentSentence: true,
          captionsTextColor: "rgba(255, 255, 255, 0.93)",
          layout: "vertical",
          titleText: "Vertical Layout Demo",
          titleColor: "rgba(255, 255, 255, 0.93)",
          backgroundColor: "#1a1a1a",
          visualizer: {
            type: "oscilloscope",
            color: "#F4B941",
            numberOfSamples: "64" as const,
            windowInSeconds: 0.1,
            posterization: 3,
            amplitude: 4,
            padding: 50,
          },
        }}
        calculateMetadata={async ({ props }) => {
          const captions = props.captionsFileName
            ? await getSubtitles(props.captionsFileName)
            : null;
          const duration = props.endTime - props.startTime;
          return {
            durationInFrames: Math.floor(duration * FPS),
            props: { ...props, captions },
            fps: FPS,
          };
        }}
      />

      {/* Overlay Layout - Video fullscreen with captions overlay */}
      <Composition
        id="YouTubeShort-Overlay"
        component={YouTubeShort}
        width={1080}
        height={1920}
        schema={youTubeShortSchema}
        defaultProps={{
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          startTime: 0,
          endTime: 30,
          captions: null,
          captionsFileName: staticFile("captions.json"),
          onlyDisplayCurrentSentence: true,
          captionsTextColor: "rgba(255, 255, 255, 1)",
          layout: "overlay",
          backgroundColor: "#000000",
          visualizer: {
            type: "oscilloscope",
            color: "#00ff00",
            numberOfSamples: "128" as const,
            windowInSeconds: 0.1,
            posterization: 5,
            amplitude: 3,
            padding: 30,
          },
        }}
        calculateMetadata={async ({ props }) => {
          const captions = props.captionsFileName
            ? await getSubtitles(props.captionsFileName)
            : null;
          const duration = props.endTime - props.startTime;
          return {
            durationInFrames: Math.floor(duration * FPS),
            props: { ...props, captions },
            fps: FPS,
          };
        }}
      />

      {/* Video Only - Just the YouTube video clip */}
      <Composition
        id="YouTubeShort-VideoOnly"
        component={YouTubeShort}
        width={1080}
        height={1920}
        schema={youTubeShortSchema}
        defaultProps={{
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          startTime: 0,
          endTime: 60,
          layout: "video-only",
          backgroundColor: "#000000",
        }}
        calculateMetadata={async ({ props }) => {
          const duration = props.endTime - props.startTime;
          return {
            durationInFrames: Math.floor(duration * FPS),
            props: { ...props, captions: null },
            fps: FPS,
          };
        }}
      />
    </>
  );
};