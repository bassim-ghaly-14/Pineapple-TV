import { describe, it, expect } from "vitest";
import { cn, formatRuntime, formatDate, formatVote } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy classes and skips falsy", () => {
    expect(cn("a", "b", false, null, undefined, "c")).toBe("a b c");
  });
});

describe("formatRuntime", () => {
  it("formats minutes into hours and minutes", () => {
    expect(formatRuntime(142)).toBe("2h 22m");
    expect(formatRuntime(45)).toBe("45m");
    expect(formatRuntime(null)).toBeNull();
    expect(formatRuntime(0)).toBeNull();
  });
});

describe("formatDate", () => {
  it("formats ISO date strings", () => {
    expect(formatDate("2023-07-15")).toBe("Jul 15, 2023");
    expect(formatDate(null)).toBeNull();
    expect(formatDate("invalid")).toBeNull();
  });
});

describe("formatVote", () => {
  it("formats to one decimal", () => {
    expect(formatVote(7.856)).toBe("7.9");
    expect(formatVote(0)).toBe("0.0");
  });
});
