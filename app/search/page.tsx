"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MediaSummary } from "@/lib/domain/models";
import { MediaGrid } from "@/components/media/MediaGrid";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Tab = "all" | "movies" | "tv";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "tv", label: "TV Shows" },
];

function SearchPageContent() {
  const router = useRouter();
  const params = useSearchParams();

  const initialQuery = params.get("q") ?? "";
  const initialTab = (params.get("type") as Tab) ?? "all";
  const initialPage = params.get("page") ? Math.max(1, Number(params.get("page"))) : 1;

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState<MediaSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushUrl = (q: string, t: Tab, p: number) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (t !== "all") next.set("type", t);
    if (p > 1) next.set("page", String(p));
    router.push(`/search?${next.toString()}`);
  };

  useEffect(() => {
    if (!activeQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      setError(false);
      setTotalPages(0);
      setTotalResults(0);
      return;
    }
    setIsLoading(true);
    setError(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(activeQuery)}&type=${tab}&page=${page}`,
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.results ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalResults(data.totalResults ?? 0);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeQuery, tab, page]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
    setPage(1);
    pushUrl(query, tab, 1);
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setPage(1);
    pushUrl(activeQuery, newTab, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    pushUrl(activeQuery, tab, newPage);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Search</h1>

      <form onSubmit={onSubmit} className="max-w-xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows…"
          className="w-full rounded-full border border-white/10 bg-surface px-5 py-3 text-text placeholder:text-muted focus:border-accent/50 focus:outline-none"
          aria-label="Search"
          autoFocus
        />
      </form>

      <div className="flex gap-1 rounded-full border border-white/10 bg-surface p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id ? "bg-accent text-accent-text" : "text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!activeQuery.trim() ? (
        <EmptyState title="Start typing to search" message="Find movies and TV shows by title." />
      ) : error ? (
        <div className="rounded-lg border border-white/5 bg-surface px-4 py-8 text-center text-sm text-muted">
          Search failed. Please try again.
        </div>
      ) : (
        <>
          {!isLoading && results.length === 0 && activeQuery.trim() && (
            <EmptyState title="No results found" message={`Nothing matched "${activeQuery}".`} />
          )}
          <MediaGrid items={results} isLoading={isLoading} />
          {!isLoading && results.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">
                {totalResults} results for &ldquo;{activeQuery}&rdquo;
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-white/10 p-2 text-muted hover:text-text disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-muted">
                    Page {page} of {Math.min(totalPages, 500)}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages || page >= 500}
                    className="rounded-lg border border-white/10 p-2 text-muted hover:text-text disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
