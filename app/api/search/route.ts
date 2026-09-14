import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=my&limit=6&addressdetails=1&q=${encodeURIComponent(
      q.trim()
    )}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SEGERA-Malaysia-Geosearch/1.0 (contact: support@segera.my)',
        'Accept-Language': 'ms,en',
      },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ results: [] });
    }

    const results = data.map((item: any) => {
      // Build clean, concise Malaysian label
      const addr = item.address || {};
      const placeName =
        addr.suburb ||
        addr.neighbourhood ||
        addr.village ||
        addr.town ||
        addr.city ||
        item.name ||
        item.display_name.split(',')[0];

      const district = addr.city || addr.county || addr.district || '';
      const state = addr.state || '';

      const locationLabel = [placeName, district, state]
        .filter(Boolean)
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .join(', ');

      return {
        id: item.place_id,
        label: locationLabel || item.display_name,
        full_name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[Search API] Error:', error);
    return NextResponse.json({ results: [] });
  }
}
