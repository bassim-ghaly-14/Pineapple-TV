// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TrailerModal } from "@/components/media/TrailerModal";

afterEach(() => {
  cleanup();
});

describe("TrailerModal", () => {
  it("renders nothing when there is no trailer key", () => {
    const { container } = render(
      <TrailerModal videoKey={null} title="Test" onClose={() => {}} />,
    );
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("renders a valid YouTube embed without forced autoplay", () => {
    render(<TrailerModal videoKey="om5Un9X720M" title="Test Movie" onClose={() => {}} />);
    const iframe = screen.getByTitle("Test Movie trailer");
    expect(iframe).not.toBeNull();
    const src = iframe.getAttribute("src") ?? "";
    expect(src).toContain("https://www.youtube.com/embed/om5Un9X720M?playsinline=1&rel=0");
    expect(src).toContain(`origin=${encodeURIComponent(window.location.origin)}`);
    expect(src).not.toContain("autoplay=1");
    expect(iframe.getAttribute("allowfullscreen")).not.toBeNull();
  });

  it("always offers a Watch on YouTube action", () => {
    render(<TrailerModal videoKey="om5Un9X720M" title="Test Movie" onClose={() => {}} />);
    expect(
      screen.getByRole("link", { name: /watch on youtube/i }).getAttribute("href"),
    ).toBe("https://www.youtube.com/watch?v=om5Un9X720M");
  });

  it("closes on Escape", () => {
    let closed = false;
    render(
      <TrailerModal videoKey="abc" title="T" onClose={() => (closed = true)} />,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closed).toBe(true);
  });
});