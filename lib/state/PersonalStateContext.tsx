"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WatchlistRepository } from "@/lib/repositories/watchlist";
import { FavoritesRepository } from "@/lib/repositories/favorites";
import { WatchedRepository } from "@/lib/repositories/watched";
import { RatingsRepository } from "@/lib/repositories/ratings";
import { ActivityRepository } from "@/lib/repositories/activity";
import type { ActivityEntry, RatingEntry, SavedMedia, TVProgress } from "@/lib/repositories/types";
import type { MediaType } from "@/lib/domain/models";

interface PersonalState {
  ready: boolean;
  watchlist: SavedMedia[];
  isInWatchlist: (id: number, mediaType: MediaType) => boolean;
  toggleWatchlist: (media: Omit<SavedMedia, "addedAt">) => void;
  favorites: SavedMedia[];
  isFavorite: (id: number, mediaType: MediaType) => boolean;
  toggleFavorite: (media: Omit<SavedMedia, "addedAt">) => void;
  watchedMovies: number[];
  isMovieWatched: (id: number) => boolean;
  toggleMovieWatched: (id: number, watched: boolean) => void;
  tvProgress: TVProgress[];
  getShowProgress: (showId: number) => TVProgress;
  isEpisodeWatched: (showId: number, season: number, episode: number) => boolean;
  toggleEpisodeWatched: (
    showId: number,
    season: number,
    episode: number,
    watched: boolean,
    snapshot?: { title: string; posterPath: string | null },
  ) => void;
  getSeasonWatchedCount: (showId: number, season: number) => number;
  getTotalWatchedEpisodes: (showId: number) => number;
  enrichTVSnapshot: (showId: number, title: string, posterPath: string | null) => void;
  ratings: RatingEntry[];
  getRating: (id: number, mediaType: MediaType) => number;
  setRating: (media: Omit<RatingEntry, "updatedAt">) => void;
  removeRating: (id: number, mediaType: MediaType) => void;
  averageRating: number;
  activity: ActivityEntry[];
  recentActivity: ActivityEntry[];
  clearAll: () => void;
}

const Ctx = createContext<PersonalState | null>(null);

const watchlistRepo = new WatchlistRepository();
const favoritesRepo = new FavoritesRepository();
const watchedRepo = new WatchedRepository();
const ratingsRepo = new RatingsRepository();
const activityRepo = new ActivityRepository();

function makeActivityId(type: string, mediaId: number): string {
  return `${mediaId}:${type}:${Date.now()}`;
}

