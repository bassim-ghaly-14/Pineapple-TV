import { NextResponse } from "next/server";
import { searchMulti, searchMovies, searchTV } from "@/lib/tmdb/endpoints";

export const revalidate = 600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const type = searchParams.get("type") ?? "multi";
  const page = Number(searchParams.get("page") ?? "1");

  if (!query) return NextResponse.json({ results: [], page: 1, totalPages: 0, totalResults: 0 });

  try {
    const res =
      type === "movie"
        ? await searchMovies(query, page)
        : type === "tv"
          ? await searchTV(query, page)
          : await searchMulti(query, page);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
