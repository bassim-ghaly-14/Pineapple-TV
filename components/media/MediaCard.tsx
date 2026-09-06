import Link from "next/link";
import Image from "next/image";
import { Film, Tv } from "lucide-react";
import type { MediaSummary } from "@/lib/domain/models";
import { buildPosterUrl } from "@/lib/tmdb/image-config";
import { formatVote } from "@/lib/utils";
import { WatchlistButton, FavoriteButton } from "@/components/ui/MediaActions";

export function MediaCard({ media }: { readonly media: MediaSummary }) {
  const href = `/${media.mediaType === "tv" ? "tv" : "movies"}/${media.id}`;
  const poster = buildPosterUrl(media.posterPath, "card");

  return (
    <Link
      href={href}
      className="group block w-full"
      aria-label={media.title}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-elevated shadow-card">
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 150px, 180px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            {media.mediaType === "tv" ? <Tv className="h-8 w-8" /> : <Film className="h-8 w-8" />}
            <span className="text-xs">No image</span>
          </div>
        )}
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
        {media.year !== null && <p className="text-xs text-muted">{media.year}</p>}
      </div>
    </Link>
  );
}
