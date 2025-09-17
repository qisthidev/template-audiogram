# Devcontainer Setup for Audiogram Template

This devcontainer configuration sets up a complete development environment for the Audiogram Template project using **Ubuntu Linux**.

## What's Included

### Base Environment
- **Ubuntu Linux** with glibc (compatible with most Node.js and JavaScript tools)
- **Bun** - Fast JavaScript runtime and package manager
- **FFmpeg** - Audio/video processing
- **Build tools** - cmake, make, gcc, g++ for compiling native dependencies

### Automatic Setup
The devcontainer automatically:
1. **Setup** (`setup.sh`): Installs all system dependencies and Bun
2. **Post-creation** (`post-create.sh`): Prepares whisper.cpp for transcription

### VS Code Extensions
- TypeScript language support
- Prettier code formatting
- JSON language support

## Usage

When you create a new Codespace or rebuild the devcontainer:

1. All dependencies are automatically installed
2. Project dependencies are installed via `bun install`
3. Whisper.cpp is prepared for audio transcription
4. The environment is ready for development

## Manual Commands

If you need to run setup manually:

```bash
# Install system dependencies
./.devcontainer/setup.sh

# Prepare whisper.cpp
./.devcontainer/post-create.sh

# Run transcription
bun transcribe.ts
```

## Architecture Notes

- Uses Ubuntu instead of Alpine for better compatibility with glibc-based tools
- Whisper.cpp builds properly with standard GNU toolchain
- FFmpeg is available system-wide for audio processing
- All JavaScript tools work seamlessly with Bun runtime

## Why Ubuntu Over Alpine?

While Alpine Linux is lightweight and secure, we switched to Ubuntu because:

- **glibc compatibility**: Most JavaScript/Node.js native modules expect glibc
- **Whisper.cpp compatibility**: The @remotion/install-whisper-cpp package builds binaries that work with glibc systems
- **Better toolchain**: Standard GNU build tools work more reliably
- **Package availability**: More packages available via apt vs apk

## Why Bun?

- **Speed**: Faster package installation and script execution than npm/yarn
- **TypeScript support**: Native TypeScript execution without compilation
- **Compatibility**: Works with existing npm packages
- **Single runtime**: No need for separate Node.js installation

```bash
# Install dependencies
bun install

# Transcribe audio
bun transcribe.ts

# Start development server
bun dev

# Render video
bun render
```
