/**
 * Calculates the distance in meters between two geographical points using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export interface LocationVerificationResult {
  isVerified: boolean;
  distanceMeters: number;
  allowedRadius: number;
  userLat?: number;
  userLng?: number;
  errorMessage?: string;
}

/**
 * Checks whether user coordinates are within the venue's radius.
 */
export function verifyVenueLocation(
  userLat: number,
  userLng: number,
  venueLat: number,
  venueLng: number,
  allowedRadiusMeters: number
): LocationVerificationResult {
  const distance = calculateDistanceMeters(userLat, userLng, venueLat, venueLng);
  const isVerified = distance <= allowedRadiusMeters;

  return {
    isVerified,
    distanceMeters: Math.round(distance),
    allowedRadius: allowedRadiusMeters,
    userLat,
    userLng,
  };
}
