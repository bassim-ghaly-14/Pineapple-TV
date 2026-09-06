"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Genre } from "@/lib/domain/models";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type FilterState, buildUrlParams } from "@/lib/discover/filters";

interface FilterBarProps {
  genres: Genre[];
  basePath: string;
  filters: FilterState;
  totalPages: number;
  sortOptions: { value: string; label: string }[];
}

export function FilterBar({ genres, basePath, filters, totalPages, sortOptions }: FilterBarProps) {
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

  const activeFilterCount = [filters.genre, filters.year, filters.minRating].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Genre */}
        <select
          value={filters.genre ?? ""}
          onChange={(e) => update({ genre: e.target.value ? Number(e.target.value) : undefined })}
          className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text focus:border-accent/50 focus:outline-none"
          aria-label="Filter by genre"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort ?? ""}
          onChange={(e) => update({ sort: e.target.value || undefined })}
          className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text focus:border-accent/50 focus:outline-none"
          aria-label="Sort by"
        >
          <option value="">Sort: Popularity</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Year */}
        <input
          type="number"
          value={filters.year ?? ""}
          onChange={(e) => update({ year: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Year"
          min={1900}
          max={2030}
          className="w-24 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent/50 focus:outline-none"
          aria-label="Filter by year"
        />

        {/* Min Rating */}
        <select
          value={filters.minRating ?? ""}
          onChange={(e) => update({ minRating: e.target.value ? Number(e.target.value) : undefined })}
          className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text focus:border-accent/50 focus:outline-none"
          aria-label="Minimum rating"
        >
          <option value="">Any Rating</option>
          <option value="7">7+ ★</option>
          <option value="8">8+ ★</option>
          <option value="9">9+ ★</option>
        </select>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => update({ genre: undefined, year: undefined, minRating: undefined, sort: undefined })}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-muted hover:text-text"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(Math.max(1, filters.page - 1))}
            disabled={filters.page <= 1}
            className="rounded-lg border border-white/10 p-2 text-muted hover:text-text disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted">
            Page {filters.page} of {Math.min(totalPages, 500)}
          </span>
          <button
            onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
            disabled={filters.page >= totalPages || filters.page >= 500}
            className="rounded-lg border border-white/10 p-2 text-muted hover:text-text disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}


