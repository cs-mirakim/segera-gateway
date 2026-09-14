/**
 * SEGERA Overpass Module
 * Fast, reliable OpenStreetMap query for Malaysian facilities across ALL states.
 */

export interface LivePoi {
  id: number;
  name: string;
  category: 'surau' | 'makanan' | 'runcit' | 'klinik' | 'transit' | 'banjir';
  lat: number;
  lng: number;
  distanceMeters: number;
  walkMin: number;
  motorMin: number;
  carMin: number;
  details: string;
}

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export async function fetchLiveFacilitiesFromOSM(
  lat: number,
  lng: number,
  radiusMeters = 2200
): Promise<LivePoi[]> {
  // Fast & reliable Overpass node query (instant response anywhere in Malaysia)
  const query = `
[out:json][timeout:10];
(
  // Surau kariah, masjid, surau stesen minyak
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters}, ${lat}, ${lng});
  node["building"="surau"](around:${radiusMeters}, ${lat}, ${lng});
  node["prayer_room"="yes"](around:${radiusMeters}, ${lat}, ${lng});
  node["amenity"="fuel"](around:${radiusMeters}, ${lat}, ${lng});

  // Klinik & Farmasi
  node["amenity"="clinic"](around:${radiusMeters}, ${lat}, ${lng});
  node["amenity"="pharmacy"](around:${radiusMeters}, ${lat}, ${lng});

  // Makanan
  node["amenity"="restaurant"](around:${radiusMeters}, ${lat}, ${lng});
  node["amenity"="fast_food"](around:${radiusMeters}, ${lat}, ${lng});

  // Runcit & Mart
  node["shop"="convenience"](around:${radiusMeters}, ${lat}, ${lng});
  node["shop"="supermarket"](around:${radiusMeters}, ${lat}, ${lng});

  // Transit
  node["highway"="bus_stop"](around:${radiusMeters}, ${lat}, ${lng});
  node["railway"="station"](around:${radiusMeters}, ${lat}, ${lng});
);
out center 40;
`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];

  let rawElements: any[] = [];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'SEGERA-Engine/1.0',
        },
        next: { revalidate: 300 }, // 5 min cache
      });

      if (res.ok) {
        const text = await res.text();
        if (text.startsWith('{')) {
          const data = JSON.parse(text);
          if (data && Array.isArray(data.elements)) {
            rawElements = data.elements;
            break;
          }
        }
      }
    } catch (err) {
      console.warn(`[Overpass] Endpoint ${endpoint} failed, trying alternative...`);
    }
  }

  const results: LivePoi[] = [];
  const seen = new Set<string>();

  for (const el of rawElements) {
    const tags = el.tags || {};
    const itemLat = el.lat || el.center?.lat;
    const itemLng = el.lon || el.center?.lon;

    if (!itemLat || !itemLng) continue;

    let category: LivePoi['category'] = 'runcit';
    let defaultName = 'Kemudahan Tempatan';
    let details = 'Fasiliti awam komuniti';

    if (
      tags.amenity === 'place_of_worship' ||
      tags.building === 'surau' ||
      tags.prayer_room === 'yes'
    ) {
      category = 'surau';
      defaultName = tags.name || (tags.building === 'surau' ? 'Surau Kariah' : 'Masjid / Surau');
      details = 'Ruang solat berjemaah 5 waktu & tempat wuduk';
    } else if (tags.amenity === 'fuel') {
      category = 'surau';
      const brand = tags.brand || tags.operator || tags.name || 'Stesen Minyak';
      defaultName = `${brand} (Fasiliti Surau & Petrol)`;
      details = 'Stesen minyak dengan surau bersih & tandas awam';
    } else if (tags.amenity === 'clinic' || tags.amenity === 'pharmacy') {
      category = 'klinik';
      defaultName = tags.name || (tags.amenity === 'pharmacy' ? 'Farmasi Komuniti' : 'Klinik Kesihatan');
      details = 'Rawatan pesakit luar dan keperluan ubat am';
    } else if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') {
      category = 'makanan';
      defaultName = tags.name || 'Restoran / Kedai Makan';
      details = 'Sajian makanan harian & masakan tempatan';
    } else if (tags.shop === 'convenience' || tags.shop === 'supermarket') {
      category = 'runcit';
      defaultName = tags.name || (tags.shop === 'supermarket' ? 'Pasar Raya' : 'Kedai Runcit / Mart');
      details = 'Keperluan dapur harian dan barangan runcit';
    } else if (tags.highway === 'bus_stop' || tags.railway === 'station') {
      category = 'transit';
      defaultName = tags.name || (tags.railway === 'station' ? 'Stesen Rel Transit' : 'Hentian Bas');
      details = 'Pengangkutan awam ke destinasi utama';
    }

    const finalName = tags.name || tags['name:ms'] || tags['name:en'] || tags.brand || defaultName;

    // Deduplicate
    const key = `${finalName.toLowerCase()}-${Math.round(itemLat * 1000)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const dist = calculateDistanceMeters(lat, lng, itemLat, itemLng);

    const walkMin = Math.max(1, Math.round((dist / 1000 / 4.5) * 60));
    const motorMin = Math.max(1, Math.round((dist / 1000 / 32) * 60));
    const carMin = Math.max(2, Math.round((dist / 1000 / 24) * 60));

    results.push({
      id: el.id,
      name: finalName,
      category,
      lat: itemLat,
      lng: itemLng,
      distanceMeters: dist,
      walkMin,
      motorMin,
      carMin,
      details,
    });
  }

  // Sort by distance nearest first
  results.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return results;
}
