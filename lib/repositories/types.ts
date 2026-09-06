import type { MediaType } from "@/lib/domain/models";

// Minimal snapshot stored in user-owned lists.
// We never persist full TMDB responses.
export interface SavedMedia {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: number; // epoch ms
}

// TV episode-level watched tracking.
// JSON-safe: plain objects/arrays only (no Sets).
export interface SeasonProgress {
  seasonNumber: number;
  watchedEpisodes: number[]; // episode numbers
}

export interface TVProgress {
  showId: number;
  // Minimal snapshot for display without refetching
  title?: string;
  posterPath?: string | null;
  seasons: SeasonProgress[];
  lastWatchedSeason: number | null;
  lastWatchedEpisode: number | null;
  updatedAt: number;
}

export interface RatingEntry {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  rating: number; // 1-5
  updatedAt: number;
}

export type ActivityType =
  | "watchlist_add"
  | "favorite_add"
  | "watched_movie"
  | "watched_episode"
  | "rating";

export interface ActivityEntry {
  id: string; // `${mediaType}:${id}:${type}:${timestamp}`
  type: ActivityType;
  mediaType: MediaType;
  mediaId: number;
  title: string;
  posterPath: string | null;
  // For episodes
  seasonNumber?: number;
  episodeNumber?: number;
  episodeName?: string;
  rating?: number;
  timestamp: number;
}
