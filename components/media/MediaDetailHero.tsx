import Image from "next/image";
import type { ReactNode } from "react";
import { buildBackdropUrl, buildPosterUrl } from "@/lib/tmdb/image-config";

interface MediaDetailHeroProps {
  readonly title: string;
  readonly tagline: string | null;
  readonly posterPath: string | null;
  readonly posterAlt: string;
  readonly backdropPath: string | null;
  readonly fallbackIcon: ReactNode;
  readonly children?: ReactNode;
}

export function MediaDetailHero({
  title,
  tagline,
  posterPath,
  posterAlt,
  backdropPath,
  fallbackIcon,
  children,
}: MediaDetailHeroProps) {
  const backdrop = buildBackdropUrl(backdropPath, "hero");

  return (
    <div className="relative isolate overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        {backdrop ? (
          <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-surface-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
      </div>
      <div className="relative z-10 grid gap-6 p-5 sm:p-8 lg:grid-cols-[200px_1fr] lg:p-12">
        <div className="hidden lg:block">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-surface-elevated shadow-card">
            {posterPath ? (
              <Image
                src={buildPosterUrl(posterPath, "medium")!}
                alt={posterAlt}
                width={500}
                height={750}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">{fallbackIcon}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-end gap-4">
          <h1 className="text-2xl font-extrabold leading-tight text-text sm:text-4xl">{title}</h1>
          {tagline && <p className="text-sm italic text-muted">{tagline}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}