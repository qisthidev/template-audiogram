import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

const loading = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
});

export const FONT_FAMILY = fontFamily;

export const waitForFonts = async () => {
  await loading.waitUntilDone();
};
