"use client";

import { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  Check,
  Moon,
  Sun,
  BarChart3,
} from "lucide-react";
import { usePersonalState } from "@/lib/state/PersonalStateContext";
import { useTheme } from "@/lib/theme/provider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { clearAll, watchlist, favorites, ratings } = usePersonalState();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    clearAll();
    setCleared(true);
    setConfirming(false);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 pb-10 sm:space-y-10">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Settings
        </h1>

        <p className="max-w-xl text-sm leading-6 text-muted">
          Manage your appearance and personal data preferences.
        </p>
      </header>

      {/* Appearance */}
      <section
        aria-labelledby="appearance-heading"
        className="overflow-hidden rounded-2xl border border-white/[0.07] bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <h2
                id="appearance-heading"
                className="text-base font-semibold text-text sm:text-lg">
                Appearance
              </h2>

              <p className="mt-0.5 text-sm text-muted">
                Choose how Pineapple TV looks on your device.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div
            role="group"
            aria-label="Theme"
            className="grid grid-cols-2 gap-3 sm:max-w-sm">
            {(["dark", "light"] as const).map((t) => {
              const isActive = theme === t;

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  aria-pressed={isActive}
                  className={`group relative flex min-h-12 items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold capitalize outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0f] ${
                    isActive
                      ? "border-accent/60 bg-accent/[0.08] text-accent shadow-[0_0_20px_rgba(247,200,51,0.06)]"
                      : "border-white/[0.08] bg-white/[0.02] text-muted hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-text"
                  }`}>
                  {t === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}

                  <span>{t}</span>

                  {isActive && (
                    <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[#0b0b0f]">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Your Data */}
      <section
        aria-labelledby="data-heading"
        className="overflow-hidden rounded-2xl border border-white/[0.07] bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="data-heading"
                className="text-base font-semibold text-text sm:text-lg">
                Your Data
              </h2>

              <p className="mt-0.5 text-sm text-muted">
                A quick overview of your personal Pineapple TV data.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Watchlist */}
            <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.11] hover:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Watchlist
                </p>

                <span className="h-1.5 w-1.5 rounded-full bg-accent/70 opacity-60 transition-opacity group-hover:opacity-100" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-text">
                {watchlist.length}
              </p>

              <p className="mt-1 text-xs text-muted">
                {watchlist.length === 1 ? "title" : "titles"}
              </p>
            </div>

            {/* Favorites */}
            <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.11] hover:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Favorites
                </p>

                <span className="h-1.5 w-1.5 rounded-full bg-accent/70 opacity-60 transition-opacity group-hover:opacity-100" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-text">
                {favorites.length}
              </p>

              <p className="mt-1 text-xs text-muted">
                {favorites.length === 1 ? "title" : "titles"}
              </p>
            </div>

            {/* Ratings */}
            <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.11] hover:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Ratings
                </p>

                <span className="h-1.5 w-1.5 rounded-full bg-accent/70 opacity-60 transition-opacity group-hover:opacity-100" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-text">
                {ratings.length}
              </p>

              <p className="mt-1 text-xs text-muted">
                {ratings.length === 1 ? "title" : "titles"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3.5">
            <p className="text-xs leading-5 text-muted">
              Your personal data is stored locally in your browser. It never
              leaves your device, and clearing it cannot be undone.
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section
        aria-labelledby="danger-heading"
        className="overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/[0.025]">
        {/* Danger Header */}
        <div className="border-b border-red-500/20 bg-red-500/[0.035] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="danger-heading"
                className="text-base font-semibold text-red-400 sm:text-lg">
                Danger Zone
              </h2>

              <p className="mt-0.5 text-sm text-red-300/60">
                Irreversible actions that affect your locally stored data.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Content */}
        <div className="p-5 sm:p-6">
          {cleared ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-green-400/20 bg-green-400/[0.05] p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-400/10 text-green-400">
                <Check className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-400">
                  Data cleared successfully
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  All personal data stored in this browser has been removed.
                </p>
              </div>
            </div>
          ) : confirming ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.035] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">
                    Clear all personal data?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    This will permanently delete your watchlist, favorites,
                    watched history, and ratings. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/[0.08] bg-transparent px-5 py-2.5 text-sm font-medium text-muted outline-none transition-colors hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-text focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0f]">
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-500 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:border-red-600 hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0f]">
                  <Trash2 className="h-4 w-4" />
                  Yes, clear everything
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text">
                  Clear personal data
                </p>

                <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
                  Remove your watchlist, favorites, watched history, and ratings
                  from this browser.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-transparent px-5 py-2.5 text-sm font-semibold text-red-400 outline-none transition-colors hover:border-red-500/60 hover:bg-red-500/[0.08] hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0f]">
                <Trash2 className="h-4 w-4" />
                Clear Data
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
