"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaSummary } from "@/lib/domain/models";
import { MediaCard } from "./MediaCard";
import { RowSkeleton } from "@/components/ui/Skeleton";

interface MediaRowProps {
  title: string;
  items: MediaSummary[] | undefined;
  isLoading: boolean;
  error?: boolean;
}

export function MediaRow({ title, items, isLoading, error }: MediaRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section aria-labelledby={`row-${title}`} className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id={`row-${title}`} className="text-lg font-bold text-text sm:text-xl">
          {title}
        </h2>
        <div className="hidden gap-1 sm:flex">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border border-white/10 p-1.5 text-muted hover:bg-surface-hover hover:text-text"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border border-white/10 p-1.5 text-muted hover:bg-surface-hover hover:text-text"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-white/5 bg-surface px-4 py-8 text-center text-sm text-muted">
          Could not load this section.
        </div>
      ) : isLoading || !items ? (
        <RowSkeleton />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No results.</p>
      ) : (
        <div
          ref={scrollerRef}
          className="scrollbar-none flex gap-3 overflow-x-auto pb-2"
        >
          {items.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="w-[150px] shrink-0 sm:w-[180px]">
              <MediaCard media={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
