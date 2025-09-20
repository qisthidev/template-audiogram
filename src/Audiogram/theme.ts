export type AmpliKitTheme = {
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
    brandOrange: string;
    brandBlue: string;
  };
  spacing: number;
  radii: {
    card: number;
  };
  typography: {
    brandFont: string;
    captionFont: string;
  };
};

export const AMPLIKIT_THEME: AmpliKitTheme = {
  brandName: "AmpliKIT Insights",
  colors: {
    background: "#0A0B0E",
    surface: "#1A1D23",
    primary: "#FF6B35", // Vibrant orange for audio/sound theme
    primaryAccent: "#4A90E2", // Professional blue
    textPrimary: "#F8F9FA",
    textSecondary: "#B8BCC3",
    captionText: "rgba(248, 249, 250, 0.95)",
    waveGradientStart: "#FF6B35",
    waveGradientEnd: "#4A90E2",
    glow: "rgba(255, 107, 53, 0.4)",
    brandOrange: "#FF6B35",
    brandBlue: "#4A90E2",
  },
  spacing: 48,
  radii: {
    card: 16,
  },
  typography: {
    brandFont: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    captionFont: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

// Keep the old theme for backward compatibility
export type FastStackTheme = AmpliKitTheme;
export const FASTSTACK_THEME: FastStackTheme = AMPLIKIT_THEME;

