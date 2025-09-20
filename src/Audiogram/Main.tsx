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
  sourceCredit,
  sourceCreditColor,
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
            boxSizing: "border-box",
            overflow: "hidden", // Prevent any content from escaping
          }}
        >
          {/* Header section with branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: AMPLIKIT_THEME.spacing * 0.3, // Reduced spacing
              flexShrink: 0, // Prevent shrinking
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
              marginBottom: AMPLIKIT_THEME.spacing * 0.6, // Reduced spacing
              backgroundColor: AMPLIKIT_THEME.colors.surface,
              borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
              padding: `${AMPLIKIT_THEME.spacing * 0.6}px`, // Reduced padding
              border: `1px solid rgba(255, 107, 53, 0.1)`,
              flexShrink: 0, // Prevent shrinking
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
                  marginBottom: "8px",
                }}
              >
                Repurposed Content • Boosting Engagement
              </div>
              {sourceCredit && (
                <div
                  style={{
                    fontSize: "14px",
                    color: sourceCreditColor || AMPLIKIT_THEME.colors.primary,
                    fontWeight: 600,
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    border: `1px solid rgba(255, 107, 53, 0.3)`,
                    display: "inline-block",
                  }}
                >
                  Source: {sourceCredit}
                </div>
              )}
            </div>
          </div>

          {/* Audio visualizer section */}
          <div
            style={{
              backgroundColor: AMPLIKIT_THEME.colors.surface,
              borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
              padding: `${AMPLIKIT_THEME.spacing * 0.4}px`, // Reduced padding
              marginBottom: AMPLIKIT_THEME.spacing * 0.5, // Reduced spacing
              border: `1px solid rgba(74, 144, 226, 0.1)`,
              flexShrink: 0, // Prevent shrinking
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
                overflow: "hidden", // Prevent overflow
                minHeight: "120px", // Ensure minimum height
                maxHeight: "200px", // Limit maximum height
              }}
            >
              <div
                style={{
                  lineHeight: `${LINE_HEIGHT}px`,
                  width: "100%",
                  maxWidth: textBoxWidth - AMPLIKIT_THEME.spacing * 3, // More conservative width
                  fontWeight: CAPTIONS_FONT_WEIGHT,
                  fontSize: CAPTIONS_FONT_SIZE,
                  textAlign: "center",
                  fontFamily: AMPLIKIT_THEME.typography.captionFont,
                  overflow: "hidden", // Prevent text overflow
                  wordWrap: "break-word", // Break long words
                  hyphens: "auto", // Allow hyphenation
                  padding: "0 16px", // Add horizontal padding
                  boxSizing: "border-box",
                }}
              >
                <PaginatedCaptions
                  captions={captions}
                  startFrame={audioOffsetInFrames}
                  endFrame={audioOffsetInFrames + durationInFrames}
                  linesPerPage={LINES_PER_PAGE}
                  subtitlesTextColor={captionsTextColor}
                  onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
                  textBoxWidth={textBoxWidth - AMPLIKIT_THEME.spacing * 4} // Even more conservative
                />
              </div>
            </div>
          </WaitForFonts>

          {/* Footer with repurposing message */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "12px", // Reduced margin
              padding: "8px 16px", // Reduced padding
              backgroundColor: "rgba(255, 107, 53, 0.05)",
              borderRadius: `${AMPLIKIT_THEME.radii.card}px`,
              border: "1px solid rgba(255, 107, 53, 0.1)",
              flexShrink: 0, // Prevent shrinking
            }}
          >
            <div
              style={{
                fontSize: "12px", // Reduced font size
                color: AMPLIKIT_THEME.colors.textSecondary,
                fontWeight: 500,
                textAlign: "center",
                lineHeight: "1.2", // Tighter line height
              }}
            >
              💡 Transforming low-engagement content into viral clips
            </div>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
