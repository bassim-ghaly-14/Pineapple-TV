// Server-only TMDB client. The token must never reach the browser.

const BASE_URL = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number; // seconds
  tags?: string[];
}

export async function tmdbFetch<T>(
  path: string,
  { params = {}, revalidate = 3600, tags }: RequestOptions = {},
): Promise<T> {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    throw new TmdbError("TMDB_API_TOKEN is not configured", 500);
  }

  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  url.searchParams.set("language", (params.language as string) ?? "en-US");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: {
      revalidate,
      tags,
    },
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new TmdbError("Rate limited by TMDB. Please wait and retry.", 429);
    }
    throw new TmdbError(`TMDB request failed (${res.status})`, res.status);
  }

  return (await res.json()) as T;
}
