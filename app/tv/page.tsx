import { getPopularTV, getTopRatedTV, getAiringTodayTV, getOnTheAirTV } from "@/lib/tmdb/endpoints";
import { MediaRow } from "@/components/media/MediaRow";

export const revalidate = 3600;

export const metadata = { title: "TV Shows" };

export default async function TVPage() {
  const [popular, topRated, airingToday, onTheAir] = await Promise.all([
    getPopularTV(),
    getTopRatedTV(),
    getAiringTodayTV(),
    getOnTheAirTV(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">TV Shows</h1>
      <MediaRow title="Popular" items={popular.results} isLoading={false} />
      <MediaRow title="On The Air" items={onTheAir.results} isLoading={false} />
      <MediaRow title="Top Rated" items={topRated.results} isLoading={false} />
      <MediaRow title="Airing Today" items={airingToday.results} isLoading={false} />
    </div>
  );
}
