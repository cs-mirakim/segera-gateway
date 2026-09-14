<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md - For Antigravity Agent

You are building SEGERA - 10-Minute City Malaysia-First.

Tech: Next.js App Router TS, shadcn/ui, MapLibre GL JS (NOT Mapbox), Supabase, Gemini Flash, Overpass, ORS.

Rules:
1. NEVER use Mapbox GL. Use maplibre-gl only.
2. Landing page app/(landing)/page.tsx MUST NOT show map. Show About + Comparison Table + Explore Now button.
3. Comparison table competitors must be REAL active systems: Walk Score, TravelTime, Esri ArcGIS Urban, openrouteservice, 15MinCity (15mincity.com), Google Maps Nearby.
4. Apply antislop-ui, antislop-copywriting, design-taste-frontend rules. Read DESIGN.md.
5. For any OSM query, handle surau in petrol station and indoor mall shops.
6. Public no login. Implement security.ts with rate limit.

Before coding map, build landing dummy with mock data first.
