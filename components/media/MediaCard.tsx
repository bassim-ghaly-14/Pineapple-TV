import Link from "next/link";
import type { MediaSummary } from "@/lib/domain/models";
import { buildPosterUrl } from "@/lib/tmdb/image-config";
import { formatVote } from "@/lib/utils";
import { AppImage } from "@/components/media/AppImage";
import { WatchlistButton, FavoriteButton } from "@/components/ui/MediaActions";

export function MediaCard({ media }: { readonly media: MediaSummary }) {
  const href = `/${media.mediaType === "tv" ? "tv" : "movies"}/${media.id}`;
  const poster = buildPosterUrl(media.posterPath, "card");

  return (
    <Link href={href} className="group block w-full" aria-label={media.title}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-elevated shadow-card">
        <AppImage
          src={poster}
          alt=""
          fill
          sizes="(max-width: 640px) 150px, 180px"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {media.voteAverage > 0 && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-accent">
            {formatVote(media.voteAverage)}
          </span>
        )}
        <div className="absolute left-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <WatchlistButton media={media} size="sm" />
          <FavoriteButton media={media} size="sm" />
        </div>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-text group-hover:text-accent">
          {media.title}
        </p>
        {media.year !== null && (
          <p className="text-xs text-muted">{media.year}</p>
        )}
      </div>
    </Link>
  );
}
