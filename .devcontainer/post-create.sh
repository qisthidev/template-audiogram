#!/bin/sh

set -e

echo "🎯 Running post-creation setup..."

# Ensure bun is in PATH
export PATH="$HOME/.bun/bin:$PATH"

# Clean up any existing broken whisper.cpp installation
if [ -d "whisper.cpp" ] && [ ! -f "whisper.cpp/build/bin/whisper-cli" ]; then
    echo "🧹 Cleaning up incomplete whisper.cpp installation..."
    rm -rf whisper.cpp
fi

# Check if audio file exists before transcribing
if [ -f "public/audio.wav" ]; then
    echo "🎵 Audio file found, starting transcription..."
    echo "⏳ This may take a few minutes on first run to compile whisper.cpp..."

    # Run transcription with error handling
    if $HOME/.bun/bin/bun transcribe.ts; then
        echo "✅ Transcription complete!"
    else
        echo "❌ Transcription failed. You can try running 'bun transcribe.ts' manually later."
        echo "💡 Make sure cmake and build tools are installed if whisper.cpp compilation fails."
    fi
else
    echo "⚠️ No audio file found at public/audio.wav"
    echo "💡 Place your audio file at public/audio.wav and run 'bun transcribe.ts' to generate transcription"
fi

echo ""
echo "🚀 Environment is ready! You can now:"
echo "  • Place audio file at public/audio.wav"
echo "  • Run 'bun transcribe.ts' to generate captions"
echo "  • Run 'bun dev' to start the Remotion development server"
echo "  • Use 'bun render' to create your final audiogram video"
