/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

/**
 * Validates if a URL is a valid YouTube URL
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeId(url) !== null;
};

/**
 * Formats time in seconds to YouTube time parameter format (MM:SS or HH:MM:SS)
 */
export const formatTimeForYouTube = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Creates a YouTube embed URL with proper parameters
 */
export const createYouTubeEmbedUrl = (
  videoId: string,
  options: {
    startTime?: number;
    endTime?: number;
    muted?: boolean;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
  } = {}
): string => {
  const params = new URLSearchParams({
    autoplay: (options.autoplay ?? true) ? "1" : "0",
    controls: (options.controls ?? false) ? "1" : "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    showinfo: "0",
  });

  if (options.startTime !== undefined) {
    params.append("start", Math.floor(options.startTime).toString());
  }

  if (options.endTime !== undefined) {
    params.append("end", Math.floor(options.endTime).toString());
  }

  if (options.muted) {
    params.append("mute", "1");
  }

  if (options.loop) {
    params.append("loop", "1");
    params.append("playlist", videoId);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Gets YouTube thumbnail URL for a video ID
 */
export const getYouTubeThumbnail = (
  videoId: string,
  quality: "default" | "medium" | "high" | "maxres" = "high"
): string => {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};