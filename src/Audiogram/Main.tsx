import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, useVideoConfig } from "remotion";

import { PaginatedCaptions } from "./Captions";
import { Spectrum } from "./Spectrum";
import {
  CAPTIONS_FONT_SIZE,
  CAPTIONS_FONT_WEIGHT,
  LINE_HEIGHT,
  LINES_PER_PAGE,
} from "./constants";
import { Oscilloscope } from "./Oscilloscope";
import { WaitForFonts } from "./WaitForFonts";
import { AudiogramCompositionSchemaType } from "./schema";
import { AMPLIKIT_THEME } from "./theme";

export const Audiogram: React.FC<AudiogramCompositionSchemaType> = ({
  visualizer,
  audioFileUrl,
  coverImageUrl,
  titleText,
  titleColor,
  captionsTextColor,
  onlyDisplayCurrentSentence,
  audioOffsetInSeconds,
  captions,
}) => {
  const { durationInFrames, fps, width } = useVideoConfig();

  if (!captions) {
    throw new Error(
      "subtitles should have been provided through calculateMetadata",
    );
  }

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);
  const baseNumberOfSamples = Number(visualizer.numberOfSamples);

  const textBoxWidth = width - AMPLIKIT_THEME.spacing * 2;

  return (
    <AbsoluteFill>
      <Sequence from={-audioOffsetInFrames}>
        <Audio pauseWhenBuffering src={audioFileUrl} />
        
        {/* Background with gradient */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${AMPLIKIT_THEME.colors.background} 0%, ${AMPLIKIT_THEME.colors.surface} 100%)`,
          }}
        />
        
        {/* Main content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            color: AMPLIKIT_THEME.colors.textPrimary,
            padding: `${AMPLIKIT_THEME.spacing}px`,
            fontFamily: AMPLIKIT_THEME.typography.brandFont,
            position: "relative",
          }}
        >
          {/* Header section with branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: AMPLIKIT_THEME.spacing * 0.5,
            }}
          >
            {/* Brand logo/text */}
            <div
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: AMPLIKIT_THEME.colors.primary,
                letterSpacing: "-0.02em",
              }}
            >
              {AMPLIKIT_THEME.brandName}
            </div>
            
            {/* Audio indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: AMPLIKIT_THEME.colors.textSecondary,
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: AMPLIKIT_THEME.colors.primary,
                  borderRadius: "50%",
                  boxShadow: `0 0 12px ${AMPLIKIT_THEME.colors.glow}`,
                }}
              />
              LIVE
            </div>
          </div>

          {/* Content section */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: AMPLIKIT_THEME.spacing,
              backgroundColor: AMPLIKIT_THEME.colors.surface,
              borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
              padding: `${AMPLIKIT_THEME.spacing * 0.75}px`,
              border: `1px solid rgba(255, 107, 53, 0.1)`,
            }}
          >
            <Img
              style={{
                borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
                maxHeight: "200px",
                maxWidth: "200px",
                objectFit: "cover",
                border: `2px solid ${AMPLIKIT_THEME.colors.primary}`,
              }}
              src={coverImageUrl}
            />
            <div
              style={{
                marginLeft: AMPLIKIT_THEME.spacing,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: titleColor,
                  lineHeight: "1.2",
                  marginBottom: "12px",
                  textShadow: `0 2px 4px rgba(0, 0, 0, 0.3)`,
                }}
              >
                {titleText}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  color: AMPLIKIT_THEME.colors.textSecondary,
                  fontWeight: 500,
                }}
              >
                Podcast Insights • Audio Clip
              </div>
            </div>
          </div>

          {/* Audio visualizer section */}
          <div
            style={{
              backgroundColor: AMPLIKIT_THEME.colors.surface,
              borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
              padding: `${AMPLIKIT_THEME.spacing * 0.5}px`,
              marginBottom: AMPLIKIT_THEME.spacing * 0.75,
              border: `1px solid rgba(74, 144, 226, 0.1)`,
            }}
          >
            {visualizer.type === "oscilloscope" ? (
              <Oscilloscope
                waveColor={visualizer.color || AMPLIKIT_THEME.colors.waveGradientStart}
                padding={visualizer.padding}
                audioSrc={audioFileUrl}
                numberOfSamples={baseNumberOfSamples}
                windowInSeconds={visualizer.windowInSeconds}
                posterization={visualizer.posterization}
                amplitude={visualizer.amplitude}
              />
            ) : visualizer.type === "spectrum" ? (
              <Spectrum
                barColor={visualizer.color || AMPLIKIT_THEME.colors.waveGradientStart}
                audioSrc={audioFileUrl}
                mirrorWave={visualizer.mirrorWave}
                numberOfSamples={baseNumberOfSamples * 4}
                freqRangeStartIndex={visualizer.freqRangeStartIndex}
                waveLinesToDisplay={visualizer.linesToDisplay}
              />
            ) : null}
          </div>

          {/* Captions section */}
          <WaitForFonts>
            <div
              style={{
                backgroundColor: AMPLIKIT_THEME.colors.surface,
                borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
                padding: `${AMPLIKIT_THEME.spacing * 0.75}px`,
                border: `1px solid rgba(255, 107, 53, 0.1)`,
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  lineHeight: `${LINE_HEIGHT}px`,
                  width: textBoxWidth - AMPLIKIT_THEME.spacing * 1.5,
                  fontWeight: CAPTIONS_FONT_WEIGHT,
                  fontSize: CAPTIONS_FONT_SIZE,
                  textAlign: "center",
                  fontFamily: AMPLIKIT_THEME.typography.captionFont,
                }}
              >
                <PaginatedCaptions
                  captions={captions}
                  startFrame={audioOffsetInFrames}
                  endFrame={audioOffsetInFrames + durationInFrames}
                  linesPerPage={LINES_PER_PAGE}
                  subtitlesTextColor={captionsTextColor}
                  onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
                  textBoxWidth={textBoxWidth - AMPLIKIT_THEME.spacing * 1.5}
                />
              </div>
            </div>
          </WaitForFonts>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
