"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { MediaGrid } from "./MediaGrid";
import { EmptyState } from "@/components/ui/States";
import type { MediaSummary, MediaType } from "@/lib/domain/models";
import type { SavedMedia } from "@/lib/repositories/types";
import { cn } from "@/lib/utils";

type Filter = "all" | MediaType;

function filterLabel(f: Filter): string {
  if (f === "all") return "All";
  if (f === "movie") return "Movies";
  return "TV Shows";
}

interface MediaCollectionProps {
  readonly items: SavedMedia[];
  readonly ready: boolean;
  readonly title: string;
  readonly headerIcon: ReactNode;
  readonly emptyIcon: ReactNode;
  readonly emptyTitle: string;
  readonly emptyMessage: string;
}

export function MediaCollection({
  items,
  ready,
  title,
  headerIcon,
  emptyIcon,
  emptyTitle,
  emptyMessage,
}: MediaCollectionProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? items : items.filter((item) => item.mediaType === filter);

  const gridItems: MediaSummary[] = filtered.map((item) => ({
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

  let content: ReactNode;
  if (!ready) {
    content = <MediaGrid items={[]} isLoading={true} />;
  } else if (items.length === 0) {
    content = <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;
  } else if (gridItems.length === 0) {
    content = <EmptyState title="No items in this filter" />;
  } else {
    content = <MediaGrid items={gridItems} isLoading={false} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-text sm:text-3xl">
          {headerIcon} {title}
        </h1>
        <span className="rounded-full bg-surface px-3 py-1 text-sm text-muted">{items.length} titles</span>
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