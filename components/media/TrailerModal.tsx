"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink } from "lucide-react";
import { buildTrailerEmbedUrl, buildTrailerWatchUrl } from "@/lib/tmdb/trailer";

interface TrailerModalProps {
  videoKey: string | null;
  title: string;
  onClose: () => void;
}

function TrailerIframe({
  src,
  title,
  onError,
}: {
  src: string;
  title: string;
  onError: () => void;
}) {
  return (
    <iframe
      src={src}
      title={title}
      // "autoplay" here only permits user-initiated playback (e.g. the iOS
      // tap-to-play handoff); nothing autoplays without user interaction.
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      onError={onError}
      className="h-full w-full"
    />
  );
}

export function TrailerModal({ videoKey, title, onClose }: TrailerModalProps) {
  const [failed, setFailed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // origin is only meaningful in the browser; pass the running app's origin
  // to YouTube (its recommended embed security measure).
  const embedUrl = videoKey
    ? buildTrailerEmbedUrl(
        videoKey,
        typeof window !== "undefined" ? window.location.origin : undefined,
      )
    : null;
  const youtubeUrl = videoKey ? buildTrailerWatchUrl(videoKey) : null;

  useEffect(() => {
    if (!videoKey) return;
    setFailed(false);
    // Move focus into the dialog for keyboard/screen-reader users.
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [videoKey, onClose]);

  if (!embedUrl || !youtubeUrl) return null;

  // The modal is an overlay: portal it to <body> so its fixed inset-0 root
  // never becomes a child of page containers with spacing utilities
  // (e.g. space-y-8), whose generated margins would distort the overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-4xl animate-fade-in">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-elevated">
          {failed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-sm text-muted">The trailer could not be loaded.</p>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-text hover:opacity-90"
              >
                <ExternalLink className="h-4 w-4" />
                Watch on YouTube
              </a>
            </div>
          ) : (
            <TrailerIframe
              src={embedUrl}
              title={`${title} trailer`}
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-full bg-surface p-2 text-text shadow-card hover:bg-surface-hover"
          aria-label="Close trailer"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Video courtesy of YouTube · Content provided by TMDB
          </p>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Watch on YouTube
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
