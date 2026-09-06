import Image from "next/image";
import { User } from "lucide-react";
import type { CastMember, CrewMember } from "@/lib/domain/models";
import { buildProfileUrl } from "@/lib/tmdb/image-config";

export function CastCard({ person }: { readonly person: CastMember }) {
  const img = buildProfileUrl(person.profilePath, "small");
  return (
    <div className="w-28 shrink-0 text-center sm:w-32">
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-surface-elevated">
        {img ? (
          <Image src={img} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <User className="h-8 w-8" />
          </div>
        )}
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
        {img ? (
          <Image src={img} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <User className="h-8 w-8" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium leading-snug text-text">{person.name}</p>
      <p className="line-clamp-1 text-xs text-muted">{person.job}</p>
    </div>
  );
}
