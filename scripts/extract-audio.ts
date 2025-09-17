#!/usr/bin/env bun
import { $ } from "bun";

type AudioFormat = "wav" | "mp3" | "m4a";

function printUsage(): void {
  console.log(
    "Usage: bun scripts/extract-audio.ts <input.mp4> [output.(wav|mp3|m4a)] [--bitrate 192k]",
  );
  console.log("Defaults: output -> public/audio.wav, bitrate -> 192k for mp3/m4a");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length < 1 || args.includes("-h") || args.includes("--help")) {
    printUsage();
    process.exit(args.length < 1 ? 1 : 0);
  }

  const inputPath = args[0];
  let outputPath = args[1] || "public/audio.wav";
  const bitrateFlagIndex = args.findIndex((a) => a === "--bitrate");
  const bitrate = bitrateFlagIndex !== -1 ? args[bitrateFlagIndex + 1] : "192k";

  const outputExt = (outputPath.split(".").pop() || "wav").toLowerCase() as AudioFormat;

  const commonArgs = ["-y", "-i", inputPath, "-vn"]; // -vn: no video

  let codecArgs: string[] = [];
  if (outputExt === "wav") {
    codecArgs = ["-ac", "2", "-ar", "48000", "-c:a", "pcm_s16le"]; // 48kHz stereo WAV
  } else if (outputExt === "mp3") {
    codecArgs = ["-ac", "2", "-ar", "48000", "-b:a", bitrate, "-c:a", "libmp3lame"];
  } else if (outputExt === "m4a") {
    codecArgs = ["-ac", "2", "-ar", "48000", "-b:a", bitrate, "-c:a", "aac"];
  } else {
    console.error(`Unsupported output format: ${outputExt}`);
    process.exit(2);
  }

  const cmd = ["ffmpeg", ...commonArgs, ...codecArgs, outputPath];

  console.log(`→ Extracting audio: ${inputPath} -> ${outputPath}`);
  try {
    const proc = $`${cmd}`;
    await proc.quiet();
    console.log("✓ Done");
  } catch (err) {
    console.error("✗ ffmpeg failed:", err);
    process.exit(3);
  }
}

main();

