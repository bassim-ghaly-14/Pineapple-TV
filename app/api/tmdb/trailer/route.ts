import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb/client";
import { adaptVideos } from "@/lib/tmdb/adapters";
import { pickTrailer } from "@/lib/tmdb/trailer";

export const revalidate = 86400;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mediaType = searchParams.get("mediaType");
  const id = searchParams.get("id");

  if (
    (mediaType !== "movie" && mediaType !== "tv") ||
    !id ||
    !/^\d+$/.test(id)
  ) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  try {
    // NOTE: tmdbFetch's BASE_URL already includes the "/3" prefix.
    const data = await tmdbFetch(`/${mediaType}/${id}/videos`, {
      params: { language: "en-US" },
    });
    const videos = adaptVideos(data);
    const trailer = pickTrailer(videos);

    // Safe diagnostics only: never log the token or request headers.
    if (trailer) {
      console.log(
        `[/api/tmdb/trailer] ${mediaType}/${id} -> ${videos.length} videos, ` +
          `picked key=${trailer.key} site=${trailer.site} type=${trailer.type} official=${trailer.official}`,
      );
    } else {
      console.log(
        `[/api/tmdb/trailer] ${mediaType}/${id} -> ${videos.length} videos, no usable YouTube trailer`,
      );
    }

    return NextResponse.json({
      key: trailer?.key ?? null,
      name: trailer?.name ?? null,
    });
  } catch (error) {
    // Distinguish validation/TMDB failures so outages are not reported
    // to the client as "no trailer".
    console.error("[/api/tmdb/trailer] TMDB request failed:", error);
    return NextResponse.json(
      { error: "Trailer lookup failed" },
      { status: 502 },
    );
  }
}
