"use client";

import { useState } from "react";
import { MediaGrid } from "@/components/media/MediaGrid";
import { EmptyState } from "@/components/ui/States";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import type { MediaSummary, MediaType } from "@/lib/domain/models";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

type Filter = "all" | MediaType;

function filterLabel(f: Filter): string {
  if (f === "all") return "All";
  if (f === "movie") return "Movies";
  return "TV Shows";
}

export default function WatchlistPage() {
  const { watchlist, ready } = usePersonalState();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? watchlist : watchlist.filter((item) => item.mediaType === filter);

  const items: MediaSummary[] = filtered.map((item) => ({
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    overview: "",
    posterPath: item.posterPath,
    backdropPath: null,
    releaseDate: null,
    year: null,
    voteAverage: 0,
    voteCount: 0,
  }));

  let content: React.ReactNode;
  if (!ready) {
    content = <MediaGrid items={[]} isLoading={true} />;
  } else if (watchlist.length === 0) {
    content = (
      <EmptyState
        icon={<Bookmark className="h-10 w-10 text-muted" />}
        title="Your watchlist is empty"
        message="Save movies and TV shows to keep track of what you want to watch."
      />
    );
  } else if (items.length === 0) {
    content = <EmptyState title="No items in this filter" />;
  } else {
    content = <MediaGrid items={items} isLoading={false} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-text sm:text-3xl">
          <Bookmark className="h-6 w-6 text-accent" /> Watchlist
        </h1>
        <span className="rounded-full bg-surface px-3 py-1 text-sm text-muted">{watchlist.length} titles</span>
      </div>

      <div className="flex gap-1 rounded-full border border-white/10 bg-surface p-1 w-fit">
        {(["all", "movie", "tv"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-accent text-accent-text" : "text-muted hover:text-text",
            )}
          >
            {filterLabel(f)}
          </button>
        ))}
      </div>

      {content}
    </div>
  );
}
