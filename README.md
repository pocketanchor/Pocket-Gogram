# Gogram

**Instagram _and_ Strava for backpackers.** Gogram replaces static travel posts with interactive, GPS-traced movement paths: creators record routes and drop pins with pro-tips, and other travellers follow them live, get alerts near each stop, and "conquer" routes to stamp their digital passport. A community marketplace for housing, house swaps and backpacker gigs is on the roadmap.

## What's in this version

- **Landing page** (`/`) — the Gogram story, Movement Engine, feed preview, marketplace teaser and User Impact explainer.
- **Route feed** (`/feed`) — movement-first cards with live map previews, filters, sorting and a passport sidebar.
- **Route detail** (`/routes/:id`) — Interactive Map, Travel Journal, Media Reel and Conqueror Reviews tabs, plus a simulated "Play & Explore" mode with 25 m proximity alerts and a "Conquered" badge.

All content is stubbed in `src/data/fixtures.ts`.

## Tech

- [TanStack Start](https://tanstack.com/start) + React 19, file-based routing
- Tailwind CSS v4 with the Gogram design tokens in `src/styles.css`
- Custom SVG route renderer (`src/components/RouteMap.tsx`) and geo helpers (`src/lib/geo.ts`)
- Netlify hosting, Netlify Image CDN for generated imagery in `public/img`
- Fonts: Bricolage Grotesque, Newsreader, JetBrains Mono

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Roadmap

See [PLAN.md](./PLAN.md). Next up: the route data model on Netlify Database, traveller accounts, persisted reviews, real GPS navigation, route recording, and the housing / swap / gig marketplace.
