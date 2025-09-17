# Devcontainer Setup

This devcontainer is configured for Alpine Linux to provide a lightweight and efficient development environment for the Audiogram Template project.

## What gets installed automatically:

### System Dependencies (Alpine packages)
- `ffmpeg` - Audio/video processing
- `git-lfs` - Git Large File Storage
- `cmake` - Build system for whisper.cpp
- `make`, `gcc`, `g++` - Build tools for compilation
- `musl-dev`, `linux-headers` - Development headers
- `nss` - Network Security Services
- `chromium` - Headless browser for Remotion
- `bash` - Bash shell
- `curl` - HTTP client

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **Project dependencies** - All npm packages via `bun install`

## Post-creation process:

1. **Automatic whisper.cpp setup** - The container will attempt to set up and compile whisper.cpp for audio transcription
2. **Transcription** - If `public/audio.wav` exists, it will be automatically transcribed
3. **Error handling** - If compilation fails, you can manually run `bun transcribe.ts` later

## Manual commands:

```sh
# Install dependencies
bun install

# Transcribe audio
bun transcribe.ts

# Start development server
bun dev

# Build the project
bun run build
```

## Alpine-specific notes:

- Uses `apk` package manager instead of `apt`
- Lightweight musl libc instead of glibc
- Optimized for smaller container size and faster startup