import { storage } from "@/lib/storage";
import type { TVProgress } from "./types";

const TV_KEY = "watched-tv";
const MOVIES_KEY = "watched-movies";

// ---- Movies: simple set of watched IDs ----

export class WatchedRepository {
  // -- Movies --
  getWatchedMovies(): number[] {
    const ids = storage.get<number[]>(MOVIES_KEY);
    return Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : [];
  }

  isMovieWatched(id: number): boolean {
    return this.getWatchedMovies().includes(id);
  }

  markMovieWatched(id: number): number[] {
    const ids = this.getWatchedMovies();
    if (ids.includes(id)) return ids;
    const next = [...ids, id];
    storage.set(MOVIES_KEY, next);
    return next;
  }

  markMovieUnwatched(id: number): number[] {
    const next = this.getWatchedMovies().filter((existing) => existing !== id);
    storage.set(MOVIES_KEY, next);
    return next;
  }

  // -- TV: episode-level --
  getAllTVProgress(): TVProgress[] {
    const items = storage.get<TVProgress[]>(TV_KEY);
    if (!Array.isArray(items)) return [];
    return items
      .filter((p) => Number.isInteger(p.showId))
      .map((p) => ({
        ...p,
        // Backward compat: ensure snapshot fields exist
        title: p.title ?? undefined,
        posterPath: p.posterPath ?? undefined,
      }));
  }

  private getTVProgress(showId: number): TVProgress | null {
    return this.getAllTVProgress().find((p) => p.showId === showId) ?? null;
  }

  getShowProgress(showId: number): TVProgress {
    return (
      this.getTVProgress(showId) ?? {
        showId,
        seasons: [],
        lastWatchedSeason: null,
        lastWatchedEpisode: null,
        updatedAt: Date.now(),
      }
    );
  }

  isEpisodeWatched(showId: number, seasonNumber: number, episodeNumber: number): boolean {
    const progress = this.getTVProgress(showId);
    if (!progress) return false;
    const season = progress.seasons.find((s) => s.seasonNumber === seasonNumber);
    return season?.watchedEpisodes.includes(episodeNumber) ?? false;
  }

  // Enrich existing progress with a snapshot (e.g., when title becomes available)
  enrichSnapshot(showId: number, title: string, posterPath: string | null): TVProgress[] {
    const all = this.getAllTVProgress();
    const progress = all.find((p) => p.showId === showId);
    if (progress && !progress.title) {
      progress.title = title;
      if (posterPath) progress.posterPath = posterPath;
      storage.set(TV_KEY, all);
    }
    return all;
  }

  toggleEpisode(
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
    watched: boolean,
    snapshot?: { title: string; posterPath: string | null },
  ): TVProgress {
    const all = this.getAllTVProgress();
    let progress = all.find((p) => p.showId === showId);
    if (!progress) {
      progress = {
        showId,
        title: snapshot?.title,
        posterPath: snapshot?.posterPath,
        seasons: [],
        lastWatchedSeason: null,
        lastWatchedEpisode: null,
        updatedAt: Date.now(),
      };
      all.unshift(progress);
    } else if (snapshot?.title && !progress.title) {
      progress.title = snapshot.title;
      progress.posterPath = snapshot.posterPath;
    }
    let season = progress.seasons.find((s) => s.seasonNumber === seasonNumber);
    if (!season) {
      season = { seasonNumber, watchedEpisodes: [] };
      progress.seasons.push(season);
    }

    const idx = season.watchedEpisodes.indexOf(episodeNumber);
    if (watched && idx === -1) {
      season.watchedEpisodes.push(episodeNumber);
    } else if (!watched && idx !== -1) {
      season.watchedEpisodes.splice(idx, 1);
    }

    progress.lastWatchedSeason = seasonNumber;
    progress.lastWatchedEpisode = episodeNumber;
    progress.updatedAt = Date.now();

    storage.set(TV_KEY, all);
    return progress;
  }

  // Derive watched episode count for a season
  getSeasonWatchedCount(showId: number, seasonNumber: number): number {
    const progress = this.getTVProgress(showId);
    if (!progress) return 0;
    return progress.seasons.find((s) => s.seasonNumber === seasonNumber)?.watchedEpisodes.length ?? 0;
  }

  // Derive total watched episodes across all seasons
  getTotalWatchedEpisodes(showId: number): number {
    const progress = this.getTVProgress(showId);
    if (!progress) return 0;
    return progress.seasons.reduce((acc, s) => acc + s.watchedEpisodes.length, 0);
  }

  clear(): void {
    storage.remove(TV_KEY);
    storage.remove(MOVIES_KEY);
  }
}
