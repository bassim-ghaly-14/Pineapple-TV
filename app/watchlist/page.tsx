"use client";

import { MediaCollection } from "@/components/media/MediaCollection";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import { Bookmark } from "lucide-react";

export default function WatchlistPage() {
  const { watchlist, ready } = usePersonalState();

  return (
    <MediaCollection
      items={watchlist}
      ready={ready}
      title="Watchlist"
      headerIcon={<Bookmark className="h-6 w-6 text-accent" />}
      emptyIcon={<Bookmark className="h-10 w-10 text-muted" />}
      emptyTitle="Your watchlist is empty"
      emptyMessage="Save movies and TV shows to keep track of what you want to watch."
    />
  );
}
