"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Search, X, Bookmark, Heart, LayoutDashboard, Settings, SlidersHorizontal } from "lucide-react";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/movies/discover", label: "Discover Movies", icon: SlidersHorizontal },
  { href: "/tv", label: "TV Shows", icon: Tv },
  { href: "/tv/discover", label: "Discover TV", icon: SlidersHorizontal },
  { href: "/search", label: "Search", icon: Search },
];

const PERSONAL = [
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderLink = (href: string, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <Link
      key={href}
      href={href}
      onClick={onMobileClose}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive(href) ? "bg-accent/15 text-accent" : "text-muted hover:bg-surface-hover hover:text-text"
      }`}
      aria-current={isActive(href) ? "page" : undefined}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );

  const content = (
    <nav className="flex flex-col gap-1 p-3">
      <div className="mb-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted/60">
        Discover
      </div>
      {NAV.map(({ href, label, icon }) => renderLink(href, label, icon))}
      <div className="mb-1 mt-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted/60">
        Personal
      </div>
      {PERSONAL.map(({ href, label, icon }) => renderLink(href, label, icon))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-white/5 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-surface shadow-elevated animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
              <span className="text-lg font-bold text-text">Menu</span>
              <button
                onClick={onMobileClose}
                className="rounded-lg p-2 text-muted hover:bg-surface-hover"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
