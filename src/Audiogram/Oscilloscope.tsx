import {
  createSmoothSvgPath,
  visualizeAudioWaveform,
} from "@remotion/media-utils";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useWindowedAudioDataIfPossible } from "../helpers/use-windowed-audio-data-if-possible";
import { FASTSTACK_THEME } from "./theme";

const height = 120;
const container: React.CSSProperties = {
  overflow: "visible",
  height,
  marginTop: 40,
  marginBottom: 40,
};

const OscilloscopeContainer: React.FC<{
  children?: React.ReactNode;
  padding: number;
}> = ({ children, padding }) => {
  const { width } = useVideoConfig();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={container}
      width={width - padding * 2}
      height={height}
    >
      {children}
    </svg>
  );
};

export const Oscilloscope: React.FC<{
  audioSrc: string;
  padding: number;
  numberOfSamples: number;
  windowInSeconds: number;
  posterization: number;
  amplitude: number;
  waveColor: string;
}> = ({
  padding,
  numberOfSamples,
  windowInSeconds,
  posterization,
  amplitude,
  audioSrc,
  waveColor,
}) => {
  const { width, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const posterized = Math.round(frame / posterization) * posterization;

  const { audioData, dataOffsetInSeconds } = useWindowedAudioDataIfPossible({
    fps,
    frame,
    src: audioSrc,
    windowInSeconds: 10,
  });

  if (!audioData) {
    return <OscilloscopeContainer padding={padding} />;
  }

  const waveform = visualizeAudioWaveform({
    fps,
    frame: posterized,
    audioData: audioData,
    numberOfSamples,
    windowInSeconds: windowInSeconds,
    channel: 0,
    dataOffsetInSeconds: dataOffsetInSeconds,
  });

  const p = createSmoothSvgPath({
    points: waveform.map((y, i) => {
      return {
        x: (i / (waveform.length - 1)) * width,
        y: height / 2 + ((y * height) / 2) * amplitude,
      };
    }),
  });

  return (
    <OscilloscopeContainer padding={padding}>
      <defs>
        <linearGradient id="faststackWave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={FASTSTACK_THEME.colors.waveGradientStart} />
          <stop offset="100%" stopColor={FASTSTACK_THEME.colors.waveGradientEnd} />
        </linearGradient>
        <filter id="faststackGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={waveColor || "url(#faststackWave)"}
        strokeWidth={Math.min(16, Math.max(6, 6 + (waveform.reduce((a, b) => a + Math.abs(b), 0) / waveform.length) * 20))}
        d={p}
        filter={"url(#faststackGlow)"}
      />
    </OscilloscopeContainer>
  );
};
