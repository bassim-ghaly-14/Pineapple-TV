"use client";

import { useState } from "react";
import { Clock, Calendar, Film } from "lucide-react";
import type { Movie, CastMember, CrewMember, Video, MediaSummary } from "@/lib/domain/models";
import { formatRuntime, formatDate, formatVote } from "@/lib/utils";
import { TrailerModal } from "@/components/media/TrailerModal";
import { pickTrailer } from "@/lib/tmdb/trailer";
import { MediaDetailHero } from "@/components/media/MediaDetailHero";
import { CastSection } from "@/components/media/CastSection";
import { CrewSection } from "@/components/media/CrewSection";
import { MediaRow } from "@/components/media/MediaRow";
import { WatchlistButton, FavoriteButton, WatchedButton, RatingStars } from "@/components/ui/MediaActions";
import { WatchProviders } from "@/components/media/WatchProviders";
import { Keywords } from "@/components/media/Keywords";

interface Props {
  readonly data: {
    movie: Movie;
    cast: CastMember[];
    crew: CrewMember[];
    videos: Video[];
    recommendations: MediaSummary[];
    similar: MediaSummary[];
    providers: { streaming: { id: number; name: string; logoPath: string | null }[]; rent: { id: number; name: string; logoPath: string | null }[]; buy: { id: number; name: string; logoPath: string | null }[] };
    keywords: string[];
  };
}

export function MovieDetail({ data }: Props) {
  const { movie, cast, crew, videos, recommendations, similar } = data;
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const trailer = pickTrailer(videos);

  return (
    <div className="space-y-8">
      <MediaDetailHero
        title={movie.title}
        tagline={movie.tagline}
        posterPath={movie.posterPath}
        posterAlt={`${movie.title} poster`}
        backdropPath={movie.backdropPath}
        fallbackIcon={<Film className="h-12 w-12" />}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {movie.releaseDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(movie.releaseDate)}
            </span>
          )}
          {movie.runtime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {formatRuntime(movie.runtime)}
            </span>
          )}
          {movie.voteAverage > 0 && (
            <span className="font-semibold text-accent">★ {formatVote(movie.voteAverage)}</span>
          )}
        </div>
        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g.id} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                {g.name}
              </span>
            ))}
          </div>
        )}
        {movie.overview && <p className="max-w-2xl text-sm text-text/80 sm:text-base">{movie.overview}</p>}

        {/* Personal tracking actions */}
        <div className="flex flex-wrap items-center gap-2">
          <WatchlistButton media={movie} />
          <FavoriteButton media={movie} />
          <WatchedButton media={movie} />
          <RatingStars media={movie} />
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

      <CastSection cast={cast} />

      <CrewSection
        crew={crew}
        priorityJobs={["Director", "Writer", "Producer", "Screenplay", "Editor", "Original Music Composer"]}
      />

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

      <TrailerModal videoKey={trailerKey} title={movie.title} onClose={() => setTrailerKey(null)} />
    </div>
  );
}
