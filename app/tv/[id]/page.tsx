import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTVDetails } from "@/lib/tmdb/endpoints";
import { buildBackdropUrl, buildPosterUrl } from "@/lib/tmdb/image-config";
import { TVDetail } from "@/components/tv/TVDetail";

export const revalidate = 3600;

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  if (Number.isNaN(id)) return { title: "Show not found", robots: { index: false } };
  try {
    const { tv } = await getTVDetails(id);
    const title = tv.year ? `${tv.title} (${tv.year})` : tv.title;
    const description =
      tv.overview.slice(0, 160) ||
      `Discover ${tv.title} on Pineapple TV — details, cast, seasons, and more.`;
    const images = [
      buildBackdropUrl(tv.backdropPath, "large"),
      buildPosterUrl(tv.posterPath, "medium"),
    ].filter((src): src is string => src !== null);

    return {
      title,
      description,
      alternates: { canonical: `/tv/${tv.id}` },
      openGraph: {
        title,
        description: tv.overview || description,
        type: "video.tv_show",
        url: `/tv/${tv.id}`,
        images: images.map((src) => ({ url: src })),
      },
      twitter: {
        card: images.length > 0 ? "summary_large_image" : "summary",
        title,
        description,
        images,
      },
    };
  } catch {
    return { title: "Show not found", robots: { index: false } };
  }
}

export default async function TVPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  try {
    const data = await getTVDetails(id);
    return <TVDetail data={data} />;
  } catch {
    notFound();
  }
}
