// Trailer selection: shared by the trailer API route and detail pages.
// A missing trailer is a legitimate data state — we never fabricate keys.

import type { Video } from "@/lib/domain/models";

const TYPE_PRIORITY: Record<string, number> = {
  Trailer: 0,
  Teaser: 1,
  Clip: 2,
  Featurette: 3,
};

function publishedTime(video: Video): number {
  if (!video.publishedAt) return 0;
  const t = Date.parse(video.publishedAt);
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Pick the best playable YouTube trailer from TMDB videos.
 * Priority: YouTube site → official Trailer → any Trailer → Teaser,
 * then official flag and newest publish date as tiebreakers.
 */
export function pickTrailer(videos: Video[]): Video | null {
  const youtube = videos.filter((v) => v.site === "YouTube" && !!v.key);
  if (youtube.length === 0) return null;

  const trailers = youtube.filter((v) => v.type === "Trailer");
  const teasers = youtube.filter((v) => v.type === "Teaser");
  const candidates = trailers.length > 0 ? trailers : teasers;
  if (candidates.length === 0) return null;

  return [...candidates].sort((a, b) => {
    if (a.official !== b.official) return a.official ? -1 : 1;
    const typeDiff =
      (TYPE_PRIORITY[a.type] ?? 99) - (TYPE_PRIORITY[b.type] ?? 99);
    if (typeDiff !== 0) return typeDiff;
    return publishedTime(b) - publishedTime(a);
  })[0];
}

export function buildTrailerEmbedUrl(key: string, origin?: string): string {
  // playsinline is required for iOS Safari inline playback.
  // No forced autoplay: playback starts on the user's own interaction.
  // origin is YouTube's recommended security measure for embeds; it is
  // derived from the running application origin, never hardcoded.
  const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(key)}?playsinline=1&rel=0${originParam}`;
}

export function buildTrailerWatchUrl(key: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(key)}`;
}