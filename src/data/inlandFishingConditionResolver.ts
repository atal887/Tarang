import { type SelectedInlandCandidate } from './inlandFishingSelector';
import { resolveFishingLocation } from './locationResolver';
import { getLocationEnvironment, type LocationEnvRecord } from './environmentResolver';

export interface ConditionedInlandCandidate extends SelectedInlandCandidate {
  environment: LocationEnvRecord | null;
  environmentDistanceKm: number | null; // distance from the actual fishing spot to the environmental data node
}

export function resolveInlandFishingConditions(
  candidates: SelectedInlandCandidate[],
  dateTime: Date
): ConditionedInlandCandidate[] {
  const currentMonth = dateTime.getMonth(); // 0-11
  // Use October (10) as fallback for anything outside Sept/Oct for TARANG's snapshot dataset
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  
  return candidates.map(candidate => {
    // Find the nearest base location for environmental data
    const nearestLoc = resolveFishingLocation(candidate.latitude, candidate.longitude);
    
    // Get deterministic environmental data
    const env = getLocationEnvironment(nearestLoc.id, evalMonth);
    
    // Calculate geographic distance between spot and the matched environmental node
    let envDist: number | null = null;
    if (nearestLoc) {
      const R = 6371; 
      const dLat = (nearestLoc.latitude - candidate.latitude) * (Math.PI / 180);
      const dLon = (nearestLoc.longitude - candidate.longitude) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(candidate.latitude * (Math.PI / 180)) * Math.cos(nearestLoc.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      envDist = R * c;
    }
    
    return {
      ...candidate,
      environment: env || null,
      environmentDistanceKm: envDist
    };
  });
}
