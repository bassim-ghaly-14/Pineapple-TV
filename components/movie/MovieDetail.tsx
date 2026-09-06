"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Calendar, Film } from "lucide-react";
import type { Movie, CastMember, CrewMember, Video, MediaSummary } from "@/lib/domain/models";
import { buildPosterUrl, buildBackdropUrl } from "@/lib/tmdb/image-config";
import { formatRuntime, formatDate, formatVote } from "@/lib/utils";
import { TrailerModal } from "@/components/media/TrailerModal";
import { pickTrailer } from "@/lib/tmdb/trailer";
import { CastCard, CrewCard } from "@/components/media/PersonCard";
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

  const backdrop = buildBackdropUrl(movie.backdropPath, "hero");

  return (
    <div className="space-y-8">
      <div className="relative isolate overflow-hidden rounded-xl">
        <div className="absolute inset-0">
          {backdrop ? (
            <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-surface-elevated" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
        </div>
        <div className="relative z-10 grid gap-6 p-5 sm:p-8 lg:grid-cols-[200px_1fr] lg:p-12">
          <div className="hidden lg:block">
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-surface-elevated shadow-card">
              {movie.posterPath ? (
                <Image
                  src={buildPosterUrl(movie.posterPath, "medium")!}
                  alt={`${movie.title} poster`}
                  width={500}
                  height={750}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted">
                  <Film className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4">
            <h1 className="text-2xl font-extrabold leading-tight text-text sm:text-4xl">{movie.title}</h1>
            {movie.tagline && <p className="text-sm italic text-muted">{movie.tagline}</p>}
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
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <section aria-labelledby="cast-heading" className="space-y-3">
          <h2 id="cast-heading" className="text-lg font-bold text-text">Top Cast</h2>
          <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
            {cast.slice(0, 12).map((c) => (
              <CastCard key={c.id} person={c} />
            ))}
          </div>
        </section>
      )}

      {crew.length > 0 && (
        <section aria-labelledby="crew-heading" className="space-y-3">
          <h2 id="crew-heading" className="text-lg font-bold text-text">Key Crew</h2>
          <div className="flex flex-wrap gap-4">
            {crew
              .filter((c) =>
                ["Director", "Writer", "Producer", "Screenplay", "Editor", "Original Music Composer"].includes(c.job),
              )
              .slice(0, 8)
              .map((c) => (
                <CrewCard key={`${c.id}-${c.job}`} person={c} />
              ))}
          </div>
        </section>
      )}

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
