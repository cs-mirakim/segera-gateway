/**
 * SEGERA Security Layer
 * Public no-login engine: Protection against SSRF, abuse, and API leaks.
 */

// Simple in-memory fallback for rate limiting (to be linked with Upstash Redis)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}

/**
 * Validate bounding box coordinates to ensure queries stay inside Malaysia bounds
 * and prevent internal IP / SSRF injection.
 */
export function validateMalaysiaBBox(minLat: number, minLng: number, maxLat: number, maxLng: number): boolean {
  // Approximate Malaysia bounds: Lat 0.8 to 7.5, Lng 99.5 to 119.5
  const isLatValid = minLat >= 0.8 && maxLat <= 7.5 && minLat <= maxLat;
  const isLngValid = minLng >= 99.5 && maxLng <= 119.5 && minLng <= maxLng;
  return isLatValid && isLngValid;
}
