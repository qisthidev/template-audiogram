# AmpliKIT Insights - Usage Example

## Repurposing Low-Engagement Podcast Content

This example shows how to use the AmpliKIT Insights theme to transform underperforming podcast segments into engaging social media clips.

### Scenario
You have a podcast episode that received low engagement, but contains a valuable 2-minute segment about productivity tips. You want to repurpose this segment into a viral audiogram.

### Step-by-Step Process

#### 1. Prepare Your Content
```bash
# Extract the audio segment (2 minutes starting at 15:30)
ffmpeg -i original-episode.mp3 -ss 15:30 -t 120 -acodec copy public/audio.wav
```

#### 2. Create Captions
Generate captions for your audio clip and save as `public/captions.json`:
```json
[
  {
    "start": 0,
    "end": 3000,
    "text": "The number one productivity hack that changed my life"
  },
  {
    "start": 3000,
    "end": 7000,
    "text": "is something most people completely overlook."
  }
]
```

#### 3. Configure the Audiogram
In Remotion Studio, set these properties:

```javascript
{
  // Episode-specific content
  titleText: "The Productivity Hack That Changed Everything",
  sourceCredit: "The Daily Productivity Podcast",
  
  // Audio and captions
  audioFileUrl: staticFile("audio.wav"),
  captionsFileName: staticFile("captions.json"),
  
  // Optional: Custom cover art
  coverImageUrl: staticFile("productivity-episode-cover.jpg"),
  
  // Visualizer settings (already optimized)
  visualizer: {
    type: "spectrum",
    color: "#FF6B35",
    numberOfSamples: "128",
    mirrorWave: true,
    freqRangeStartIndex: 5,
    linesToDisplay: 65
  }
}
```

### What You Get

The resulting audiogram will include:

#### Visual Elements
- **Header**: "AmpliKIT Insights" branding with live indicator
- **Content Card**: Episode cover art + title + source credit
- **Source Attribution**: Highlighted badge showing "Source: The Daily Productivity Podcast"
- **Tagline**: "Repurposed Content • Boosting Engagement"
- **Audio Visualizer**: Professional spectrum analyzer with brand colors
- **Captions**: Centered, easy-to-read text
- **Footer**: "💡 Transforming low-engagement content into viral clips"

#### Brand Messaging
- Clear indication this is repurposed content
- Proper attribution to original source
- Professional presentation that builds trust
- Focus on content transformation value

### Best Practices for Content Selection

#### Choose Segments That:
✅ **Have Clear Value**: Tips, insights, or memorable quotes  
✅ **Are Self-Contained**: Don't require previous context  
✅ **Have Emotional Impact**: Surprising, inspiring, or controversial  
✅ **Are Quotable**: Can stand alone as social media content  

#### Avoid Segments That:
❌ **Require Context**: References to earlier discussion  
❌ **Are Too Technical**: Complex explanations without payoff  
❌ **Have Poor Audio**: Background noise, interruptions  
❌ **Are Too Long**: Over 3-4 minutes for social media  

### Ethical Guidelines

#### Always:
- ✅ Credit the original podcast prominently
- ✅ Get permission when possible
- ✅ Link back to the original episode
- ✅ Respect copyright and fair use guidelines

#### Never:
- ❌ Misrepresent the original content
- ❌ Remove context that changes meaning
- ❌ Claim original content as your own
- ❌ Use content without proper attribution

### Distribution Strategy

#### Platform Optimization:
- **Instagram**: 1080x1080 square format (default)
- **TikTok**: Consider 9:16 vertical crop
- **YouTube Shorts**: 9:16 vertical format
- **Twitter**: 1080x1080 or 16:9 landscape
- **LinkedIn**: Professional tone works well

#### Engagement Tactics:
- **Hook in First 3 Seconds**: Start with the most compelling part
- **Clear Value Proposition**: What will viewers learn?
- **Call to Action**: Direct to full episode
- **Hashtag Strategy**: Mix trending and niche tags
- **Cross-Promotion**: Tag original podcast

### Measuring Success

#### Key Metrics:
- **Engagement Rate**: Likes, comments, shares vs. views
- **Click-Through Rate**: Traffic to original episode
- **Completion Rate**: How many watch to the end
- **Share Rate**: Organic distribution indicator
- **Comment Sentiment**: Quality of engagement

#### Success Indicators:
- Higher engagement than original episode
- Increased traffic to podcast
- New follower acquisition
- Positive audience feedback
- Content requests for more clips

---

This approach transforms underperforming podcast content into engaging social media assets while maintaining ethical standards and proper attribution.