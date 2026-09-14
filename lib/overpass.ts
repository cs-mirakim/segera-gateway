/**
 * SEGERA Overpass Module
 * Query surau, masjid, petrol stations with surau, and indoor mall POIs
 */

export interface OverpassPoi {
  id: number;
  lat: number;
  lon: number;
  name: string;
  type: 'masjid' | 'surau' | 'petrol_surau' | 'halal_food' | 'retail_indoor';
  indoor?: boolean;
}

export async function querySurauNearby(lat: number, lng: number, radiusMeters = 1500): Promise<OverpassPoi[]> {
  // Overpass QL query template for Malaysia surau & prayer rooms
  // Handles amenity=place_of_worship, building=surau, prayer_room=yes, and petrol stations
  console.log(`[Overpass] Querying around (${lat}, ${lng}) with radius ${radiusMeters}m`);
  
  // Return empty or mock array for initial setup until Overpass live API is called
  return [];
}
