# Dynamic Caption System - Implementation Guide

## Overview

The AmpliKIT Insights theme now features a dynamic caption system that automatically adjusts font size based on:
- **Container height and width** - Available space for text display
- **Content length** - Average length of caption text
- **Optimal readability** - Ensures text is always legible

## Key Features

### 🔄 **Automatic Sizing**
- Font size scales from 20px to 100px based on available space
- Line height adjusts proportionally (1.2x to 1.3x font size)
- Font weight increases for larger text (500-700)

### 📏 **Space Optimization**
- Caption container uses 100% of available height
- Remaining space calculated after header, content, visualizer, and footer
- Dynamic line count based on container height

### 📝 **Content-Aware Scaling**
- Analyzes average caption length across all captions
- Scales down font size for longer content to ensure fit
- Maintains readability while maximizing space usage

## Technical Implementation

### Container Height Calculation
```javascript
const headerHeight = 60;          // Header section
const contentCardHeight = 200;    // Cover art and title
const visualizerHeight = 120;     // Audio spectrum
const footerHeight = 50;          // Bottom message
const totalSpacing = spacing * 3; // Margins between sections
const containerPadding = spacing * 2; // Top/bottom padding

const availableHeight = totalHeight - headerHeight - contentCardHeight - 
                        visualizerHeight - footerHeight - totalSpacing - containerPadding;
```

### Font Size Algorithm
```javascript
// Content length factor (0.6 - 1.0)
const averageLength = captions.reduce((acc, cap) => acc + cap.text.length, 0) / captions.length;
const contentFactor = Math.min(1, Math.max(0.6, 1 - (averageLength - 50) / 200));

// Base sizing ratios
const heightBasedSize = availableHeight * 0.15 * contentFactor; // 15% of height
const widthBasedSize = availableWidth * 0.045 * contentFactor;  // 4.5% of width

// Use smaller value with height preference
const fontSize = Math.min(heightBasedSize, widthBasedSize * 1.2);

// Apply constraints
const minSize = Math.max(20, availableHeight * 0.08);  // Min 8% of height
const maxSize = Math.min(100, availableHeight * 0.25); // Max 25% of height
```

### Responsive Font Weight
```javascript
const fontWeight = fontSize > 50 ? 700 :  // Bold for large text
                   fontSize > 35 ? 600 :  // Semi-bold for medium text
                   500;                   // Medium for small text
```

## Usage Examples

### Short Content
```json
// short-captions.json
[
  {"start": 0, "end": 3000, "text": "Short text."},
  {"start": 3000, "end": 6000, "text": "Brief caption."}
]
```
**Result**: Large font size (60-80px), bold weight, maximum readability

### Medium Content
```json
// medium-captions.json
[
  {"start": 0, "end": 4000, "text": "This is a medium-length caption with reasonable text."},
  {"start": 4000, "end": 8000, "text": "Another moderately sized caption for testing."}
]
```
**Result**: Medium font size (40-60px), semi-bold weight, balanced appearance

### Long Content
```json
// test-long-captions.json
[
  {"start": 0, "end": 5000, "text": "Very long caption that tests text wrapping..."},
  {"start": 5000, "end": 10000, "text": "Extended content with technical terms..."}
]
```
**Result**: Smaller font size (25-40px), medium weight, optimized for readability

## Configuration Options

### Sizing Ratios
Adjust these values in `DynamicCaptions.tsx` for different scaling behavior:

```javascript
const baseHeightRatio = 0.15;  // 15% of container height (default)
const baseWidthRatio = 0.045;  // 4.5% of container width (default)
```

### Size Constraints
```javascript
const minFontSize = Math.max(20, availableHeight * 0.08);  // Minimum size
const maxFontSize = Math.min(100, availableHeight * 0.25); // Maximum size
```

### Content Length Scaling
```javascript
const contentLengthFactor = Math.min(1, Math.max(0.6, 1 - (averageLength - 50) / 200));
// Scales from 1.0 (short) to 0.6 (very long)
```

## Testing Scenarios

### Test Files Provided
1. **`short-captions.json`** - 1-3 words per caption
2. **`medium-captions.json`** - 10-15 words per caption  
3. **`test-long-captions.json`** - 20+ words per caption

### Expected Behavior
| Content Length | Font Size Range | Font Weight | Lines Used |
|---------------|----------------|-------------|------------|
| Short (1-10 chars) | 60-80px | 700 (Bold) | 1-2 |
| Medium (11-50 chars) | 40-60px | 600 (Semi-bold) | 2-3 |
| Long (51+ chars) | 25-40px | 500-600 | 3-4 |

## Performance Considerations

### Memoization
- Font calculations are memoized based on:
  - Container dimensions
  - Caption content
  - Lines per page setting

### Efficient Rendering
- Single calculation per render cycle
- No real-time DOM measurements
- Predictable sizing algorithm

## Troubleshooting

### Text Too Small
- Increase `baseHeightRatio` or `baseWidthRatio`
- Reduce `contentLengthFactor` impact
- Check available container height calculation

### Text Too Large
- Decrease sizing ratios
- Lower `maxFontSize` constraint
- Verify container dimensions

### Text Overflow
- System prevents overflow with `overflow: hidden`
- Automatic word wrapping enabled
- Hyphenation for long words

### Poor Readability
- Minimum font size prevents text from being too small
- Font weight increases with size for better contrast
- Line height optimized for each size range

## Integration

### Using Dynamic Captions
```tsx
import { DynamicCaptions } from "./DynamicCaptions";

<DynamicCaptions
  captions={captions}
  startFrame={startFrame}
  endFrame={endFrame}
  linesPerPage={4}
  subtitlesTextColor="#FFFFFF"
  onlyDisplayCurrentSentence={true}
  textBoxWidth={800}
  containerHeight={300}
/>
```

### Container Requirements
- Parent container must have defined height
- `flex: 1` allows caption area to expand
- `overflow: hidden` prevents content escape

## Future Enhancements

### Potential Improvements
1. **Real-time text measurement** for precise fitting
2. **Multiple font size tiers** for different content types
3. **Animation transitions** between size changes
4. **Accessibility options** for vision impairment
5. **Custom scaling curves** for specific use cases

### Advanced Features
- **Keyword emphasis** with larger/bold text
- **Speaker identification** with different styling
- **Emotion indicators** through font variations
- **Multi-language support** with different scaling rules

---

**Status**: ✅ Fully Implemented and Tested
**Compatibility**: Works with all existing caption formats
**Performance**: Optimized for real-time rendering