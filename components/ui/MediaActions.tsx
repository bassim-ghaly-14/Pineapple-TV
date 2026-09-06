"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Heart, Check, Star } from "lucide-react";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import type { MediaSummary } from "@/lib/domain/models";
import { cn } from "@/lib/utils";

export function WatchlistButton({
  media,
  size = "md",
}: {
  media: MediaSummary;
  size?: "sm" | "md";
}) {
  const { isInWatchlist, toggleWatchlist } = usePersonalState();
  const active = isInWatchlist(media.id, media.mediaType);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist({
          id: media.id,
          mediaType: media.mediaType,
          title: media.title,
          posterPath: media.posterPath,
        });
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "rounded-full border p-2 transition-colors",
        active
          ? "border-accent bg-accent/20 text-accent"
          : "border-white/10 bg-black/40 text-text hover:bg-black/60",
      )}
    >
      {active ? <BookmarkCheck className={iconSize} /> : <Bookmark className={iconSize} />}
    </button>
  );
}

export function FavoriteButton({
  media,
  size = "md",
}: {
  media: MediaSummary;
  size?: "sm" | "md";
}) {
  const { isFavorite, toggleFavorite } = usePersonalState();
  const active = isFavorite(media.id, media.mediaType);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite({
          id: media.id,
          mediaType: media.mediaType,
          title: media.title,
          posterPath: media.posterPath,
        });
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "rounded-full border p-2 transition-colors",
        active
          ? "border-pink-400 bg-pink-400/20 text-pink-400"
          : "border-white/10 bg-black/40 text-text hover:bg-black/60",
      )}
    >
      <Heart className={iconSize} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

export function WatchedButton({ media }: { media: MediaSummary }) {
  const { isMovieWatched, toggleMovieWatched } = usePersonalState();
  const watched = media.mediaType === "movie" && isMovieWatched(media.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (media.mediaType === "movie") toggleMovieWatched(media.id, !watched);
      }}
      aria-pressed={watched}
      aria-label={watched ? "Mark as unwatched" : "Mark as watched"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        watched
          ? "border-green-400 bg-green-400/20 text-green-400"
          : "border-white/10 bg-surface text-muted hover:text-text",
      )}
    >
      <Check className="h-3.5 w-3.5" />
      {watched ? "Watched" : "Mark watched"}
    </button>
  );
}

export function RatingStars({
  media,
  size = "md",
}: {
  media: MediaSummary;
  size?: "sm" | "md";
}) {
  const { getRating, setRating } = usePersonalState();
  const [hover, setHover] = useState(0);
  const current = getRating(media.id, media.mediaType);
  const display = hover || current;
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="group"
      aria-label="Rate this title"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setRating({
              id: media.id,
              mediaType: media.mediaType,
              title: media.title,
              posterPath: media.posterPath,
              rating: value,
            });
          }}
          onMouseEnter={() => setHover(value)}
          aria-label={`${value} star${value > 1 ? "s" : ""}`}
          className="p-0.5"
        >
          <Star
            className={cn(starSize, "transition-colors", value <= display ? "text-accent" : "text-white/20")}
            fill={value <= display ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
