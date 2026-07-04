export const CHICAGO_COORDS = { lat: 41.8781, lon: -87.6298 };

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Distance à vol d'oiseau entre deux coordonnées {lat, lon}, en km.
export function haversineDistanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Point de MAP_PTS le plus proche d'une coordonnée GPS (accrochage au plus
// proche — la carte est stylisée, pas une projection géographique réelle,
// donc pas d'interpolation continue possible sans calibration supplémentaire).
export function nearestMapPoint(coords, points) {
  let best = null;
  let bestDist = Infinity;
  for (const p of points) {
    const d = haversineDistanceKm(coords, { lat: p.lat, lon: p.lon });
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}
