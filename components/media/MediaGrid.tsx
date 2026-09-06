import type { MediaSummary } from "@/lib/domain/models";
import { MediaCard } from "./MediaCard";
import { Skeleton } from "@/components/ui/Skeleton";

interface MediaGridProps {
  items: MediaSummary[] | undefined;
  isLoading: boolean;
}

export function MediaGrid({ items, isLoading }: MediaGridProps) {
  if (isLoading || !items) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[2/3] w-full" />
            <Skeleton className="mt-2 h-3.5 w-3/4" />
            <Skeleton className="mt-1.5 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={`${item.mediaType}-${item.id}`} media={item} />
      ))}
    </div>
  );
}
