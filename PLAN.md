# Gogram — Product Roadmap

Gogram is a movement-first travel and social platform: "Instagram **and** Strava for backpackers." Instead of static photo posts, every piece of content centres on a GPS-traced route that other travellers can follow, plus a community marketplace for housing, house swaps and backpacker work.

The roadmap is split into small, self-contained milestones. Each one ships something usable on its own.

---

## ✅ Milestone 1 — Product surface (done)

The branded, clickable product with realistic stubbed data.

- Landing page: hero, fitness-app vs. Gogram contrast, Movement Engine, feed preview, Community & Marketplace teaser, digital-passport / User Impact explainer.
- Route feed (`/feed`): category, transport-mode and text filters, sorting, empty state, passport sidebar, community-board teaser, floating **Start Route** CTA.
- Route detail (`/routes/:id`): journal hero, four deep-dive tabs (Interactive Map, Travel Journal, Media Reel, Conqueror Reviews), border-crossing cards.
- Simulated **Play & Explore** mode: moving GPS fix, 25 m proximity alerts with haptics, progress console, "Conquered" passport stamp.
- Full design-token system (Kelp, Willow Grove, Whiskey, Tamarillo, Crimson Violet, Dusty Lavender + gradients).
- All data lives in `src/data/fixtures.ts`, shaped like the planned database tables.

## Milestone 2 — Route data model & read APIs

- Netlify Database (Postgres) schema via Drizzle for `users`, `routes`, `waypoints`, matching the spec's enums (`route_category`, `transport_mode`) and columns.
- Store polylines as GeoJSON LineString / waypoint Points (lat/lng `[number, number]` arrays today). Evaluate PostGIS availability on Netlify Database; if unavailable, keep GeoJSON in `jsonb` plus bounding-box columns and compute distances in application code.
- Seed the database with the current fixtures.
- Server functions for `listRoutes(filters, sort)` and `getRoute(id)`; swap the fixture imports in the feed and detail screens.

## Milestone 3 — Traveller accounts

- Netlify Identity sign-up / log-in, profile (handle, home base, countries visited).
- Session-aware header; protect write actions.
- Persist the "current user" passport that is stubbed today.

## Milestone 4 — Reviews, obstacles & detours

- `route_reviews` table (rating, kind: review / obstacle / detour, body).
- Wire the existing Reviews form to a server function; recompute average rating.
- Surface the latest obstacle warning on the route card.

## Milestone 5 — Real "Play & Explore"

- Replace the simulated fix in `src/lib/player.ts` with `navigator.geolocation.watchPosition`.
- Real 25 m geofence against waypoint locations (haversine already in `src/lib/geo.ts`), local notifications + `navigator.vibrate`.
- Persist completions (`route_completions`), increment `completion_count`, award passport badges.
- Swap the SVG map for a real tile map (e.g. MapLibre GL) while keeping the polyline styling tokens.

## Milestone 6 — Record & Drop (route creation)

- Recording screen: velocity-aware breadcrumb sampling, drop-a-pin with title, description, dwell time, pro-tip, local cost and warnings.
- Border-crossing waypoints (from / to / post / hours / notes).
- Publishing pipeline: simplify breadcrumbs → LineString, compute distance, write route + waypoints.
- Media uploads to Netlify Blobs, served through the Image CDN; GPS-tagged reel items.

## Milestone 7 — Social graph & feed ranking

- Follows, likes, saves; "Following" vs "Trending" feeds.
- Nearby routes (distance from the viewer's location / city).
- Creator profile pages with their published and conquered routes.

## Milestone 8 — Community housing board

- `community_posts` (roommate_wanted, room_offered, general_community) with budget range, currency, move-in date and lifestyle tags.
- Browse + filter by city, budget and tags; create / edit own posts.

## Milestone 9 — House swaps

- `house_swaps` listings (property type, offered city/location, target destinations, availability window, verification flag).
- Matching: reciprocal destination + overlapping dates; "matches for you" list.
- Swap request / accept flow and simple messaging.

## Milestone 10 — Backpacker gigs

- `gig_listings` (category, compensation type, hours/week, perks, location, active flag).
- Host dashboard to post and pause gigs; traveller applications.
- Cross-link gigs from route pro-tips (e.g. "trade 4h reception for a bed").

## Milestone 11 — Passport & gamification

- Monthly contextual summaries ("You crossed 3 national borders and completed 4 community routes this month!").
- User Impact = Σ border crossings + Σ km walked + Σ routes conquered, computed from completions.
- Passport screen with country stamps and badges; shareable stat cards.

## Later

- Real-time presence on routes (WebSockets), offline route packs, native mobile clients, moderation tools.
