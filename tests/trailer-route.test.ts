// @vitest-environment node
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Mock the TMDB client so route tests never hit the network or need a token.
vi.mock("@/lib/tmdb/client", () => ({
  tmdbFetch: vi.fn(),
}));

import { GET } from "@/app/api/tmdb/trailer/route";
import { tmdbFetch } from "@/lib/tmdb/client";

const mockedFetch = vi.mocked(tmdbFetch);

function request(mediaType: string, id: string): Request {
  return new Request(
    `http://localhost:3000/api/tmdb/trailer?mediaType=${mediaType}&id=${id}`,
  );
}

const tmdbVideoResponse = (results: unknown[]) => ({ id: 1, results });

beforeEach(() => {
  mockedFetch.mockReset();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/tmdb/trailer", () => {
  it("returns a real YouTube key for a valid movie request", async () => {
    mockedFetch.mockResolvedValueOnce(
      tmdbVideoResponse([
        {
          id: "1",
          key: "dfeUzm6KF4g",
          name: "20th Anniversary Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
          published_at: "2019-10-15T18:59:47.000Z",
        },
      ]),
    );

    const res = await GET(request("movie", "550"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      key: "dfeUzm6KF4g",
      name: "20th Anniversary Trailer",
    });
    expect(mockedFetch).toHaveBeenCalledWith("/movie/550/videos", expect.any(Object));
  });

  it("returns a real YouTube key for a valid TV request", async () => {
    mockedFetch.mockResolvedValueOnce(
      tmdbVideoResponse([
        {
          id: "2",
          key: "KPLWWIOCOOQ",
          name: "Official Series Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
        },
      ]),
    );

    const res = await GET(request("tv", "1399"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      key: "KPLWWIOCOOQ",
      name: "Official Series Trailer",
    });
    expect(mockedFetch).toHaveBeenCalledWith("/tv/1399/videos", expect.any(Object));
  });

  it("falls back to a teaser when only teasers exist", async () => {
    mockedFetch.mockResolvedValueOnce(
      tmdbVideoResponse([
        { id: "1", key: "tease1", name: "Teaser", site: "YouTube", type: "Teaser", official: true },
      ]),
    );

    const res = await GET(request("movie", "1"));
    expect((await res.json()).key).toBe("tease1");
  });

  it("returns null key/name when TMDB has no usable trailer", async () => {
    mockedFetch.mockResolvedValueOnce(tmdbVideoResponse([]));

    const res = await GET(request("movie", "1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ key: null, name: null });
  });

  it("ignores non-YouTube videos and returns null", async () => {
    mockedFetch.mockResolvedValueOnce(
      tmdbVideoResponse([
        { id: "1", key: "v1", name: "V", site: "Vimeo", type: "Trailer", official: true },
      ]),
    );

    const res = await GET(request("movie", "1"));
    expect(await res.json()).toEqual({ key: null, name: null });
  });

  it("rejects an invalid media type with 400", async () => {
    const res = await GET(request("book", "550"));
    expect(res.status).toBe(400);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("rejects a non-numeric ID with 400", async () => {
    const res = await GET(request("movie", "abc"));
    expect(res.status).toBe(400);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("returns 502 (not a silent no-trailer) when TMDB fails", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("TMDB request failed (500)"));

    const res = await GET(request("movie", "550"));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toBeDefined();
    expect(body.key).toBeUndefined();
  });

  it("returns 502 when TMDB returns malformed data (Zod rejection)", async () => {
    mockedFetch.mockResolvedValueOnce({ unexpected: true });

    const res = await GET(request("movie", "550"));
    expect(res.status).toBe(502);
  });
});