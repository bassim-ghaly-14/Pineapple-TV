import { describe, expect, it } from "vitest";

import {
  adaptPaginatedMedia,
  adaptRecommendations,
  adaptVideos,
} from "@/lib/tmdb/adapters";

describe("TMDB adapters", () => {
  describe("adaptPaginatedMedia", () => {
    it("should adapt movie results when media_type is missing", () => {
      const data = {
        page: 1,
        total_pages: 10,
        total_results: 200,
        results: [
          {
            id: 550,
            title: "Fight Club",
            overview: "An insomniac and a soap maker form an underground fight club.",
            poster_path: "/poster.jpg",
            backdrop_path: "/backdrop.jpg",
            release_date: "1999-10-15",
            vote_average: 8.4,
            vote_count: 25000,
          },
        ],
      };

      const result = adaptPaginatedMedia(data, "movie");

      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(10);
      expect(result.totalResults).toBe(200);

      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toMatchObject({
        id: 550,
        mediaType: "movie",
        title: "Fight Club",
        releaseDate: "1999-10-15",
        year: 1999,
      });
    });

    it("should adapt TV results when media_type is missing", () => {
      const data = {
        page: 1,
        total_pages: 5,
        total_results: 100,
        results: [
          {
            id: 1399,
            name: "Game of Thrones",
            overview: "Nine noble families fight for control over the Iron Throne.",
            poster_path: "/poster.jpg",
            backdrop_path: "/backdrop.jpg",
            first_air_date: "2011-04-17",
            vote_average: 8.4,
            vote_count: 23000,
          },
        ],
      };

      const result = adaptPaginatedMedia(data, "tv");

      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toMatchObject({
        id: 1399,
        mediaType: "tv",
        title: "Game of Thrones",
        releaseDate: "2011-04-17",
        year: 2011,
      });
    });

    it("should prefer TMDB media_type over the fallback", () => {
      const data = {
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [
          {
            id: 1,
            media_type: "tv",
            name: "Example Show",
            poster_path: null,
            backdrop_path: null,
            first_air_date: "2025-01-01",
          },
        ],
      };

      const result = adaptPaginatedMedia(data, "movie");

      expect(result.results[0].mediaType).toBe("tv");
    });

    it("should ignore unsupported results when media_type is missing and no fallback exists", () => {
      const data = {
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [
          {
            id: 999,
            name: "Unknown Result",
            poster_path: null,
            backdrop_path: null,
          },
        ],
      };

      const result = adaptPaginatedMedia(data);

      expect(result.results).toHaveLength(0);
    });

    it("should handle mixed movie and TV results", () => {
      const data = {
        page: 1,
        total_pages: 1,
        total_results: 2,
        results: [
          {
            id: 1,
            media_type: "movie",
            title: "Movie Result",
            poster_path: null,
            backdrop_path: null,
            release_date: "2024-01-01",
          },
          {
            id: 2,
            media_type: "tv",
            name: "TV Result",
            poster_path: null,
            backdrop_path: null,
            first_air_date: "2023-01-01",
          },
        ],
      };

      const result = adaptPaginatedMedia(data);

      expect(result.results).toHaveLength(2);

      expect(result.results[0].mediaType).toBe("movie");
      expect(result.results[1].mediaType).toBe("tv");
    });

    it("should use title for movies and name for TV shows", () => {
      const data = {
        page: 1,
        total_pages: 1,
        total_results: 2,
        results: [
          {
            id: 1,
            media_type: "movie",
            title: "Movie Title",
            name: "Wrong Name",
            poster_path: null,
            backdrop_path: null,
          },
          {
            id: 2,
            media_type: "tv",
            name: "TV Show Name",
            title: "Wrong Title",
            poster_path: null,
            backdrop_path: null,
          },
        ],
      };

      const result = adaptPaginatedMedia(data);

      expect(result.results[0].title).toBe("Movie Title");
      expect(result.results[1].title).toBe("TV Show Name");
    });
  });

  describe("adaptRecommendations", () => {
    it("should adapt recommendation results correctly", () => {
      const data = {
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [
          {
            id: 680,
            media_type: "movie",
            title: "Pulp Fiction",
            overview: "A classic crime film.",
            poster_path: "/poster.jpg",
            backdrop_path: "/backdrop.jpg",
            release_date: "1994-09-10",
            vote_average: 8.5,
            vote_count: 30000,
          },
        ],
      };

      const result = adaptRecommendations(data);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 680,
        mediaType: "movie",
        title: "Pulp Fiction",
        year: 1994,
      });
    });
  });

  describe("adaptVideos", () => {
    it("normalizes a realistic TMDB videos response", () => {
      const data = {
        id: 550,
        results: [
          {
            id: "5c9294240e0a267cd016c6b1",
            key: "dfeUzm6KF4g",
            name: "20th Anniversary Trailer",
            site: "YouTube",
            type: "Trailer",
            official: true,
            published_at: "2019-10-15T18:59:47.000Z",
            iso_639_1: "en",
          },
        ],
      };

      expect(adaptVideos(data)).toEqual([
        {
          id: "5c9294240e0a267cd016c6b1",
          key: "dfeUzm6KF4g",
          name: "20th Anniversary Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
          publishedAt: "2019-10-15T18:59:47.000Z",
        },
      ]);
    });

    it("keeps teasers, clips and non-YouTube videos without dropping them", () => {
      const data = {
        id: 1,
        results: [
          { id: "a", key: "tease1", name: "Teaser", site: "YouTube", type: "Teaser", official: true },
          { id: "b", key: "clip1", name: "Clip", site: "YouTube", type: "Clip", official: false },
          { id: "c", key: "vimeo1", name: "Vimeo", site: "Vimeo", type: "Trailer", official: false },
        ],
      };

      const videos = adaptVideos(data);
      expect(videos).toHaveLength(3);
      expect(videos.map((v) => v.site)).toEqual(["YouTube", "YouTube", "Vimeo"]);
      expect(videos.map((v) => v.type)).toEqual(["Teaser", "Clip", "Trailer"]);
    });

    it("tolerates missing/null optional fields without hiding malformed data", () => {
      const data = {
        id: 1,
        results: [
          // Descriptive fields can legitimately be omitted or null in TMDB.
          { id: "a", key: "abc123", name: null, site: "YouTube", type: null, official: null },
          { id: "b", key: "def456" },
        ],
      };

      expect(adaptVideos(data)).toEqual([
        { id: "a", key: "abc123", name: "", site: "YouTube", type: "", official: false, publishedAt: null },
        { id: "b", key: "def456", name: "", site: "", type: "", official: false, publishedAt: null },
      ]);
    });

    it("maps published_at null to publishedAt null", () => {
      const data = {
        id: 1,
        results: [
          { id: "a", key: "k1", name: "T", site: "YouTube", type: "Trailer", official: true, published_at: null },
        ],
      };
      expect(adaptVideos(data)[0].publishedAt).toBeNull();
    });

    it("returns an empty array for an empty results list", () => {
      expect(adaptVideos({ id: 1, results: [] })).toEqual([]);
    });

    it("rejects responses without a valid key (malformed data stays visible)", () => {
      // key is load-bearing: a response missing it must fail validation
      // rather than silently produce a broken video object.
      expect(() =>
        adaptVideos({ id: 1, results: [{ id: "a", site: "YouTube" }] }),
      ).toThrow();
      expect(() => adaptVideos({ results: [] })).toThrow(); // missing id
    });
  });
});