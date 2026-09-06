import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieDetails } from "@/lib/tmdb/endpoints";
import { buildBackdropUrl, buildPosterUrl } from "@/lib/tmdb/image-config";
import { MovieDetail } from "@/components/movie/MovieDetail";

export const revalidate = 3600;

interface Props {
  readonly params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  if (Number.isNaN(id)) return { title: "Movie not found", robots: { index: false } };
  try {
    const { movie } = await getMovieDetails(id);
    const title = movie.year ? `${movie.title} (${movie.year})` : movie.title;
    const description =
      movie.overview.slice(0, 160) ||
      `Discover ${movie.title} on Pineapple TV — details, cast, and more.`;
    const images = [
      buildBackdropUrl(movie.backdropPath, "large"),
      buildPosterUrl(movie.posterPath, "medium"),
    ].filter((src): src is string => src !== null);

    return {
      title,
      description,
      alternates: { canonical: `/movies/${movie.id}` },
      openGraph: {
        title,
        description: movie.overview || description,
        type: "video.movie",
        url: `/movies/${movie.id}`,
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
    return { title: "Movie not found", robots: { index: false } };
  }
}

export default async function MoviePage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  try {
    const data = await getMovieDetails(id);
    return <MovieDetail data={data} />;
  } catch {
    notFound();
  }
}
