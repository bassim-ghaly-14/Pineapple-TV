"use client";

import { useState } from "react";
import type { MediaSummary } from "@/lib/domain/models";
import { MediaHero } from "@/components/media/MediaHero";
import { TrailerModal } from "@/components/media/TrailerModal";

type TrailerState = "idle" | "loading" | "unavailable" | "error";

// Hero fetches its own trailer on demand to avoid blocking the home page.
export function Hero({ media }: { readonly media: MediaSummary }) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [status, setStatus] = useState<TrailerState>("idle");

  const onPlay = async () => {
    setStatus("loading");
    try {
      const res = await fetch(
        `/api/tmdb/trailer?mediaType=${media.mediaType}&id=${media.id}`,
      );
      if (!res.ok) throw new Error(`Trailer lookup failed (${res.status})`);
      const data: { key: string | null } = await res.json();
      if (data.key) {
        setTrailerKey(data.key);
        setStatus("idle");
      } else {
        // A 200 with no key genuinely means no usable YouTube trailer.
        setStatus("unavailable");
      }
    } catch {
      // Distinguish an API/service failure from "no trailer exists":
      // don't hide outages as if the title simply has no trailer.
      setStatus("error");
    }
  };

  return (
    <>
      <MediaHero
        media={media}
        onPlayTrailer={onPlay}
        isTrailerLoading={status === "loading"}
      >
        {status === "unavailable" && (
          <output className="block text-sm text-muted">
            No trailer is currently available for this title. You can still
            browse it on TMDB.
          </output>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm text-muted">
            Something went wrong while looking up the trailer. Please try again.
          </p>
        )}
      </MediaHero>
      <TrailerModal
        videoKey={trailerKey}
        title={media.title}
        onClose={() => setTrailerKey(null)}
      />
    </>
  );
}
