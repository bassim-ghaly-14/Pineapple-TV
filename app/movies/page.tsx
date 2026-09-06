import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from "@/lib/tmdb/endpoints";
import { MediaRow } from "@/components/media/MediaRow";

export const revalidate = 3600;

export const metadata = { title: "Movies" };

export default async function MoviesPage() {
  const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Movies</h1>
      <MediaRow title="Popular" items={popular.results} isLoading={false} />
      <MediaRow title="Now Playing" items={nowPlaying.results} isLoading={false} />
      <MediaRow title="Top Rated" items={topRated.results} isLoading={false} />
      <MediaRow title="Upcoming" items={upcoming.results} isLoading={false} />
    </div>
  );
}
