import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { Caption } from "@remotion/captions";

const oscilloscopeVisualizerSchema = z.object({
  type: z.literal("oscilloscope"),
  color: zColor(),
  numberOfSamples: z.enum(["32", "64", "128", "256", "512"]),
  windowInSeconds: z.number().min(0.1).default(0.1),
  posterization: z.number().int().min(0.1).default(3),
  amplitude: z.number().int().min(0.1).default(4),
  padding: z.number().int().min(0).default(50),
});

export const youTubeShortSchema = z.object({
  // YouTube video settings
  videoUrl: z.string().url().describe("YouTube video URL"),
  startTime: z.number().min(0).describe("Start time in seconds"),
  endTime: z.number().min(0).describe("End time in seconds"),
  
  // Audio settings (optional - can use video audio or custom audio)
  audioFileUrl: z.string().optional(),
  audioOffsetInSeconds: z.number().min(0).default(0),
  
  // Visualizer settings (optional)
  visualizer: oscilloscopeVisualizerSchema.optional(),
  
  // Captions settings
  captionsFileName: z
    .string()
    .refine((s) => s.endsWith(".srt") || s.endsWith(".json"), {
      message: "Subtitles file must be a .srt or .json file",
    })
    .optional(),
  captionsTextColor: zColor().default("rgba(255, 255, 255, 0.93)"),
  onlyDisplayCurrentSentence: z.boolean().default(true),
  
  // Layout options
  layout: z
    .enum(["vertical", "horizontal", "overlay", "video-only"])
    .default("vertical")
    .describe("Layout style for the video short"),
  
  // Styling
  titleText: z.string().optional(),
  titleColor: zColor().default("rgba(255, 255, 255, 0.93)"),
  backgroundColor: zColor().default("#000000"),
});

export type YouTubeShortSchemaType = z.infer<typeof youTubeShortSchema> & {
  captions: Caption[] | null;
};