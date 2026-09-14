/**
 * SEGERA Overpass Module
 * Real-time OpenStreetMap query for Malaysian facilities:
 * - Surau kariah, masjid, stesen minyak bersurau
 * - Klinik & farmasi
 * - Kedai makan & restoran
 * - Mart & pasar runcit
 * - Transit bas & rel
 * - Alur parit & longkang utama
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
  const R = 6371e3; // Earth radius in meters
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
  radiusMeters = 2500
): Promise<LivePoi[]> {
  // Overpass QL query covering Malaysian local amenities
  const query = `
[out:json][timeout:15];
(
  // Surau & Masjid
  nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["building"="surau"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["prayer_room"="yes"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["amenity"="fuel"](around:${radiusMeters}, ${lat}, ${lng});

  // Klinik & Farmasi
  nwr["amenity"="clinic"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["amenity"="pharmacy"](around:${radiusMeters}, ${lat}, ${lng});

  // Makanan
  nwr["amenity"="restaurant"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["amenity"="fast_food"](around:${radiusMeters}, ${lat}, ${lng});

  // Runcit & Mart
  nwr["shop"="convenience"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["shop"="supermarket"](around:${radiusMeters}, ${lat}, ${lng});

  // Transit
  nwr["highway"="bus_stop"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["railway"="station"](around:${radiusMeters}, ${lat}, ${lng});

  // Parit & Saliran Banjir
  nwr["waterway"="drain"](around:${radiusMeters}, ${lat}, ${lng});
  nwr["waterway"="canal"](around:${radiusMeters}, ${lat}, ${lng});
);
out center 60;
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
          'User-Agent': 'SEGERA-Malaysia-Engine/1.0',
        },
        next: { revalidate: 300 }, // Cache 5 min
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.elements)) {
          rawElements = data.elements;
          break;
        }
      }
    } catch (err) {
      console.warn(`[Overpass] Failed fetch on ${endpoint}, trying next...`);
    }
  }

  const results: LivePoi[] = [];
  const seenNames = new Set<string>();

  for (const el of rawElements) {
    const tags = el.tags || {};
    const itemLat = el.lat || el.center?.lat;
    const itemLng = el.lon || el.center?.lon;

    if (!itemLat || !itemLng) continue;

    let category: LivePoi['category'] = 'runcit';
    let defaultName = 'Kemudahan Tempatan';
    let details = 'Fasiliti awam berdekatan';

    if (
      tags.amenity === 'place_of_worship' ||
      tags.building === 'surau' ||
      tags.prayer_room === 'yes'
    ) {
      category = 'surau';
      defaultName = tags.building === 'surau' ? 'Surau Kariah' : 'Masjid / Surau';
      details = 'Ruang solat berjemaah 5 waktu & kemudahan wuduk';
    } else if (tags.amenity === 'fuel') {
      category = 'surau';
      const brand = tags.brand || tags.operator || 'Stesen Minyak';
      defaultName = `${brand} (Fasiliti Surau & Petrol)`;
      details = 'Stesen minyak dengan kemudahan surau & tandas';
    } else if (tags.amenity === 'clinic' || tags.amenity === 'pharmacy') {
      category = 'klinik';
      defaultName = tags.amenity === 'pharmacy' ? 'Farmasi Komuniti' : 'Klinik Kesihatan';
      details = 'Rawatan pesakit luar dan bekalan ubat am';
    } else if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') {
      category = 'makanan';
      defaultName = 'Restoran / Kedai Makan';
      details = 'Pilihan makanan tempatan & sajian harian';
    } else if (tags.shop === 'convenience' || tags.shop === 'supermarket') {
      category = 'runcit';
      defaultName = tags.shop === 'supermarket' ? 'Pasar Raya' : 'Kedai Runcit / Mart';
      details = 'Barangan runcit harian dan keperluan dapur';
    } else if (tags.highway === 'bus_stop' || tags.railway === 'station') {
      category = 'transit';
      defaultName = tags.railway === 'station' ? 'Stesen Rel Transit' : 'Hentian Bas';
      details = 'Pengangkutan awam ke destinasi utama';
    } else if (tags.waterway === 'drain' || tags.waterway === 'canal') {
      category = 'banjir';
      defaultName = 'Alur Saliran / Parit Monsun';
      details = 'Laluan pelepasan air hujan: Berwaspada jika hujan lebat berterusan';
    }

    const finalName = tags.name || tags['name:ms'] || tags['name:en'] || tags.brand || defaultName;

    // Filter duplicates with same name and location
    const dedupeKey = `${finalName}-${Math.round(itemLat * 1000)}-${Math.round(itemLng * 1000)}`;
    if (seenNames.has(dedupeKey)) continue;
    seenNames.add(dedupeKey);

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

  // Sort by distance ascending
  results.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return results;
}
