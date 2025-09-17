#!/bin/bash

set -e

echo "🚀 Setting up Audiogram Template environment..."

# Update package index
echo "📦 Updating package index..."
sudo apt update

# Install ffmpeg, build tools, and Chrome dependencies
echo "🎵 Installing dependencies..."
sudo apt install -y \
    ffmpeg \
    git-lfs \
    cmake \
    build-essential \
    libnss3 \
    libatk-bridge2.0-0t64 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2t64

# Install bun
echo "🥖 Installing bun..."
curl -fsSL https://bun.com/install | bash

# Add bun to PATH for the current session
export PATH="$HOME/.bun/bin:$PATH"

# Make sure bun is available in future sessions
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.profile

# Verify bun installation
if [ -f "$HOME/.bun/bin/bun" ]; then
    echo "✅ Bun installed successfully"
    $HOME/.bun/bin/bun --version
else
    echo "❌ Bun installation failed"
    exit 1
fi

# Install project dependencies
echo "📚 Installing project dependencies..."
$HOME/.bun/bin/bun install

echo "✅ Setup complete! Environment ready for audiogram generation."
