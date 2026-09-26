import inlandSpots from './tarang_inland_fishing_spots_operational_candidates_v5.json';
import locationsData from './indiaFishingLocations.json';

export interface InlandFishingSpot {
  spotId: string;
  spotName: string;
  waterBodyType: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  fisheryStatus: string;
  evidence: string;
  sourceOrganization: string;
  fisherySource: string;
  coordinateSource: string;
  coordinateConfidence: string;
  fishingPotential: string | null;
  fishingPotentialBasis: string;
  evidenceClass: string;
  operationalDiscoveryEligible: boolean;
  operationalUseNote: string;
}

export interface ResolvedInlandCandidate extends InlandFishingSpot {
  distanceKm: number;
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

export interface InlandFishingResult {
  hasNearbyCandidates: boolean;
  candidatesWithinRadius: ResolvedInlandCandidate[];
  nearestOverall: ResolvedInlandCandidate[];
}

export function resolveInlandFishingCandidates(
  options: { locationId?: string; latitude?: number; longitude?: number; maxRadiusKm?: number }
): InlandFishingResult {
  let lat: number | null = null;
  let lon: number | null = null;

  if (options.latitude !== undefined && options.longitude !== undefined) {
    lat = options.latitude;
    lon = options.longitude;
  } else if (options.locationId) {
    const locs = locationsData as any[];
    const loc = locs.find(l => l.id === options.locationId);
    if (loc) {
      lat = loc.latitude;
      lon = loc.longitude;
    }
  }

  if (lat === null || lon === null) {
    return {
      hasNearbyCandidates: false,
      candidatesWithinRadius: [],
      nearestOverall: []
    };
  }

  const maxRadius = options.maxRadiusKm || 100; // default 100km radius
  const spots = inlandSpots as unknown as InlandFishingSpot[];
  const candidates: ResolvedInlandCandidate[] = [];

  for (const spot of spots) {
    if (!spot.operationalDiscoveryEligible) continue; // safety check
    
    const dist = getDistanceFromLatLonInKm(lat, lon, spot.latitude, spot.longitude);
    candidates.push({ ...spot, distanceKm: dist });
  }

  candidates.sort((a, b) => a.distanceKm - b.distanceKm);
  
  const withinRadius = candidates.filter(c => c.distanceKm <= maxRadius);

  return {
    hasNearbyCandidates: withinRadius.length > 0,
    candidatesWithinRadius: withinRadius,
    nearestOverall: candidates.slice(0, 5) // return top 5 overall as fallback
  };
}
