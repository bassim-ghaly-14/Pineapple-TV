import { describe, it, expect, beforeEach } from "vitest";
import { WatchlistRepository } from "@/lib/repositories/watchlist";
import { FavoritesRepository } from "@/lib/repositories/favorites";
import { RatingsRepository } from "@/lib/repositories/ratings";
import { WatchedRepository } from "@/lib/repositories/watched";
import { ActivityRepository } from "@/lib/repositories/activity";
import { storage } from "@/lib/storage";

beforeEach(() => {
  storage.remove("watchlist");
  storage.remove("favorites");
  storage.remove("ratings");
  storage.remove("watched-movies");
  storage.remove("watched-tv");
  storage.remove("activity");
});

describe("WatchlistRepository", () => {
  it("adds, checks, and removes items", () => {
    const repo = new WatchlistRepository();
    expect(repo.getAll()).toHaveLength(0);
    expect(repo.has(1, "movie")).toBe(false);

    repo.add({ id: 1, mediaType: "movie", title: "Test", posterPath: null });
    expect(repo.getAll()).toHaveLength(1);
    expect(repo.has(1, "movie")).toBe(true);
    expect(repo.count()).toBe(1);

    // Duplicate add should not increase count
    repo.add({ id: 1, mediaType: "movie", title: "Test", posterPath: null });
    expect(repo.getAll()).toHaveLength(1);

    repo.remove(1, "movie");
    expect(repo.getAll()).toHaveLength(0);
  });
});

describe("FavoritesRepository", () => {
  it("adds and removes favorites", () => {
    const repo = new FavoritesRepository();
    repo.add({ id: 2, mediaType: "tv", title: "Show", posterPath: null });
    expect(repo.has(2, "tv")).toBe(true);
    expect(repo.count()).toBe(1);
    repo.remove(2, "tv");
    expect(repo.count()).toBe(0);
  });
});

describe("RatingsRepository", () => {
  it("sets, updates, and removes ratings", () => {
    const repo = new RatingsRepository();
    repo.set({ id: 1, mediaType: "movie", title: "Test", posterPath: null, rating: 4 });
    expect(repo.getRating(1, "movie")).toBe(4);

    // Update
    repo.set({ id: 1, mediaType: "movie", title: "Test", posterPath: null, rating: 5 });
    expect(repo.getRating(1, "movie")).toBe(5);
    expect(repo.getAll()).toHaveLength(1);

    repo.remove(1, "movie");
    expect(repo.getRating(1, "movie")).toBe(0);
  });

  it("calculates average", () => {
    const repo = new RatingsRepository();
    repo.set({ id: 1, mediaType: "movie", title: "A", posterPath: null, rating: 4 });
    repo.set({ id: 2, mediaType: "movie", title: "B", posterPath: null, rating: 2 });
    expect(repo.average()).toBe(3);
  });
});

describe("WatchedRepository", () => {
  it("tracks movie watched state", () => {
    const repo = new WatchedRepository();
    expect(repo.isMovieWatched(1)).toBe(false);
    repo.markMovieWatched(1);
    expect(repo.isMovieWatched(1)).toBe(true);
    repo.markMovieUnwatched(1);
    expect(repo.isMovieWatched(1)).toBe(false);
  });

  it("marks and unmarks movie watched state", () => {
    const repo = new WatchedRepository();
    repo.markMovieWatched(1);
    expect(repo.isMovieWatched(1)).toBe(true);
    repo.markMovieUnwatched(1);
    expect(repo.isMovieWatched(1)).toBe(false);
  });

  it("tracks episode-level TV progress", () => {
    const repo = new WatchedRepository();
    expect(repo.isEpisodeWatched(100, 1, 1)).toBe(false);

    repo.toggleEpisode(100, 1, 1, true);
    repo.toggleEpisode(100, 1, 2, true);
    expect(repo.isEpisodeWatched(100, 1, 1)).toBe(true);
    expect(repo.isEpisodeWatched(100, 1, 2)).toBe(true);
    expect(repo.isEpisodeWatched(100, 1, 3)).toBe(false);
    expect(repo.getSeasonWatchedCount(100, 1)).toBe(2);
    expect(repo.getTotalWatchedEpisodes(100)).toBe(2);

    // Unwatch
    repo.toggleEpisode(100, 1, 1, false);
    expect(repo.getSeasonWatchedCount(100, 1)).toBe(1);
  });

  it("tracks progress across seasons", () => {
    const repo = new WatchedRepository();
    repo.toggleEpisode(100, 1, 1, true);
    repo.toggleEpisode(100, 2, 1, true);
    expect(repo.getTotalWatchedEpisodes(100)).toBe(2);
    const progress = repo.getShowProgress(100);
    expect(progress.seasons).toHaveLength(2);
  });

  it("derives last watched episode", () => {
    const repo = new WatchedRepository();
    repo.toggleEpisode(100, 2, 5, true);
    const progress = repo.getShowProgress(100);
    expect(progress.lastWatchedSeason).toBe(2);
    expect(progress.lastWatchedEpisode).toBe(5);
  });

  it("stores and retrieves title snapshot with progress", () => {
    const repo = new WatchedRepository();
    repo.toggleEpisode(100, 1, 1, true, { title: "Breaking Bad", posterPath: "/bb.jpg" });
    const progress = repo.getShowProgress(100);
    expect(progress.title).toBe("Breaking Bad");
    expect(progress.posterPath).toBe("/bb.jpg");
  });

  it("enriches existing progress with snapshot", () => {
    const repo = new WatchedRepository();
    repo.toggleEpisode(100, 1, 1, true);
    expect(repo.getShowProgress(100).title).toBeUndefined();
    repo.enrichSnapshot(100, "Breaking Bad", "/bb.jpg");
    expect(repo.getShowProgress(100).title).toBe("Breaking Bad");
  });

  it("handles backward compat: old data without title still works", () => {
    storage.set("watched-tv", [{ showId: 100, seasons: [], lastWatchedSeason: null, lastWatchedEpisode: null, updatedAt: 0 }]);
    const repo = new WatchedRepository();
    const all = repo.getAllTVProgress();
    expect(all).toHaveLength(1);
    expect(all[0].showId).toBe(100);
    expect(all[0].title).toBeUndefined();
  });
});

describe("ActivityRepository", () => {
  it("adds and retrieves recent activity", () => {
    const repo = new ActivityRepository();
    repo.add({
      id: "1",
      type: "watchlist_add",
      mediaType: "movie",
      mediaId: 1,
      title: "Test",
      posterPath: null,
      timestamp: Date.now(),
    });
    expect(repo.getAll()).toHaveLength(1);
    expect(repo.recent(5)).toHaveLength(1);
  });

  it("caps at max items", () => {
    const repo = new ActivityRepository();
    for (let i = 0; i < 60; i++) {
      repo.add({
        id: String(i),
        type: "watchlist_add",
        mediaType: "movie",
        mediaId: i,
        title: `Item ${i}`,
        posterPath: null,
        timestamp: Date.now() + i,
      });
    }
    expect(repo.getAll().length).toBeLessThanOrEqual(50);
  });
});
