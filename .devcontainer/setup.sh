#!/bin/bash

set -e

echo "🚀 Setting up Audiogram Template environment..."

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install ffmpeg
echo "🎵 Installing ffmpeg..."
sudo apt install -y ffmpeg git-lfs

# Install bun
echo "🥖 Installing bun..."
curl -fsSL https://bun.com/install | bash

# Add bun to PATH for the current session
export PATH="$HOME/.bun/bin:$PATH"

# Make sure bun is available in future sessions
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc

# Install project dependencies
echo "📚 Installing project dependencies..."
# Source the updated bashrc to get bun in PATH
source ~/.bashrc || true
# Use full path to bun just to be safe
$HOME/.bun/bin/bun install

echo "✅ Setup complete! Environment ready for audiogram generation."
