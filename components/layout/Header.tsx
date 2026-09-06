"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/provider";

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const q = search.trim();

    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl">
      <div className="container-pad">
        <div className="relative flex h-16 items-center gap-2 sm:gap-3">
          {/* =====================================================
              Mobile navigation
              ===================================================== */}

          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:hidden"
            aria-label="Toggle navigation">
            <Menu className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>

          {/* =====================================================
              Brand
              ===================================================== */}

          <Link
            href="/"
            className="
              group
              flex
              min-w-0
              items-center
              gap-2
              rounded-lg
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent
              focus-visible:ring-offset-2
              focus-visible:ring-offset-bg
              lg:shrink-0
            "
            aria-label="Pineapple TV home">
            <Image
              src="https://res.cloudinary.com/paihc5qx/image/upload/v1788693909/Pineapple_tv_application_icon_ari8mj.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              aria-hidden="true"
            />

            <span className="hidden text-lg font-bold tracking-tight text-text transition-colors duration-200 group-hover:text-accent sm:inline">
              Pineapple TV
            </span>
          </Link>

          {/* =====================================================
              Desktop search
              ===================================================== */}

          <form
            onSubmit={onSubmit}
            className="ml-auto hidden w-full max-w-md lg:block">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies, TV shows…"
                aria-label="Search movies and TV shows"
                className="
                  h-10
                  w-full
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-surface
                  pl-10
                  pr-4
                  text-sm
                  text-text
                  placeholder:text-muted
                  transition-colors
                  duration-200
                  hover:border-white/[0.14]
                  focus:border-accent/50
                  focus:bg-surface-elevated
                  focus:outline-none
                  focus:ring-1
                  focus:ring-accent/20
                "
              />
            </div>
          </form>

          {/* =====================================================
              Mobile actions
              ===================================================== */}

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <Link
              href="/search"
              className="
                inline-flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-muted
                transition-colors
                duration-200
                hover:bg-surface-hover
                hover:text-text
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-accent
                focus-visible:ring-offset-2
                focus-visible:ring-offset-bg
              "
              aria-label="Search">
              <Search className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={toggle}
              className="
                inline-flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-muted
                transition-colors
                duration-200
                hover:bg-surface-hover
                hover:text-text
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-accent
                focus-visible:ring-offset-2
                focus-visible:ring-offset-bg
              "
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* =====================================================
              Desktop theme
              ===================================================== */}

          <button
            type="button"
            onClick={toggle}
            className="
              hidden
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-muted
              transition-colors
              duration-200
              hover:bg-surface-hover
              hover:text-text
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent
              focus-visible:ring-offset-2
              focus-visible:ring-offset-bg
              lg:inline-flex
            "
            aria-label={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } mode`}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
