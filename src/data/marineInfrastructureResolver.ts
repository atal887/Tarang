import infrastructureData from './tarang_marine_infrastructure_81.json';
import infrastructureEnvData from './tarang_marine_infrastructure_environment_81x2.json';
import nearbyCandidatesData from './tarang_marine_nearby_candidates.json';
import locationsData from './indiaFishingLocations.json';

export interface MarineFacility {
  facilityId: string;
  name: string;
  facilityType: string;
  state?: string;
  district?: string;
  latitude: number;
  longitude: number;
}

export interface FacilityEnvironment {
  facilityId: string;
  month: number;
  airTemperatureC: number | null;
  weatherCondition: string | null;
  windSpeedKmph: number | null;
  windDirectionDeg: number | null;
  rainfallMm: number | null;
  visibilityKm: number | null;
  significantWaveHeightM: number | null;
  wavePeriodSec: number | null;
  waveDirectionDeg: number | null;
  swellHeightM: number | null;
  swellPeriodSec: number | null;
  seaCondition: string | null;
  seaSurfaceTemperatureC: number | null;
  surfaceCurrentSpeedMs: number | null;
  surfaceCurrentDirectionDeg: number | null;
  mixedLayerDepthM: number | null;
  d20DepthM: number | null;
  chlorophyllMgM3: number | null;
  pfzPotentialScore: number | null;
  fishingPotential: string | null;
  cycloneStatus: string | null;
  cycloneRiskScore: number | null;
  cycloneDistanceKm: number | null;
  cycloneWindKmph: number | null;
  marineWarning: string | null;
  highWaveAlert: boolean;
  waveApplicability?: string;
}

export interface NearbyCandidate {
  locationId: string;
  facilityId: string;
  distanceKm: number;
}

export interface ResolvedMarineFacility {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  environment: FacilityEnvironment | null;
}

export function getNearbyMarineFacilities(locationId: string, month: number): ResolvedMarineFacility[] {
  // 1. Check if the location is inland. If so, return empty list.
  const locs = locationsData as unknown as any[];
  const location = locs.find(l => l.id === locationId);
  if (location && location.fisheriesType === "inland") {
    return [];
  }

  // 2. Find matching records in nearby candidates
  const candidates = (nearbyCandidatesData as unknown as NearbyCandidate[])
    .filter(c => c.locationId === locationId);

  // 3. Resolve metadata and environment
  const results: ResolvedMarineFacility[] = [];
  const facilities = infrastructureData as unknown as MarineFacility[];
  const environments = infrastructureEnvData as unknown as FacilityEnvironment[];

  for (const candidate of candidates) {
    const facility = facilities.find(f => f.facilityId === candidate.facilityId);
    if (!facility) continue;

    const env = environments.find(e => e.facilityId === candidate.facilityId && e.month === month);

    results.push({
      facilityId: facility.facilityId,
      facilityName: facility.name,
      facilityType: facility.facilityType,
      latitude: facility.latitude,
      longitude: facility.longitude,
      distanceKm: candidate.distanceKm,
      environment: env || null,
    });
  }

  // Optional: sort by distance
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  return results;
}
