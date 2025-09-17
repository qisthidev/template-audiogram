# Devcontainer Configuration for Alpine Linux

This devcontainer is configured to provide a complete environment for the Audiogram Template project on Alpine Linux with Bun as the JavaScript runtime.

## What's Included

### Base System
- **Alpine Linux**: Lightweight, security-focused Linux distribution
- **Bun**: Fast JavaScript runtime and package manager (no Node.js needed)

### Dependencies
- **FFmpeg**: For audio/video processing
- **Git LFS**: For handling large media files
- **Build Tools**: cmake, make, gcc, g++ for compiling whisper.cpp
- **Chromium**: For headless browser operations (used by Remotion)

### Development Tools
- **VS Code Extensions**:
  - TypeScript support
  - Prettier code formatting
  - JSON language support

## Setup Process

1. **setup.sh**: Installs system dependencies and Bun
2. **post-create.sh**: Installs project dependencies and runs initial transcription

## Why Alpine Linux?

- **Lightweight**: Smaller image size and faster container startup
- **Security**: Minimal attack surface with musl libc
- **Performance**: Efficient resource usage in Codespaces

## Why Bun Instead of Node.js?

- **Speed**: Faster package installation and script execution
- **Simplicity**: Single runtime for JavaScript/TypeScript
- **Compatibility**: Works seamlessly with existing npm packages
- **Alpine Support**: Native Alpine Linux support (unlike some Node.js devcontainer features)

## Troubleshooting

If you encounter issues:

1. **Bun not found**: Run `export PATH="$HOME/.bun/bin:$PATH"`
2. **whisper.cpp compilation fails**: Ensure build tools are installed with `apk add cmake make gcc g++`
3. **Permission issues**: Check that scripts are executable with `chmod +x .devcontainer/*.sh`

## Manual Commands

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
