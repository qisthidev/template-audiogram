import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { YouTubeVideo } from "../YouTubeVideo/YouTubeVideo";
import { Oscilloscope } from "../Audiogram/Oscilloscope";
import { PaginatedCaptions } from "../Audiogram/Captions";
import { WaitForFonts } from "../Audiogram/WaitForFonts";
import { FONT_FAMILY } from "../Audiogram/font";
import {
  CAPTIONS_FONT_SIZE,
  CAPTIONS_FONT_WEIGHT,
  LINE_HEIGHT,
  LINES_PER_PAGE,
} from "../Audiogram/constants";
import { YouTubeShortSchemaType } from "./schema";

export const YouTubeShort: React.FC<YouTubeShortSchemaType> = ({
  videoUrl,
  startTime,
  endTime,
  audioFileUrl,
  audioOffsetInSeconds,
  visualizer,
  captions,
  captionsTextColor,
  onlyDisplayCurrentSentence,
  layout,
  titleText,
  titleColor,
  backgroundColor,
}) => {
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  if (!captions) {
    throw new Error(
      "subtitles should have been provided through calculateMetadata"
    );
  }

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);
  const baseNumberOfSamples = Number(visualizer.numberOfSamples);

  // Calculate layout dimensions based on layout type
  const getLayoutDimensions = () => {
    switch (layout) {
      case "vertical":
        return {
          videoHeight: height * 0.4,
          videoWidth: width,
          visualizerHeight: height * 0.2,
          captionsHeight: height * 0.4,
        };
      case "horizontal":
        return {
          videoHeight: height,
          videoWidth: width * 0.6,
          visualizerHeight: height * 0.3,
          captionsHeight: height * 0.7,
        };
      case "overlay":
        return {
          videoHeight: height,
          videoWidth: width,
          visualizerHeight: height * 0.2,
          captionsHeight: height * 0.3,
        };
      default:
        return {
          videoHeight: height,
          videoWidth: width,
          visualizerHeight: 0,
          captionsHeight: 0,
        };
    }
  };

  const dimensions = getLayoutDimensions();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <Sequence from={-audioOffsetInFrames}>
        <Audio pauseWhenBuffering src={audioFileUrl} />

        {/* YouTube Video */}
        {layout === "vertical" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              width: dimensions.videoWidth,
              height: dimensions.videoHeight,
              overflow: "hidden",
            }}
          >
            <YouTubeVideo
              videoUrl={videoUrl}
              startTime={startTime}
              endTime={endTime}
              muted={!!audioFileUrl}
            />
          </div>
        )}

        {layout === "horizontal" && (
          <div
            style={{
              position: "absolute",
              left: 0,
              width: dimensions.videoWidth,
              height: dimensions.videoHeight,
              overflow: "hidden",
            }}
          >
            <YouTubeVideo
              videoUrl={videoUrl}
              startTime={startTime}
              endTime={endTime}
              muted={!!audioFileUrl}
            />
          </div>
        )}

        {layout === "overlay" && (
          <div
            style={{
              position: "absolute",
              width: dimensions.videoWidth,
              height: dimensions.videoHeight,
              zIndex: 0,
            }}
          >
            <YouTubeVideo
              videoUrl={videoUrl}
              startTime={startTime}
              endTime={endTime}
              muted={!!audioFileUrl}
            />
          </div>
        )}

        {layout === "video-only" && (
          <AbsoluteFill>
            <YouTubeVideo
              videoUrl={videoUrl}
              startTime={startTime}
              endTime={endTime}
              muted={!!audioFileUrl}
            />
          </AbsoluteFill>
        )}

        {/* Title */}
        {titleText && layout !== "video-only" && (
          <div
            style={{
              position: "absolute",
              top: layout === "vertical" ? dimensions.videoHeight + 20 : 20,
              left: layout === "horizontal" ? dimensions.videoWidth + 20 : 20,
              right: 20,
              fontFamily: FONT_FAMILY,
              fontSize: 36,
              fontWeight: 800,
              color: titleColor,
              zIndex: 2,
            }}
          >
            {titleText}
          </div>
        )}

        {/* Visualizer */}
        {visualizer && layout !== "video-only" && (
          <div
            style={{
              position: "absolute",
              top:
                layout === "vertical"
                  ? dimensions.videoHeight + (titleText ? 80 : 20)
                  : layout === "horizontal"
                  ? titleText
                    ? 80
                    : 20
                  : height - dimensions.visualizerHeight,
              left: layout === "horizontal" ? dimensions.videoWidth + 20 : 20,
              right: 20,
              height: dimensions.visualizerHeight,
              zIndex: layout === "overlay" ? 1 : 0,
            }}
          >
            <Oscilloscope
              waveColor={visualizer.color}
              padding={visualizer.padding}
              audioSrc={audioFileUrl}
              numberOfSamples={baseNumberOfSamples}
              windowInSeconds={visualizer.windowInSeconds}
              posterization={visualizer.posterization}
              amplitude={visualizer.amplitude}
            />
          </div>
        )}

        {/* Captions */}
        {captions && layout !== "video-only" && (
          <WaitForFonts>
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: layout === "horizontal" ? dimensions.videoWidth + 20 : 20,
                right: 20,
                fontFamily: FONT_FAMILY,
                lineHeight: `${LINE_HEIGHT}px`,
                fontWeight: CAPTIONS_FONT_WEIGHT,
                fontSize: CAPTIONS_FONT_SIZE,
                zIndex: layout === "overlay" ? 1 : 0,
                backgroundColor:
                  layout === "overlay"
                    ? "rgba(0, 0, 0, 0.7)"
                    : "transparent",
                padding: layout === "overlay" ? "20px" : 0,
                borderRadius: layout === "overlay" ? "10px" : 0,
              }}
            >
              <PaginatedCaptions
                captions={captions}
                startFrame={audioOffsetInFrames}
                endFrame={audioOffsetInFrames + durationInFrames}
                linesPerPage={LINES_PER_PAGE}
                subtitlesTextColor={captionsTextColor}
                onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
                textBoxWidth={width - (layout === "horizontal" ? dimensions.videoWidth + 40 : 40)}
              />
            </div>
          </WaitForFonts>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};