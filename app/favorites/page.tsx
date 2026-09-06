"use client";

import { MediaCollection } from "@/components/media/MediaCollection";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, ready } = usePersonalState();

  return (
    <MediaCollection
      items={favorites}
      ready={ready}
      title="Favorites"
      headerIcon={<Heart className="h-6 w-6 text-pink-400" />}
      emptyIcon={<Heart className="h-10 w-10 text-muted" />}
      emptyTitle="No favorites yet"
      emptyMessage="Mark movies and TV shows as favorites to find them here."
    />
  );
}
