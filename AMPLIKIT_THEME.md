# AmpliKIT Insights - Podcast Repurposing Theme

This is a custom theme for creating branded audiograms that transform low-engagement podcast content into viral clips for the AmpliKIT Insights YouTube channel.

## Theme Features

### 🎨 Brand Colors
- **Primary Orange**: `#FF6B35` - Used for main brand elements and highlights
- **Primary Blue**: `#4A90E2` - Used for accents and secondary elements  
- **Background**: Dark gradient from `#0A0B0E` to `#1A1D23`
- **Text**: High contrast whites and grays for excellent readability

### 🎵 Audio Visualizations
- **Spectrum Analyzer**: Default visualizer with mirror wave effect
- **Gradient Waveforms**: Orange to blue gradient matching brand colors
- **Professional Styling**: Clean, modern look suitable for professional content

### 🎬 Layout Design
- **Header Branding**: AmpliKIT Insights logo with live indicator
- **Content Cards**: Rounded corners with subtle borders and shadows
- **Source Credit**: Highlighted attribution to original podcast
- **Repurposing Message**: Clear indication of content transformation
- **Cover Art**: Branded placeholder with professional audio waveform design
- **Dynamic Caption Area**: Auto-sizing text that uses 100% of available height
- **Smart Font Scaling**: Text size adapts to content length and container dimensions
- **Footer**: Motivational message about transforming content

### 📝 Typography
- **Font**: Inter - Modern, professional, and highly readable
- **Weights**: 400, 500, 600, 700, 800 available
- **Optimized**: For both titles and captions

## Usage

### Default Configuration
The theme comes pre-configured with:
- Spectrum visualizer (128 samples)
- Mirror wave effect enabled
- AmpliKIT Insights branding
- Source credit attribution system
- Repurposing-focused messaging
- Professional color scheme
- Custom branded cover art

### Customization
To customize for specific episodes:

1. **Replace Cover Art**: Update `coverImageUrl` in the composition props
2. **Change Title**: Update `titleText` prop
3. **Add Source Credit**: Set `sourceCredit` to the original podcast name
4. **Audio File**: Replace `audioFileUrl` with your podcast clip
5. **Captions**: Update `captionsFileName` with your transcript

### File Structure
```
src/Audiogram/
├── theme.ts          # AmpliKIT brand theme configuration
├── Main.tsx          # Main audiogram component with AmpliKIT layout
├── font.ts           # Inter font configuration
└── ...

public/
├── amplikit-cover.svg # Branded cover art
├── audio.wav          # Your audio clip
└── captions.json      # Your transcript/captions
```

## Brand Guidelines

### Colors Usage
- Use **Orange (#FF6B35)** for:
  - Brand name
  - Primary buttons/highlights
  - Wave gradients (start)
  - Live indicators

- Use **Blue (#4A90E2)** for:
  - Secondary text elements
  - Wave gradients (end)
  - Accent borders
  - Supporting graphics

### Typography Hierarchy
1. **Brand Name**: 32px, Weight 700, Orange
2. **Episode Title**: 42px, Weight 800, White
3. **Subtitle**: 18px, Weight 500, Gray
4. **Captions**: 72px, Weight 600, White
5. **Labels**: 16px, Weight 500, Gray

## Development

### Running the Project
```bash
npm run dev          # Start Remotion Studio
npm run build        # Build the project
npm run lint         # Run linting
```

### Customizing the Theme
Edit `src/Audiogram/theme.ts` to modify:
- Colors
- Spacing
- Border radius
- Typography settings

### Adding New Visualizers
The theme supports both spectrum and oscilloscope visualizers. Configure in `src/Root.tsx` defaultProps.

## Best Practices

1. **Audio Quality**: Use high-quality audio files (48kHz, 24-bit recommended)
2. **Caption Timing**: Ensure captions are properly timed with audio
3. **Source Attribution**: Always credit the original podcast properly
4. **Content Selection**: Choose the most engaging moments from low-performing content
5. **Cover Art**: Use high-resolution images (minimum 400x400px)
6. **File Naming**: Use descriptive names for easy organization
7. **Brand Consistency**: Stick to the established color palette and typography
8. **Ethical Repurposing**: Ensure you have permission to repurpose content

## Support

For customization help or technical issues, refer to the [Remotion documentation](https://www.remotion.dev/) or check the project's issue tracker.