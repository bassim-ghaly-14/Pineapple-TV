import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/queries/client";
import { ThemeProvider } from "@/lib/theme/provider";
import { PersonalStateProvider } from "@/lib/state/PersonalStateContext";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const FAVICON_URL =
  "https://res.cloudinary.com/paihc5qx/image/upload/v1788695999/Favicon_fyqlpi.png";
const DESCRIPTION =
  "Discover, track, and organize your movie & TV experience. Pineapple TV is a personal media discovery and tracking platform.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Pineapple TV — Movie & TV Discovery and Tracking", template: "%s | Pineapple TV" },
  description: DESCRIPTION,
  applicationName: "Pineapple TV",
  icons: {
    icon: FAVICON_URL,
    shortcut: FAVICON_URL,
    apple: FAVICON_URL,
  },
  keywords: [
    "movie tracker",
    "TV show tracker",
    "watchlist",
    "movie discovery",
    "TV discovery",
    "episode tracking",
  ],
  openGraph: {
    title: { default: "Pineapple TV — Movie & TV Discovery and Tracking", template: "%s | Pineapple TV" },
    description: DESCRIPTION,
    type: "website",
    siteName: "Pineapple TV",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Pineapple TV — Movie & TV Discovery and Tracking",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable}`}
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
