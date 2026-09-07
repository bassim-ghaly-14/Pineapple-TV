"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Star } from "lucide-react";
import type { TVShow, CastMember, CrewMember, Video, MediaSummary } from "@/lib/domain/models";
import { TrailerModal } from "@/components/media/TrailerModal";
import { pickTrailer } from "@/lib/tmdb/trailer";
import { MediaDetailHero } from "@/components/media/MediaDetailHero";
import { CastSection } from "@/components/media/CastSection";
import { CrewSection } from "@/components/media/CrewSection";
import { MediaRow } from "@/components/media/MediaRow";
import { WatchlistButton, FavoriteButton, RatingStars } from "@/components/ui/MediaActions";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import { WatchProviders } from "@/components/media/WatchProviders";
import { Keywords } from "@/components/media/Keywords";
import { formatDate, formatVote, cn } from "@/lib/utils";

interface Props {
  readonly data: {
    tv: TVShow;
    cast: CastMember[];
    crew: CrewMember[];
    videos: Video[];
    recommendations: MediaSummary[];
    similar: MediaSummary[];
    providers: { streaming: { id: number; name: string; logoPath: string | null }[]; rent: { id: number; name: string; logoPath: string | null }[]; buy: { id: number; name: string; logoPath: string | null }[] };
    keywords: string[];
  };
}

export function TVDetail({ data }: Props) {
  const { tv, cast, crew, videos, recommendations, similar } = data;
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const { getShowProgress, getTotalWatchedEpisodes } = usePersonalState();

  const trailer = pickTrailer(videos);

  const progress = getShowProgress(tv.id);
  const episodesWatched = getTotalWatchedEpisodes(tv.id);

  return (
    <div className="space-y-8">
      <MediaDetailHero
        title={tv.title}
        tagline={tv.tagline}
        posterPath={tv.posterPath}
        posterAlt={`${tv.title} poster`}
        backdropPath={tv.backdropPath}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {tv.releaseDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(tv.releaseDate)}
            </span>
          )}
          {tv.numberOfSeasons != null && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {tv.numberOfSeasons} season{tv.numberOfSeasons === 1 ? "" : "s"}
            </span>
          )}
          {tv.voteAverage > 0 && (
            <span className="font-semibold text-accent">★ {formatVote(tv.voteAverage)}</span>
          )}
        </div>
        {tv.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tv.genres.map((g) => (
              <span key={g.id} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                {g.name}
              </span>
            ))}
          </div>
        )}
        {tv.creators.length > 0 && (
          <p className="text-sm text-muted">
            <span className="text-text/70">Created by:</span> {tv.creators.join(", ")}
          </p>
        )}
        {tv.overview && <p className="max-w-2xl text-sm text-text/80 sm:text-base">{tv.overview}</p>}

        {/* Personal tracking actions */}
        <div className="flex flex-wrap items-center gap-2">
          <WatchlistButton media={tv} />
          <FavoriteButton media={tv} />
          <RatingStars media={tv} />
        </div>

        {trailer && (
          <button
            onClick={() => setTrailerKey(trailer!.key)}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-text shadow-glow transition-transform hover:scale-105"
          >
            ▶ Play Trailer
          </button>
        )}
      </MediaDetailHero>

      {/* Progress */}
      {episodesWatched > 0 && (
        <div className="rounded-lg border border-white/5 bg-surface p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-text">Your Progress</span>
            <span className="text-muted">
              {episodesWatched} episode{episodesWatched === 1 ? "" : "s"} watched
            </span>
          </div>
          {progress.lastWatchedSeason && progress.lastWatchedEpisode && (
            <Link
              href={`/tv/${tv.id}/season/${progress.lastWatchedSeason}`}
              className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <Star className="h-4 w-4" />
              Continue: Season {progress.lastWatchedSeason} · Episode {progress.lastWatchedEpisode}
            </Link>
          )}
        </div>
      )}

      {/* Seasons */}
      {tv.numberOfSeasons && tv.numberOfSeasons > 0 && (
        <section aria-labelledby="seasons-heading" className="space-y-3">
          <h2 id="seasons-heading" className="text-lg font-bold text-text">Seasons</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: tv.numberOfSeasons }, (_, i) => i + 1).map((num) => (
              <Link
                key={num}
                href={`/tv/${tv.id}/season/${num}`}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  progress.lastWatchedSeason === num
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-white/10 text-muted hover:bg-surface-hover hover:text-text",
                )}
              >
                Season {num}
              </Link>
            ))}
          </div>
        </section>
      )}

      <CastSection cast={cast} />

      <CrewSection crew={crew} priorityJobs={["Creator", "Executive Producer", "Director", "Writer"]} />

      {/* Keywords */}
      {data.keywords.length > 0 && <Keywords keywords={data.keywords} />}

      {/* Watch Providers */}
      {(data.providers.streaming.length > 0 || data.providers.rent.length > 0 || data.providers.buy.length > 0) && (
        <WatchProviders providers={data.providers} />
      )}

      {recommendations.length > 0 && (
        <MediaRow title="Recommendations" items={recommendations} isLoading={false} />
      )}

      {similar.length > 0 && (
        <MediaRow title="More Like This" items={similar} isLoading={false} />
      )}

      <TrailerModal videoKey={trailerKey} title={tv.title} onClose={() => setTrailerKey(null)} />
    </div>
  );
}
