# Codespaces Setup

This repository is configured with GitHub Codespaces for automatic environment setup.

## What happens automatically

When you create a new Codespace, the following will be set up automatically:

1. **Machine Specifications**: 4-core CPU, 16GB RAM, 32GB storage
2. **Dependencies Installation**:
   - ffmpeg (for audio processing)
   - bun (JavaScript runtime)
   - Project dependencies via `bun install`
3. **Transcription**: If `public/audio.wav` exists, it will be transcribed automatically

## Manual steps after Codespace creation

1. **Place your audio file**: Copy your audio file to `public/audio.wav`
2. **Run transcription** (if not done automatically): `bun transcribe.ts`
3. **Generate audiogram**: Use Remotion tools to create your video

## Configuration files

- `.devcontainer/devcontainer.json`: Main devcontainer configuration
- `.devcontainer/setup.sh`: Dependency installation script
- `.devcontainer/post-create.sh`: Post-creation automation script

## Troubleshooting

If the automatic setup fails:
1. Run `.devcontainer/setup.sh` manually
2. Ensure bun is in PATH: `export PATH="$HOME/.bun/bin:$PATH"`
3. Install dependencies: `bun install`
4. Run transcription: `bun transcribe.ts`