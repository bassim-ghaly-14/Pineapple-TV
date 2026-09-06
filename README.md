# 🍍 Pineapple TV

A production-oriented movie & TV discovery and personal tracking platform built with Next.js 14 (App Router), TypeScript, and the TMDB API.

> **Pineapple TV is not a streaming service.** It does not host, distribute, download, or reproduce copyrighted content. All metadata, images, and trailers are provided by [TMDB](https://www.themoviedb.org/) and YouTube. This is a personal media discovery and tracking application.

## Features

- **Discovery**: Trending, Popular, Top Rated, Upcoming, Now Playing, Airing Today — home page + dedicated Movies/TV sections
- **Advanced discover filters**: genre, year, minimum rating, sort — fully URL-persisted for sharing/bookmarking
- **Search**: debounced multi-search with type tabs (All / Movies / TV) and pagination
- **Movie & TV details**: hero backdrop, metadata, cast, key crew, keywords, watch providers, recommendations, similar titles
- **Trailers**: on-demand trailer lookup via a server route, best-trailer selection algorithm, iOS-safe YouTube embed with graceful "no trailer available" and "Watch on YouTube" fallbacks
- **TV episode tracking**: season pages, per-episode watched state, continue-watching deep links
- **Personal tracking**: watchlist, favorites, watched movies, 5-star ratings — persisted locally
- **Dashboard**: stats (movies watched, shows tracked, episodes watched, average rating), continue watching, recent activity
- **Settings**: theme switcher, local data summary, clear-data danger zone
- **SEO**: metadata templates, dynamic per-title metadata with TMDB imagery, canonicals, Open Graph/Twitter cards, sitemap, robots
- **Dark-first cinematic UI** with Pineapple Gold accent, light mode, branded scrollbar, reduced-motion support

## Tech Stack

- **Next.js 14** (App Router, Server Components, Route Handlers, Metadata API)
- **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS** with a custom Pineapple design-token system (CSS variables, dark/light)
- **TanStack Query v5** for client-side server-state caching
- **Zod** for TMDB API boundary validation
- **lucide-react** icons
- **Vitest** + **Testing Library** for unit/component tests

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and add your TMDB API Read Access Token:

```bash
cp .env.example .env.local
```

Get your token at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (API Read Access Token, v4).

```
TMDB_API_TOKEN=your_token_here

# Optional: public-facing app URL used for metadataBase/sitemap/robots
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Commands

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # start production server
npm test           # run unit tests (vitest)
npm run test:watch # tests in watch mode
```

## Architecture

```
app/                        Next.js App Router
  page.tsx                  Home (hero + content rows, server-rendered)
  movies/                   /movies, /movies/discover, /movies/[id]
  tv/                       /tv, /tv/discover, /tv/[id], /tv/[id]/season/[season]
  search/                   /search (client search with Suspense boundary)
  watchlist|favorites|dashboard|settings/
                            personal pages (noindex layouts)
  api/tmdb/trailer          on-demand trailer lookup route
  api/tmdb/search           server-side search proxy
  sitemap.ts / robots.ts    metadata routes
  layout.tsx                root metadata (metadataBase, OG, Twitter, icons, viewport)

components/
  layout/                   AppShell, Header, Sidebar (desktop + mobile drawer),
                            MobileNavigation (bottom bar), Footer
  home/                     Hero (on-demand trailer fetch)
  media/                    MediaCard, MediaRow, MediaGrid, MediaHero,
                            TrailerModal, PersonCard, WatchProviders, Keywords
  movie/ tv/ discover/      detail views, season view/selector, FilterBar
  ui/                       Skeleton, States (error/empty), MediaActions

lib/
  domain/models.ts          normalized domain types (Movie, TVShow, Video, …)
  tmdb/
    client.ts               server-only TMDB fetch (Bearer auth, /3 base)
    endpoints.ts            all TMDB API calls, centralized
    schemas.ts              Zod validation at the API boundary
    adapters.ts             TMDB responses → domain models
    trailer.ts              trailer selection + YouTube embed URL builders
    image-config.ts         centralized TMDB image URL builder
  repositories/             watchlist, favorites, watched, ratings, activity
  storage/                  StorageAdapter abstraction (localStorage)
  state/                    PersonalStateProvider (React context)
  queries/                  TanStack Query provider + keys
  theme/                    dark/light theme provider
  discover/filters.ts       URL ⇄ filter-state mapping
  utils.ts                  formatters, cn helper

tests/                      Vitest unit + component tests
```

### Key design decisions

- **TMDB token is server-only.** All TMDB calls happen in Server Components or Route Handlers; the browser never sees the token.
- **Normalized domain models.** TMDB response shapes never leak into UI components — Zod schemas validate at the boundary and adapters convert to domain types.
- **Repository pattern.** Personal state flows through repositories over a replaceable StorageAdapter, so persistence could later move server-side without UI changes.
- **On-demand trailers.** The hero fetches its trailer only when the user asks for it, keeping the home page LCP fast.
- **Shared trailer selection.** `lib/tmdb/trailer.ts` is the single source of truth for picking the best playable YouTube trailer and building embed/watch URLs — used by both the API route and detail pages.

## Trailer System

Trailer selection (`pickTrailer`) filters to YouTube videos, prefers Trailers over Teasers, ranks official before unofficial, and breaks ties by newest publish date. If TMDB has no usable YouTube trailer, the API returns `key: null` and the UI communicates that honestly ("No trailer is currently available") — fake video IDs are never generated.

The embed URL is `https://www.youtube.com/embed/<key>?playsinline=1&rel=0` — no forced autoplay; playback starts from the user's own click. `playsinline` keeps playback inline on iOS Safari, and the modal always offers a "Watch on YouTube" escape hatch plus an in-player fallback if the embed cannot load.

## Data Persistence

All personal data (watchlist, favorites, watched movies, ratings, TV progress, activity) is stored locally in the browser via repositories backed by `localStorage`. The Settings page exposes a clear-all action. Nothing is sent to a server.

## SEO

- Root metadata: `metadataBase`, title template (`%s | Pineapple TV`), description, keywords, robots, Open Graph, Twitter cards
- Dynamic metadata on movie/TV detail pages: title with year, overview-derived description, canonical URL, `video.movie` / `video.tv_show` OG types, and TMDB backdrop/poster as OG/Twitter images
- `app/sitemap.ts` lists the public indexable routes; `app/robots.ts` allows all crawlers except `/api/`
- Personal pages (watchlist, favorites, dashboard, settings) are marked `noindex`

## Accessibility & Responsive Design

- Semantic HTML (`nav`, `section` with `aria-labelledby`, `role="dialog"` modals), keyboard Escape/backdrop close, focus moved into the trailer dialog, visible focus rings, `aria-label`s on icon-only buttons, reduced-motion support
- Fluid grid layouts (`min-w-0`, aspect-ratio posters), fixed-width cards only inside horizontal carousels, a 5-column fixed bottom navigation on mobile, compact mobile header with a search entry point, and a branded thin scrollbar (WebKit + Firefox)

## Testing

```bash
npm test
```

Vitest covers:

- **TMDB adapters** — paginated media, credits, recommendations, edge cases
- **Trailer selection** — YouTube filtering, official/newest preference, teaser fallback, null when nothing usable, embed URL shape (playsinline, no autoplay)
- **TrailerModal component** — no iframe without a key, correct embed URL, no forced autoplay, always-available "Watch on YouTube", Escape-to-close
- **Repositories, discover filters, utils**

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Attribution is displayed in the footer of the application.

## License

Personal portfolio project.
