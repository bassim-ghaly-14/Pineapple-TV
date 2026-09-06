import { describe, expect, it } from "vitest";
import {
  buildTrailerEmbedUrl,
  buildTrailerWatchUrl,
  pickTrailer,
} from "@/lib/tmdb/trailer";
import type { Video } from "@/lib/domain/models";

function video(overrides: Partial<Video> & { id: string }): Video {
  return {
    key: "abc123",
    name: "Trailer",
    site: "YouTube",
    type: "Trailer",
    official: false,
    publishedAt: null,
    ...overrides,
  };
}

describe("pickTrailer", () => {
  it("selects an official YouTube trailer", () => {
    const videos = [
      video({ id: "1", type: "Featurette", key: "feat1", official: true }),
      video({ id: "2", type: "Trailer", key: "trail1", official: true }),
    ];
    expect(pickTrailer(videos)?.key).toBe("trail1");
  });

  it("ignores non-YouTube videos (e.g. Vimeo)", () => {
    const videos = [
      video({ id: "1", site: "Vimeo", type: "Trailer", key: "vimeo1" }),
      video({ id: "2", type: "Clip", key: "clip1" }),
    ];
    expect(pickTrailer(videos)).toBeNull();
  });

  it("falls back to a teaser when no trailer exists", () => {
    const videos = [
      video({ id: "1", type: "Teaser", key: "tease1" }),
      video({ id: "2", type: "Clip", key: "clip1" }),
    ];
    expect(pickTrailer(videos)?.key).toBe("tease1");
  });

  it("prefers official over unofficial trailers", () => {
    const videos = [
      video({ id: "1", type: "Trailer", key: "unofficial", official: false }),
      video({ id: "2", type: "Trailer", key: "official", official: true }),
    ];
    expect(pickTrailer(videos)?.key).toBe("official");
  });

  it("prefers the newest trailer when several are official", () => {
    const videos = [
      video({
        id: "1",
        type: "Trailer",
        key: "older",
        official: true,
        publishedAt: "2024-01-01T00:00:00Z",
      }),
      video({
        id: "2",
        type: "Trailer",
        key: "newer",
        official: true,
        publishedAt: "2025-06-01T00:00:00Z",
      }),
    ];
    expect(pickTrailer(videos)?.key).toBe("newer");
  });

  it("returns null when there are no usable videos", () => {
    expect(pickTrailer([])).toBeNull();
    expect(pickTrailer([video({ id: "1", key: "" })])).toBeNull();
  });

  it("does not select clips/featurettes when only those exist", () => {
    const videos = [
      video({ id: "1", type: "Clip", key: "clip1" }),
      video({ id: "2", type: "Featurette", key: "feat1" }),
    ];
    expect(pickTrailer(videos)).toBeNull();
  });
});

describe("trailer URLs", () => {
  it("builds an embed URL with playsinline and no forced autoplay", () => {
    const url = buildTrailerEmbedUrl("om5Un9X720M");
    expect(url).toBe(
      "https://www.youtube.com/embed/om5Un9X720M?playsinline=1&rel=0",
    );
    expect(url).not.toContain("autoplay=1");
  });

  it("includes the application origin when provided (YouTube-recommended)", () => {
    const url = buildTrailerEmbedUrl("om5Un9X720M", "https://example.com");
    expect(url).toBe(
      "https://www.youtube.com/embed/om5Un9X720M?playsinline=1&rel=0&origin=https%3A%2F%2Fexample.com",
    );
  });

  it("builds a watch URL", () => {
    expect(buildTrailerWatchUrl("abc")).toBe(
      "https://www.youtube.com/watch?v=abc",
    );
  });
});
