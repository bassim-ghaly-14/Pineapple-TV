import { getTrending, getPopularMovies, getPopularTV, getTopRatedMovies, getUpcomingMovies, getAiringTodayTV } from "@/lib/tmdb/endpoints";
import { MediaRow } from "@/components/media/MediaRow";
import { Hero } from "@/components/home/Hero";

export const revalidate = 1800;

export default async function HomePage() {
  const [trending, popularMovies, popularTV, topRated, upcoming, airingToday] = await Promise.all([
    getTrending("all", "day"),
    getPopularMovies(),
    getPopularTV(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getAiringTodayTV(),
  ]);

  const hero = trending.results[0];

  return (
    <div className="space-y-8">
      {hero && <Hero media={hero} />}
      <MediaRow title="Trending Today" items={trending.results} isLoading={false} />
      <MediaRow title="Popular Movies" items={popularMovies.results} isLoading={false} />
      <MediaRow title="Popular TV Shows" items={popularTV.results} isLoading={false} />
      <MediaRow title="Top Rated Movies" items={topRated.results} isLoading={false} />
      <MediaRow title="Upcoming Movies" items={upcoming.results} isLoading={false} />
      <MediaRow title="Airing Today" items={airingToday.results} isLoading={false} />
    </div>
  );
}
