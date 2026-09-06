import { discoverTV, getTVGenres } from "@/lib/tmdb/endpoints";
import { MediaGrid } from "@/components/media/MediaGrid";
import { FilterBar } from "@/components/discover/FilterBar";
import { EmptyState } from "@/components/ui/States";
import { parseFilters } from "@/lib/discover/filters";

export const revalidate = 600;

interface Props {
  readonly searchParams: { [key: string]: string | string[] | undefined };
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "first_air_date.desc", label: "Newest" },
  { value: "first_air_date.asc", label: "Oldest" },
];

export default async function DiscoverTVPage({ searchParams }: Props) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const filters = parseFilters(params);

  const [genres, data] = await Promise.all([getTVGenres(), discoverTV(filters)]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Discover TV Shows</h1>
      <FilterBar
        genres={genres}
        basePath="/tv/discover"
        filters={filters}
        totalPages={data.totalPages}
        sortOptions={SORT_OPTIONS}
      />
      {data.results.length === 0 ? (
        <EmptyState title="No shows found" message="Try adjusting your filters." />
      ) : (
        <MediaGrid items={data.results} isLoading={false} />
      )}
    </div>
  );
}
