import { describe, it, expect } from "vitest";
import { parseFilters } from "@/lib/discover/filters";

function paramsFrom(obj: Record<string, string>): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) p.set(k, v);
  return p;
}

describe("parseFilters", () => {
  it("returns defaults for empty params", () => {
    const filters = parseFilters(new URLSearchParams());
    expect(filters).toEqual({ page: 1 });
  });

  it("parses genre, sort, year, minRating, page", () => {
    const filters = parseFilters(
      paramsFrom({ genre: "28", sort: "popularity.desc", year: "2023", minRating: "8", page: "3" }),
    );
    expect(filters.genre).toBe(28);
    expect(filters.sort).toBe("popularity.desc");
    expect(filters.year).toBe(2023);
    expect(filters.minRating).toBe(8);
    expect(filters.page).toBe(3);
  });

  it("handles invalid page gracefully", () => {
    const filters = parseFilters(paramsFrom({ page: "0" }));
    expect(filters.page).toBe(1);
  });

  it("ignores unknown params", () => {
    const filters = parseFilters(paramsFrom({ foo: "bar" }));
    expect(filters).toEqual({ page: 1 });
  });
});
