# Gogram — agent guide

Gogram is a movement-first travel & social platform ("Instagram and Strava for backpackers"). **Read `PLAN.md` first** — it is the roadmap. Milestone 1 (the product surface with stubbed data) is complete; continue from Milestone 2.

## Architecture

TanStack Start + React 19, file routes, Tailwind v4, deployed on Netlify (`@netlify/vite-plugin-tanstack-start`). No backend yet.

- `src/routes/__root.tsx` — HTML shell, site metadata, Google Fonts links.
- `src/routes/index.tsx` — marketing landing page.
- `src/routes/feed.tsx` — route feed with client-side filters/sort, passport card, community teaser, floating Start Route CTA.
- `src/routes/routes.$routeId.tsx` — route detail. Search params: `tab` (`map|journal|reel|reviews`, default map) and `play` (auto-starts the simulated run). Loader throws `notFound()` for unknown IDs.
- `src/components/RouteMap.tsx` — SVG map renderer: projects lat/lng into a viewBox, draws polyline, numbered pins (border-crossing pins in Tamarillo with ⇄), progress trail and live position.
- `src/components/RouteCard.tsx` — feed card (header, map preview, stats, tab links).
- `src/lib/geo.ts` — haversine, path length, interpolation, deterministic breadcrumb generator, projector, formatters.
- `src/lib/player.ts` — `useRoutePlayer`: simulated GPS along the polyline, 25 m geofence arrivals, completion state. Designed to be swapped for `navigator.geolocation` (Milestone 5).
- `src/lib/img.ts` — `img(name, width)` builds Netlify Image CDN URLs for `public/img/<name>.png`.
- `src/data/fixtures.ts` — **all stub data**. Types mirror the spec's `routes` / `waypoints` / `users` tables (camelCase). Polylines are generated from waypoints via `breadcrumbs()`, and distance is computed from them. Replace these exports with DB-backed server functions in Milestone 2 without changing component props.

## Conventions

- Coordinates are always `[lat, lng]` (WGS84).
- Use the design tokens: Tailwind colours `kelp`, `willow`, `whiskey`, `tamarillo`, `crimson`, `lavender`, `paper`, `paper-deep`, `ink`; CSS vars `--bg-navigation`, `--brand-cta-urgent`, `--map-polyline-active`; classes `bg-cinematic`, `bg-journal-hero`, `topo`, `topo-dark`, `grain`, `rise`, `draw-path`.
- Tamarillo is reserved for the Start Route CTA, border crossings and alerts. Whiskey is for pins, badges and stars.
- Fonts: `font-display` (Bricolage Grotesque, default), `font-serif` (Newsreader, journal/editorial copy), `font-mono` (JetBrains Mono, stats/coords/labels).
- Generated images live in `public/img`; always reference them through `img()` rather than the raw PNG.
- Browser APIs (vibrate, scrollIntoView) only inside effects/handlers.

## Non-obvious decisions

- The map is a custom SVG rather than a tile library so previews stay light and render during SSR; Milestone 5 introduces a real map for navigation.
- Reviews posted in the UI are held in component state only until Milestone 4.
- "Community" and "Passport" nav items are intentionally shown as "soon".
- Persistence must use Netlify platform primitives (Netlify Database for records, Netlify Blobs for media).