export function PersonalStateProvider({ children }: { readonly children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [watchlist, setWatchlist] = useState<SavedMedia[]>([]);
  const [favorites, setFavorites] = useState<SavedMedia[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
  const [tvProgress, setTvProgress] = useState<TVProgress[]>([]);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    setWatchlist(watchlistRepo.getAll());
    setFavorites(favoritesRepo.getAll());
    setWatchedMovies(watchedRepo.getWatchedMovies());
    setTvProgress(watchedRepo.getAllTVProgress());
    setRatings(ratingsRepo.getAll());
    setActivity(activityRepo.getAll());
    setReady(true);
  }, []);

  const isInWatchlist = useCallback(
    (id: number, mediaType: MediaType) => watchlist.some((w) => w.id === id && w.mediaType === mediaType),
    [watchlist],
  );

  const isFavorite = useCallback(
    (id: number, mediaType: MediaType) => favorites.some((f) => f.id === id && f.mediaType === mediaType),
    [favorites],
  );

  const isMovieWatched = useCallback((id: number) => watchedMovies.includes(id), [watchedMovies]);

  const getRating = useCallback(
    (id: number, mediaType: MediaType) => ratings.find((r) => r.id === id && r.mediaType === mediaType)?.rating ?? 0,
    [ratings],
  );

  const toggleWatchlist = useCallback(
    (media: Omit<SavedMedia, "addedAt">) => {
      const currentlyIn = watchlist.some((w) => w.id === media.id && w.mediaType === media.mediaType);
      const next = currentlyIn ? watchlistRepo.remove(media.id, media.mediaType) : watchlistRepo.add(media);
      setWatchlist(next);
      if (!currentlyIn) {
        activityRepo.add({
          id: makeActivityId("watchlist_add", media.id),
          type: "watchlist_add",
          mediaType: media.mediaType,
          mediaId: media.id,
          title: media.title,
          posterPath: media.posterPath,
          timestamp: Date.now(),
        });
        setActivity(activityRepo.getAll());
      }
    },
    [watchlist],
  );

  const toggleFavorite = useCallback(
    (media: Omit<SavedMedia, "addedAt">) => {
      const currentlyFav = favorites.some((f) => f.id === media.id && f.mediaType === media.mediaType);
      const next = currentlyFav ? favoritesRepo.remove(media.id, media.mediaType) : favoritesRepo.add(media);
      setFavorites(next);
      if (!currentlyFav) {
        activityRepo.add({
          id: makeActivityId("favorite_add", media.id),
          type: "favorite_add",
          mediaType: media.mediaType,
          mediaId: media.id,
          title: media.title,
          posterPath: media.posterPath,
          timestamp: Date.now(),
        });
        setActivity(activityRepo.getAll());
      }
    },
    [favorites],
  );

  const toggleMovieWatched = useCallback((id: number, watched: boolean) => {
    const next = watched ? watchedRepo.markMovieWatched(id) : watchedRepo.markMovieUnwatched(id);
    setWatchedMovies(next);
  }, []);

  const getShowProgress = useCallback((showId: number) => watchedRepo.getShowProgress(showId), []);

  const isEpisodeWatched = useCallback(
    (showId: number, season: number, episode: number) => watchedRepo.isEpisodeWatched(showId, season, episode),
    [],
  );

  const toggleEpisodeWatched = useCallback(
    (
      showId: number,
      season: number,
      episode: number,
      watched: boolean,
      snapshot?: { title: string; posterPath: string | null },
    ) => {
      watchedRepo.toggleEpisode(showId, season, episode, watched, snapshot);
      setTvProgress(watchedRepo.getAllTVProgress());
    },
    [],
  );

  const enrichTVSnapshot = useCallback((showId: number, title: string, posterPath: string | null) => {
    watchedRepo.enrichSnapshot(showId, title, posterPath);
    setTvProgress(watchedRepo.getAllTVProgress());
  }, []);

  const getSeasonWatchedCount = useCallback(
    (showId: number, season: number) => watchedRepo.getSeasonWatchedCount(showId, season),
    [],
  );

  const getTotalWatchedEpisodes = useCallback((showId: number) => watchedRepo.getTotalWatchedEpisodes(showId), []);

  const setRatingValue = useCallback((media: Omit<RatingEntry, "updatedAt">) => {
    const next = ratingsRepo.set(media);
    setRatings(next);
    activityRepo.add({
      id: makeActivityId("rating", media.id),
      type: "rating",
      mediaType: media.mediaType,
      mediaId: media.id,
      title: media.title,
      posterPath: media.posterPath,
      rating: media.rating,
      timestamp: Date.now(),
    });
    setActivity(activityRepo.getAll());
  }, []);

  const removeRating = useCallback((id: number, mediaType: MediaType) => {
    const next = ratingsRepo.remove(id, mediaType);
    setRatings(next);
  }, []);

  const averageRating = useMemo(() => ratingsRepo.average(), [ratings]);
  const recentActivity = useMemo(() => activity.slice(0, 10), [activity]);

  const clearAll = useCallback(() => {
    watchlistRepo.clear();
    favoritesRepo.clear();
    watchedRepo.clear();
    ratingsRepo.clear();
    activityRepo.clear();
    setWatchlist([]);
    setFavorites([]);
    setWatchedMovies([]);
    setTvProgress([]);
    setRatings([]);
    setActivity([]);
  }, []);

  const value: PersonalState = useMemo(
    () => ({
      ready,
      watchlist,
      isInWatchlist,
      toggleWatchlist,
      favorites,
      isFavorite,
      toggleFavorite,
      watchedMovies,
      isMovieWatched,
      toggleMovieWatched,
      tvProgress,
      getShowProgress,
      isEpisodeWatched,
      toggleEpisodeWatched,
      getSeasonWatchedCount,
      getTotalWatchedEpisodes,
      enrichTVSnapshot,
      ratings,
      getRating,
      setRating: setRatingValue,
      removeRating,
      averageRating,
      activity,
      recentActivity,
      clearAll,
    }),
    [
      ready,
      watchlist,
      isInWatchlist,
      toggleWatchlist,
      favorites,
      isFavorite,
      toggleFavorite,
      watchedMovies,
      isMovieWatched,
      toggleMovieWatched,
      tvProgress,
      getShowProgress,
      isEpisodeWatched,
      toggleEpisodeWatched,
      getSeasonWatchedCount,
      getTotalWatchedEpisodes,
      enrichTVSnapshot,
      ratings,
      getRating,
      setRatingValue,
      removeRating,
      averageRating,
      activity,
      recentActivity,
      clearAll,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePersonalState(): PersonalState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePersonalState must be used within PersonalStateProvider");
  return ctx;
}
