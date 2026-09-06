"use client";

import Link from "next/link";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import { EmptyState } from "@/components/ui/States";
import { Film, Tv, Bookmark, Heart, Star, CheckCircle, Clock } from "lucide-react";
import { buildPosterUrl } from "@/lib/tmdb/image-config";
import Image from "next/image";
import type { ActivityEntry, TVProgress } from "@/lib/repositories/types";

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string | number;
  readonly accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-surface p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${accent ? "bg-accent/20 text-accent" : "bg-surface-elevated text-muted"}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ entry }: { readonly entry: ActivityEntry }) {
  const poster = buildPosterUrl(entry.posterPath, "card");
  const href = `/${entry.mediaType === "tv" ? "tv" : "movies"}/${entry.mediaId}`;

  const label: Record<string, string> = {
    watchlist_add: "Added to watchlist",
    favorite_add: "Added to favorites",
    watched_movie: "Marked as watched",
    watched_episode: "Watched episode",
    rating: entry.rating ? `Rated ${entry.rating}/5` : "Rated",
  };

  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-hover">
      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-surface-elevated">
        {poster && <Image src={poster} alt="" fill sizes="36px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{entry.title}</p>
        <p className="text-xs text-muted">
          {label[entry.type] ?? entry.type}
          {entry.seasonNumber ? ` · S${entry.seasonNumber}E${entry.episodeNumber}` : ""}
        </p>
      </div>
    </Link>
  );
}

function ContinueWatchingCard({ progress }: { readonly progress: TVProgress }) {
  const lastSeason = progress.lastWatchedSeason;
  const lastEpisode = progress.lastWatchedEpisode;
  const poster = buildPosterUrl(progress.posterPath ?? null, "card");
  const href = lastSeason ? `/tv/${progress.showId}/season/${lastSeason}` : `/tv/${progress.showId}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-white/5 bg-surface p-3 hover:bg-surface-hover"
    >
      <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded bg-surface-elevated">
        {poster && <Image src={poster} alt="" fill sizes="44px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">
          {progress.title ?? `Show #${progress.showId}`}
        </p>
        <p className="text-xs text-muted">
          {lastSeason ? `Season ${lastSeason} · Episode ${lastEpisode}` : "Started"}
        </p>
      </div>
      <span className="shrink-0 text-xs text-accent">Continue →</span>
    </Link>
  );
}

export default function DashboardPage() {
  const {
    ready,
    watchlist,
    favorites,
    watchedMovies,
    tvProgress,
    ratings,
    averageRating,
    recentActivity,
    getTotalWatchedEpisodes,
  } = usePersonalState();

  if (!ready) {
    return <div className="text-muted">Loading your data…</div>;
  }

  const totalEpisodesWatched = tvProgress.reduce((acc, p) => acc + getTotalWatchedEpisodes(p.showId), 0);
  const showsTracked = tvProgress.length;

  // Derive top genres from ratings (we have genre-less snapshots, so use ratings count as proxy)
  const ratingsCount = ratings.length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Movies Watched" value={watchedMovies.length} />
        <StatCard icon={<Tv className="h-5 w-5" />} label="Shows Tracked" value={showsTracked} />
        <StatCard icon={<Film className="h-5 w-5" />} label="Episodes Watched" value={totalEpisodesWatched} />
        <StatCard icon={<Bookmark className="h-5 w-5" />} label="Watchlist" value={watchlist.length} />
        <StatCard icon={<Heart className="h-5 w-5" />} label="Favorites" value={favorites.length} />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Average Rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : "—"}
          accent
        />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Titles Rated" value={ratingsCount} />
      </div>

      {/* Continue Watching */}
      {tvProgress.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text">Continue Watching</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tvProgress.slice(0, 6).map((progress) => (
              <ContinueWatchingCard key={progress.showId} progress={progress} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-text">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <EmptyState title="No activity yet" message="Start tracking movies and TV shows to see your activity here." />
        ) : (
          <div className="rounded-lg border border-white/5 bg-surface">
            {recentActivity.map((entry) => (
              <ActivityItem key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
