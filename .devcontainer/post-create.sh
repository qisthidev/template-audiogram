#!/bin/bash

set -e

echo "🎯 Running post-creation setup..."

# Ensure bun is in PATH
export PATH="$HOME/.bun/bin:$PATH"

# Check if audio file exists before transcribing
if [ -f "public/audio.wav" ]; then
    echo "🎵 Audio file found, starting transcription..."
    $HOME/.bun/bin/bun transcribe.ts
    echo "✅ Transcription complete!"
else
    echo "⚠️ No audio file found at public/audio.wav"
    echo "💡 Place your audio file at public/audio.wav and run 'bun transcribe.ts' to generate transcription"
fi

echo "🚀 Environment is ready! You can now:"
echo "  • Place audio file at public/audio.wav"
echo "  • Run 'bun transcribe.ts' to generate captions"
echo "  • Use the Remotion tools to create your audiogram"
