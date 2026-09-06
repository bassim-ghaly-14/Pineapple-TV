import Image from "next/image";
import { Play } from "lucide-react";
import type { MediaSummary } from "@/lib/domain/models";
import { buildBackdropUrl } from "@/lib/tmdb/image-config";
import { formatVote } from "@/lib/utils";

interface MediaHeroProps {
  media: MediaSummary;
  onPlayTrailer?: () => void;
  primaryActionLabel?: string;
  isTrailerLoading?: boolean;
  children?: React.ReactNode;
}

export function MediaHero({
  media,
  onPlayTrailer,
  primaryActionLabel = "Play trailer",
  isTrailerLoading = false,
  children,
}: MediaHeroProps) {
  const backdrop = buildBackdropUrl(media.backdropPath, "hero");

  return (
    <div className="relative isolate overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        {backdrop ? (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[280px] flex-col justify-end gap-4 p-5 sm:min-h-[360px] sm:p-8 lg:min-h-[420px] lg:p-12">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {media.mediaType === "tv" ? "TV Show" : "Movie"}
          </span>
          <h1 className="text-2xl font-extrabold leading-tight text-text sm:text-4xl lg:text-5xl">
            {media.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {media.year && <span>{media.year}</span>}
            {media.voteAverage > 0 && (
              <span className="font-semibold text-accent">★ {formatVote(media.voteAverage)}</span>
            )}
          </div>
          <p className="line-clamp-3 text-sm text-text/80 sm:text-base">{media.overview}</p>

          {onPlayTrailer && (
            <button
              onClick={onPlayTrailer}
              disabled={isTrailerLoading}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-text shadow-glow transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              {isTrailerLoading ? "Loading…" : primaryActionLabel}
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
