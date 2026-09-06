import { notFound } from "next/navigation";
import { getSeasonDetails, getTVDetails } from "@/lib/tmdb/endpoints";
import { SeasonView } from "@/components/tv/SeasonView";

export const revalidate = 86400;

interface Props {
  readonly params: { id: string; seasonNumber: string };
}

export default async function SeasonPage({ params }: Props) {
  const showId = Number(params.id);
  const seasonNumber = Number(params.seasonNumber);
  if (Number.isNaN(showId) || Number.isNaN(seasonNumber)) notFound();

  try {
    const [season, tvData] = await Promise.all([
      getSeasonDetails(showId, seasonNumber),
      getTVDetails(showId),
    ]);
    return <SeasonView season={season} tv={tvData.tv} cast={tvData.cast} />;
  } catch {
    notFound();
  }
}
