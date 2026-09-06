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
    let res;
    if (type === "movie") {
      res = await searchMovies(query, page);
    } else if (type === "tv") {
      res = await searchTV(query, page);
    } else {
      res = await searchMulti(query, page);
    }
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
