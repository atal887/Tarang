import locations from './indiaFishingLocations.json';

export interface LocationData {
  id: string;
  name: string;
  state: string;
  district: string;
  subDistrict: string;
  fisheriesType: "marine" | "inland";
  waterContext: string;
  region: string;
  latitude: number;
  longitude: number;
}

// Haversine distance formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function resolveFishingLocation(latitude: number, longitude: number): LocationData & { locationName: string } {
  let nearestLoc = locations[0] as unknown as LocationData;
  let minDistance = Infinity;

  // Typecast locations since it is imported as any[]
  const locs = locations as unknown as LocationData[];

  for (const loc of locs) {
    const dist = getDistanceFromLatLonInKm(latitude, longitude, loc.latitude, loc.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestLoc = loc;
    }
  }

  return {
    ...nearestLoc,
    locationName: nearestLoc.name,
  };
}
