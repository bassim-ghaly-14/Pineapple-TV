"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  showId: number;
  currentSeason: number;
  totalSeasons: number;
}

export function SeasonSelector({ showId, currentSeason, totalSeasons }: Props) {
  const seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted">Seasons</h2>
      <div className="flex flex-wrap gap-2">
        {seasons.map((num) => (
          <Link
            key={num}
            href={`/tv/${showId}/season/${num}`}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              num === currentSeason
                ? "border-accent bg-accent/20 text-accent"
                : "border-white/10 text-muted hover:bg-surface-hover hover:text-text",
            )}
            aria-current={num === currentSeason ? "true" : undefined}
          >
            Season {num}
          </Link>
        ))}
      </div>
    </div>
  );
}
