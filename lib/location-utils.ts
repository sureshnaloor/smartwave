/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Filter passes by location within a given radius
 * @param passes Array of passes with location data
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param radiusKm Radius in kilometers (default 20)
 * @returns Filtered passes within radius
 */
export function filterPassesByLocation<T extends { location?: { lat?: number; lng?: number } }>(
    passes: T[],
    userLat: number,
    userLon: number,
    radiusKm: number = 20
): T[] {
    return passes.filter((pass) => {
        if (!pass.location?.lat || !pass.location?.lng) {
            // Include passes without location data
            return true;
        }
        const distance = calculateDistance(userLat, userLon, pass.location.lat, pass.location.lng);
        return distance <= radiusKm;
    });
}
