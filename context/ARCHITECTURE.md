# SEGERA Architecture

## Diagram
User -> Landing (No Map) -> Click Explore Now -> /explore -> MapLibre GL -> Overpass API + ORS API + Supabase PostGIS -> Gemini Flash (halal + storyteller) -> Render

## Why 100% Free
MapLibre > Mapbox (Mapbox token paid after 50k loads). Overpass public instance free. ORS free 2k/day. Supabase PostGIS free.

## Core Modules
1. **Surau Module**: Overpass query [amenity=place_of_worship][religion=muslim] + [amenity=place_of_worship][building=surau] + [prayer_room=yes] + stesen minyak [amenity=fuel][prayer_room=yes]. Handle indoor.

2. **Mall Indoor Module**: Query level tag. If building=retail + indoor=yes, cluster count as "45 kedai dalam mall X" not list 45 pins overlapping.

3. **Halal Module**: Step 1 check OSM diet:halal=yes. Step 2 Gemini Vision read cert image. Step 3 (advanced) scrape halal.gov.my search + sentiment from Google reviews "dalam proses halal" using HF model mesolitica/malaysian-sentiment free.

4. **Banjir Module**: OSM flood_prone=yes + NASA SRTM elevation + mock JPS polygon. Turf.js intersect with isochrone. Color red.

5. **Motor Module**: ORS profile driving-car for motor (same road). Foot-walking for jalan. Toggle.

Security: Public no-login = high risk. Use Upstash Redis rate limit 10 req/min/IP, Zod validation, DOMPurify, Supabase RLS read-only anon.

## No Auth Decision
No register to reduce friction for public + hackathon judges. Security via rate limit + RLS + no sensitive data exposure.
