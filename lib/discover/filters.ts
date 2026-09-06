export interface FilterState {
  genre?: number;
  sort?: string;
  year?: number;
  minRating?: number;
  page: number;
}

export function parseFilters(params: URLSearchParams): FilterState {
  const genre = params.get("genre");
  const sort = params.get("sort");
  const year = params.get("year");
  const minRating = params.get("minRating");
  const page = params.get("page");
  return {
    genre: genre ? Number(genre) : undefined,
    sort: sort ?? undefined,
    year: year ? Number(year) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    page: page ? Math.max(1, Number(page)) : 1,
  };
}

export function buildUrlParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.genre) params.set("genre", String(filters.genre));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.year) params.set("year", String(filters.year));
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export interface DiscoverFilters {
  genre?: number;
  sort?: string;
  year?: number;
  minRating?: number;
  page?: number;
}

export function buildDiscoverParams(filters: DiscoverFilters): Record<string, string | number> {
  const params: Record<string, string | number> = { page: filters.page ?? 1 };
  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  if (filters.minRating) params["vote_average.gte"] = filters.minRating;
  if (filters.sort) params.sort_by = filters.sort;
  return params;
}
