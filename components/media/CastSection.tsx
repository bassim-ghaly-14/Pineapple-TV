import type { CastMember } from "@/lib/domain/models";
import { CastCard } from "./PersonCard";

export function CastSection({ cast }: { readonly cast: CastMember[] }) {
  if (cast.length === 0) return null;
  return (
    <section aria-labelledby="cast-heading" className="space-y-3">
      <h2 id="cast-heading" className="text-lg font-bold text-text">Top Cast</h2>
      <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
        {cast.slice(0, 12).map((c) => (
          <CastCard key={c.id} person={c} />
        ))}
      </div>
    </section>
  );
}