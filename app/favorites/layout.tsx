import type { Metadata } from "next";

// Personal, per-browser pages — keep them out of search indexes.
export const metadata: Metadata = {
  title: "favorites",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
