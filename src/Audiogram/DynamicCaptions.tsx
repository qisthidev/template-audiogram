import React, { useMemo } from "react";
import { PaginatedCaptions } from "./Captions";
import { Caption } from "@remotion/captions";
import { AMPLIKIT_THEME } from "./theme";

interface DynamicCaptionsProps {
  captions: Caption[];
  startFrame: number;
  endFrame: number;
  linesPerPage: number;
  subtitlesTextColor: string;
  onlyDisplayCurrentSentence: boolean;
  textBoxWidth: number;
  containerHeight: number;
}

export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  captions,
  startFrame,
  endFrame,
  linesPerPage,
  subtitlesTextColor,
  onlyDisplayCurrentSentence,
  textBoxWidth,
  containerHeight,
}) => {

  // Calculate dynamic font size based on container dimensions and content
  const dynamicStyles = useMemo(() => {
    // Base calculations
    const availableWidth = textBoxWidth;
    const availableHeight = containerHeight;
    
    // Estimate content length to adjust font size accordingly
    const averageContentLength = captions.reduce((acc, caption) => acc + caption.text.length, 0) / Math.max(captions.length, 1);
    const contentLengthFactor = Math.min(1, Math.max(0.6, 1 - (averageContentLength - 50) / 200)); // Scale down for longer content
    
    // Calculate optimal font size based on available space
    const baseHeightRatio = 0.15; // 15% of container height as base
    const baseWidthRatio = 0.045; // 4.5% of container width as base
    
    const heightBasedSize = availableHeight * baseHeightRatio * contentLengthFactor;
    const widthBasedSize = availableWidth * baseWidthRatio * contentLengthFactor;
    
    // Use the smaller of the two to ensure text fits, with preference for height-based sizing
    let fontSize = Math.min(heightBasedSize, widthBasedSize * 1.2); // Slight preference for height
    
    // Apply constraints based on container size
    const minFontSize = Math.max(20, availableHeight * 0.08); // Minimum 8% of height
    const maxFontSize = Math.min(100, availableHeight * 0.25); // Maximum 25% of height
    
    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));
    
    // Calculate line height as a ratio of font size (tighter for larger text)
    const lineHeightRatio = fontSize > 60 ? 1.2 : fontSize > 40 ? 1.25 : 1.3;
    const lineHeight = fontSize * lineHeightRatio;
    
    // Calculate maximum lines that can fit with some padding
    const paddingHeight = 20; // Reserve some space for padding
    const maxLines = Math.floor((availableHeight - paddingHeight) / lineHeight);
    const effectiveLinesPerPage = Math.max(1, Math.min(linesPerPage, maxLines));
    
    // Adjust font weight based on size for better readability
    const fontWeight = fontSize > 50 ? 700 : fontSize > 35 ? 600 : 500;
    
    return {
      fontSize: `${Math.round(fontSize)}px`,
      lineHeight: `${Math.round(lineHeight)}px`,
      fontWeight,
      effectiveLinesPerPage,
      contentLengthFactor,
    };
  }, [textBoxWidth, containerHeight, linesPerPage, captions]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: AMPLIKIT_THEME.typography.captionFont,
        fontSize: dynamicStyles.fontSize,
        lineHeight: dynamicStyles.lineHeight,
        fontWeight: dynamicStyles.fontWeight,
        textAlign: "center",
        overflow: "hidden",
        wordWrap: "break-word",
        hyphens: "auto",
      }}
    >
      <PaginatedCaptions
        captions={captions}
        startFrame={startFrame}
        endFrame={endFrame}
        linesPerPage={dynamicStyles.effectiveLinesPerPage}
        subtitlesTextColor={subtitlesTextColor}
        onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
        textBoxWidth={textBoxWidth}
      />
    </div>
  );
};