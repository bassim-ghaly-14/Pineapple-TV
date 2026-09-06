// Centralized TMDB image abstraction. Never construct image URLs elsewhere.

const BASE = "https://image.tmdb.org/t/p";

export type ImageSizeOption =
  | "w92" | "w154" | "w185" | "w300" | "w342" | "w500" | "w780" | "original";

export type BackdropSize = "w300" | "w780" | "w1280" | "original";
export type ProfileSize = "w45" | "w185" | "h632" | "original";
export type StillSize = "w92" | "w185" | "w300" | "original";

export const IMAGE_SIZES = {
  poster: {
    card: "w342" as const,
    medium: "w500" as const,
    large: "w780" as const,
  },
  backdrop: {
    medium: "w780" as const,
    large: "w1280" as const,
    hero: "original" as const,
  },
  profile: {
    small: "w185" as const,
    medium: "w300" as const,
  },
  still: {
    card: "w300" as const,
  },
} as const;

export function buildImageUrl(
  path: string | null,
  size: ImageSizeOption | BackdropSize | ProfileSize | StillSize,
): string | null {
  if (!path) return null;
  return `${BASE}/${size}${path}`;
}

export function buildPosterUrl(path: string | null, size: keyof typeof IMAGE_SIZES.poster = "card") {
  return buildImageUrl(path, IMAGE_SIZES.poster[size]);
}

export function buildBackdropUrl(path: string | null, size: keyof typeof IMAGE_SIZES.backdrop = "large") {
  return buildImageUrl(path, IMAGE_SIZES.backdrop[size]);
}

export function buildProfileUrl(path: string | null, size: keyof typeof IMAGE_SIZES.profile = "small") {
  return buildImageUrl(path, IMAGE_SIZES.profile[size]);
}

export function buildStillUrl(path: string | null) {
  return buildImageUrl(path, IMAGE_SIZES.still.card);
}
