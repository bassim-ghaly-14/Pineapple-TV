"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE_URL } from "@/lib/tmdb/image-config";

type AppImageProps = Omit<ImageProps, "src"> & { readonly src: string | null };

/**
 * AppImage renders a `next/image` with graceful fallback handling:
 *  - a missing/null/empty `src` renders the shared global fallback asset
 *  - a `src` that fails to load is swapped to the shared fallback asset
 *
 * The onError guard ensures the fallback never attempts to trigger itself,
 * so a broken fallback URL can never produce an infinite error loop.
 */
export function AppImage({ src, ...rest }: AppImageProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const useFallback = !src || hasFailed;
  const resolvedSrc = useFallback ? FALLBACK_IMAGE_URL : src;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      onError={() => {
        // Only swap once, and only when we are not already showing the fallback.
        if (src && !hasFailed) {
          setHasFailed(true);
        }
      }}
    />
  );
}