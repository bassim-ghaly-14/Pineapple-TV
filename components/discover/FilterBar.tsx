"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Genre } from "@/lib/domain/models";
import {
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Tags,
  ArrowUpDown,
  CalendarDays,
  Star,
  RotateCcw,
} from "lucide-react";
import { type FilterState, buildUrlParams } from "@/lib/discover/filters";

interface FilterBarProps {
  genres: Genre[];
  basePath: string;
  filters: FilterState;
  totalPages: number;
  sortOptions: { value: string; label: string }[];
}

export function FilterBar({
  genres,
  basePath,
  filters,
  totalPages,
  sortOptions,
}: FilterBarProps) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (updates: Partial<FilterState>, resetPage = true) => {
      const withPage = resetPage ? { ...updates, page: 1 } : updates;
      const next = buildUrlParams({ ...filters, ...withPage });
      router.push(`${basePath}?${next.toString()}`);
    },
    [params, router, basePath, filters],
  );

  const goToPage = useCallback(
    (page: number) => {
      const next = buildUrlParams({ ...filters, page });
      router.push(`${basePath}?${next.toString()}`);
    },
    [params, router, basePath, filters],
  );

  const activeFilterCount = [
    filters.genre,
    filters.year,
    filters.minRating,
  ].filter(Boolean).length;

  const maxPages = Math.min(totalPages, 500);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/60 shadow-card backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <SlidersHorizontal className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-text">
                Discover Filters
              </h2>
              <p className="text-xs text-muted">Refine your results</p>
            </div>

            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-text">
                {activeFilterCount}
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() =>
                update({
                  genre: undefined,
                  year: undefined,
                  minRating: undefined,
                  sort: undefined,
                })
              }
              className="group inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-white/[0.05] hover:text-text">
              <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45" />
              Reset filters
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          {/* Genre */}
          <label className="group space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <Tags className="h-3.5 w-3.5 text-accent" />
              Genre
            </span>

            <div className="relative">
              <select
                value={filters.genre ?? ""}
                onChange={(e) =>
                  update({
                    genre: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-10 w-full appearance-none rounded-xl border border-white/[0.08] bg-bg/40 px-3 pr-9 text-sm text-text outline-none transition-all hover:border-white/[0.14] focus:border-accent/50 focus:bg-bg/70 focus:ring-4 focus:ring-accent/5"
                aria-label="Filter by genre">
                <option value="">All Genres</option>

                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted" />
            </div>
          </label>

          {/* Sort */}
          <label className="group space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <ArrowUpDown className="h-3.5 w-3.5 text-accent" />
              Sort by
            </span>

            <div className="relative">
              <select
                value={filters.sort ?? ""}
                onChange={(e) => update({ sort: e.target.value || undefined })}
                className="h-10 w-full appearance-none rounded-xl border border-white/[0.08] bg-bg/40 px-3 pr-9 text-sm text-text outline-none transition-all hover:border-white/[0.14] focus:border-accent/50 focus:bg-bg/70 focus:ring-4 focus:ring-accent/5"
                aria-label="Sort by">
                <option value="">Popularity</option>

                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted" />
            </div>
          </label>

          {/* Year */}
          <label className="group space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <CalendarDays className="h-3.5 w-3.5 text-accent" />
              Release year
            </span>

            <input
              type="number"
              value={filters.year ?? ""}
              onChange={(e) =>
                update({
                  year: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Any year"
              min={1900}
              max={2030}
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-bg/40 px-3 text-sm text-text outline-none transition-all placeholder:text-muted hover:border-white/[0.14] focus:border-accent/50 focus:bg-bg/70 focus:ring-4 focus:ring-accent/5"
              aria-label="Filter by year"
            />
          </label>

          {/* Rating */}
          <label className="group space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              Minimum rating
            </span>

            <div className="relative">
              <select
                value={filters.minRating ?? ""}
                onChange={(e) =>
                  update({
                    minRating: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="h-10 w-full appearance-none rounded-xl border border-white/[0.08] bg-bg/40 px-3 pr-9 text-sm text-text outline-none transition-all hover:border-white/[0.14] focus:border-accent/50 focus:bg-bg/70 focus:ring-4 focus:ring-accent/5"
                aria-label="Minimum rating">
                <option value="">Any Rating</option>
                <option value="7">7+ ★</option>
                <option value="8">8+ ★</option>
                <option value="9">9+ ★</option>
              </select>

              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted" />
            </div>
          </label>
        </div>

        {/* Active filter summary */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 border-t border-white/[0.06] bg-white/[0.015] px-4 py-2.5 sm:px-5">
            <span className="text-xs text-muted">
              {activeFilterCount} active filter
              {activeFilterCount !== 1 ? "s" : ""}
            </span>

            <div className="h-1 w-1 rounded-full bg-muted/50" />

            <span className="text-xs text-muted">
              Results update automatically
            </span>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-surface/40 px-3 py-2.5 sm:px-4">
          <div className="text-sm">
            <span className="font-semibold text-text">Page {filters.page}</span>
            <span className="text-muted"> of {maxPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(Math.max(1, filters.page - 1))}
              disabled={filters.page <= 1}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-all",
                "border-white/[0.08] text-muted",
                "hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-text",
                "disabled:pointer-events-none disabled:opacity-35",
              )}
              aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="hidden h-5 w-px bg-white/[0.08] sm:block" />

            <button
              onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
              disabled={filters.page >= totalPages || filters.page >= 500}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all",
                "bg-accent text-accent-text shadow-glow",
                "hover:scale-[1.02] hover:brightness-110",
                "disabled:pointer-events-none disabled:opacity-35",
              )}
              aria-label="Next page">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
