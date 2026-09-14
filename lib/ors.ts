/**
 * SEGERA OpenRouteService (ORS) Module
 * Handles isochrone generation for walking and motor/driving-car profiles.
 */

export interface IsochroneRequest {
  lat: number;
  lng: number;
  profile: 'foot-walking' | 'driving-car';
  rangeSeconds: number[]; // e.g. [600] for 10 minutes
}

export async function fetchIsochrone(req: IsochroneRequest) {
  // Server-side call to ORS API to protect API Key
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    console.warn('[ORS] ORS_API_KEY not configured. Falling back to mock polygon.');
    return null;
  }

  // Implementation will call https://api.openrouteservice.org/v2/isochrones/...
  return null;
}
