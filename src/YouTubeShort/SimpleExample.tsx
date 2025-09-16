import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { YouTubeVideo } from "../YouTubeVideo/YouTubeVideo";
import { FONT_FAMILY } from "../Audiogram/font";

// Simple example showing just YouTube video with a title overlay
export const SimpleYouTubeShort: React.FC<{
  videoUrl: string;
  startTime: number;
  endTime: number;
  title?: string;
}> = ({ videoUrl, startTime, endTime, title }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* YouTube Video Background */}
      <AbsoluteFill>
        <YouTubeVideo
          videoUrl={videoUrl}
          startTime={startTime}
          endTime={endTime}
          muted={false}
        />
      </AbsoluteFill>

      {/* Title Overlay */}
      {title && (
        <Sequence from={0} durationInFrames={90}>
          <AbsoluteFill
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "0 40px 100px 40px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "20px 30px",
                borderRadius: "15px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#fff",
                  textAlign: "center",
                  margin: 0,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {title}
              </h2>
            </div>
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};