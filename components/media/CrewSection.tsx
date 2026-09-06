import type { CrewMember } from "@/lib/domain/models";
import { CrewCard } from "./PersonCard";

export function CrewSection({
  crew,
  priorityJobs,
}: {
  readonly crew: CrewMember[];
  readonly priorityJobs: string[];
}) {
  if (crew.length === 0) return null;
  return (
    <section aria-labelledby="crew-heading" className="space-y-3">
      <h2 id="crew-heading" className="text-lg font-bold text-text">Key Crew</h2>
      <div className="flex flex-wrap gap-4">
        {crew
          .filter((c) => priorityJobs.includes(c.job))
          .slice(0, 8)
          .map((c) => (
            <CrewCard key={`${c.id}-${c.job}`} person={c} />
          ))}
      </div>
    </section>
  );
}