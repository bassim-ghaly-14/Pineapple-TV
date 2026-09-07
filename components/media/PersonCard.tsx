import type { CastMember, CrewMember } from "@/lib/domain/models";
import { buildProfileUrl } from "@/lib/tmdb/image-config";
import { AppImage } from "@/components/media/AppImage";

export function CastCard({ person }: { readonly person: CastMember }) {
  const img = buildProfileUrl(person.profilePath, "small");
  return (
    <div className="w-28 shrink-0 text-center sm:w-32">
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-surface-elevated">
        <AppImage src={img} alt="" fill sizes="128px" className="object-cover" />
      </div>
      <p className="mt-2 text-sm font-medium leading-snug text-text">{person.name}</p>
      <p className="line-clamp-1 text-xs text-muted">{person.character}</p>
    </div>
  );
}

export function CrewCard({ person }: { readonly person: CrewMember }) {
  const img = buildProfileUrl(person.profilePath, "small");
  return (
    <div className="w-28 shrink-0 text-center sm:w-32">
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-surface-elevated">
        <AppImage src={img} alt="" fill sizes="128px" className="object-cover" />
      </div>
      <p className="mt-2 text-sm font-medium leading-snug text-text">{person.name}</p>
      <p className="line-clamp-1 text-xs text-muted">{person.job}</p>
    </div>
  );
}
