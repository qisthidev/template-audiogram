# Devcontainer Setup

This repository is configured with GitHub Codespaces for automatic environment setup.

## What happens automatically

When you create a new Codespace, the following will be set up automatically:

1. **Machine Specifications**: 4-core CPU, 16GB RAM, 32GB storage
2. **Dependencies Installation**:
   - ffmpeg (for audio processing)
   - cmake and build-essential (for whisper.cpp compilation)
   - bun (JavaScript runtime)
   - Chrome dependencies (for Remotion)
   - Project dependencies via `bun install`
3. **Transcription**: If `public/audio.wav` exists, it will be transcribed automatically using whisper.cpp

## Manual steps after Codespace creation

1. **Place your audio file**: Copy your audio file to `public/audio.wav`
2. **Run transcription** (if not done automatically): `bun transcribe.ts`
3. **Start development server**: `bun dev` to preview your audiogram
4. **Generate final video**: `bun render` to create your final audiogram video

## Available commands

- `bun transcribe.ts` - Transcribe audio file to generate captions
- `bun dev` - Start Remotion development server
- `bun render` - Render final audiogram video
- `bun extract-audio` - Extract audio from video files

## Configuration files

- `.devcontainer/devcontainer.json`: Main devcontainer configuration
- `.devcontainer/setup.sh`: Dependency installation script (runs on container creation)
- `.devcontainer/post-create.sh`: Post-creation automation script (runs after setup)

## Troubleshooting

If the automatic setup fails:

1. **Rebuild container**: Use "Codespaces: Rebuild Container" command
2. **Manual setup**: Run `.devcontainer/setup.sh` manually
3. **Path issues**: Ensure bun is in PATH: `export PATH="$HOME/.bun/bin:$PATH"`
4. **Dependencies**: Install manually: `bun install`
5. **Whisper.cpp issues**:
   - Delete whisper.cpp folder: `rm -rf whisper.cpp`
   - Ensure cmake is installed: `sudo apt install cmake build-essential`
   - Run transcription again: `bun transcribe.ts`

## First-time setup notes

- whisper.cpp compilation may take 5-10 minutes on first transcription
- The container includes all necessary build tools for audio processing
- VS Code extensions for TypeScript and formatting are pre-installed