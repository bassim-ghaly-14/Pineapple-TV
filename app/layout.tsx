import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { AppShell } from "@/components/layout/AppShell";
import { PersonalStateProvider } from "@/lib/state/PersonalStateContext";
import { ThemeProvider } from "@/lib/theme/provider";
import { QueryProvider } from "@/lib/queries/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const FAVICON_URL =
  "https://res.cloudinary.com/paihc5qx/image/upload/v1788693909/Pineapple_tv_application_icon_ari8mj.png";

const SITE_TITLE = "Pineapple TV — Movie & TV Discovery and Tracking";

const DESCRIPTION =
  "Discover, track, and organize your movie and TV experience with Pineapple TV — a personal media discovery and tracking platform powered by TMDB.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: "%s | Pineapple TV",
  },

  description: DESCRIPTION,

  applicationName: "Pineapple TV",

  keywords: [
    "Pineapple TV",
    "movie tracker",
    "TV show tracker",
    "watchlist",
    "movie discovery",
    "TV discovery",
    "movie tracking",
    "TV tracking",
    "episode tracking",
    "personal media library",
  ],

  icons: {
    icon: FAVICON_URL,
    shortcut: FAVICON_URL,
    apple: FAVICON_URL,
  },

  openGraph: {
    type: "website",
    siteName: "Pineapple TV",
    locale: "en_US",
    url: "/",
    title: SITE_TITLE,
    description: DESCRIPTION,
  },

  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={inter.variable}
      suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <QueryProvider>
          <ThemeProvider>
            <PersonalStateProvider>
              <AppShell>{children}</AppShell>
            </PersonalStateProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
