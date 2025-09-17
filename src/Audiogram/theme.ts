export type FastStackTheme = {
  brandName: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryAccent: string;
    textPrimary: string;
    textSecondary: string;
    captionText: string;
    waveGradientStart: string;
    waveGradientEnd: string;
    glow: string;
  };
  spacing: number;
  radii: {
    card: number;
  };
};

export const FASTSTACK_THEME: FastStackTheme = {
  brandName: "FastStack",
  colors: {
    background: "#0B0D12",
    surface: "#12151D",
    primary: "#0AE2FF",
    primaryAccent: "#7C4DFF",
    textPrimary: "#E6E8F0",
    textSecondary: "#A4A9B6",
    captionText: "rgba(230, 232, 240, 0.92)",
    waveGradientStart: "#0AE2FF",
    waveGradientEnd: "#7C4DFF",
    glow: "rgba(10, 226, 255, 0.45)",
  },
  spacing: 48,
  radii: {
    card: 12,
  },
};

