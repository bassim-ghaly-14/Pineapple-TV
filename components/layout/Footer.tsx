import Link from "next/link";
import Image from "next/image";

const DISCOVER = [
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/movies/discover", label: "Discover Movies" },
  { href: "/tv/discover", label: "Discover TV" },
  { href: "/search", label: "Search" },
];

const PERSONAL = [
  { href: "/watchlist", label: "Watchlist" },
  { href: "/favorites", label: "Favorites" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-surface/50">
      {/* Main footer */}
      <div className="container-pad py-12 sm:py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div className="max-w-xl">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label="Pineapple TV home">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-white/[0.06] transition-colors duration-200 group-hover:ring-accent/30">
                <Image
                  src="https://res.cloudinary.com/paihc5qx/image/upload/v1788693909/Pineapple_tv_application_icon_ari8mj.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  aria-hidden="true"
                />
              </span>

              <span className="text-xl font-bold tracking-tight text-text transition-colors duration-200 group-hover:text-accent">
                Pineapple TV
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              Discover, track, and organize your movie and TV experience in one
              personal space.
            </p>

            <p className="mt-3 max-w-md text-xs leading-6 text-muted/60">
              Pineapple TV is a personal discovery and tracking app. It does not
              host, distribute, or stream any movie or TV content.
            </p>

            {/* Brand accent */}
            <div className="mt-6 h-px w-16 bg-accent/60" aria-hidden="true" />
          </div>

          {/* Discover */}
          <nav aria-label="Discover">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-text">
              Discover
            </h2>

            <ul className="space-y-1">
              {DISCOVER.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group -mx-2 flex min-h-9 items-center rounded-md px-2 text-sm text-muted transition-colors duration-200 hover:bg-accent/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    <span
                      className="mr-2 h-1 w-1 shrink-0 rounded-full bg-accent/0 transition-all duration-200 group-hover:mr-3 group-hover:bg-accent"
                      aria-hidden="true"
                    />

                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Personal */}
          <nav aria-label="Personal">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-text">
              Personal
            </h2>

            <ul className="space-y-1">
              {PERSONAL.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group -mx-2 flex min-h-9 items-center rounded-md px-2 text-sm text-muted transition-colors duration-200 hover:bg-accent/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    <span
                      className="mr-2 h-1 w-1 shrink-0 rounded-full bg-accent/0 transition-all duration-200 group-hover:mr-3 group-hover:bg-accent"
                      aria-hidden="true"
                    />

                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-pad flex flex-col gap-4 py-6 text-xs leading-5 text-muted/70 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {/* Copyright */}
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Pineapple TV.
            <span className="hidden sm:inline"> </span>
            <span className="block sm:inline">
              For personal, non-commercial use.
            </span>
          </p>

          {/* TMDB attribution */}
          <p className="max-w-xl text-center sm:text-right">
            Data &amp; images provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline-offset-4 transition-colors duration-200 hover:text-accent/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
              TMDB
            </a>
            {". "}This product uses the TMDB API but is not endorsed or
            certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
