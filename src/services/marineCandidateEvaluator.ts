import { getNearbyMarineFacilities, type ResolvedMarineFacility } from '../data/marineInfrastructureResolver';
import { evaluateMarineFacilityRisk, type EvaluatedMarineFacility } from '../data/marineRiskResolver';

export interface MarineCandidateResult extends EvaluatedMarineFacility {
  fishingPotential: string | null;
}

export function evaluateMarineCandidates(
  query: string, 
  locationId: string, 
  dateTime: Date, 
  vesselType: string
): MarineCandidateResult[] {
  const currentMonth = dateTime.getMonth(); // 0-11
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  
  // 1. Get all nearby facilities
  const facilities = getNearbyMarineFacilities(locationId, evalMonth);
  
  if (facilities.length === 0) {
    return []; // Inland or no facilities
  }

  // 2. Check if the query specifically mentions a facility name
  const queryLower = query.toLowerCase();
  let explicitFacility: ResolvedMarineFacility | null = null;
  
  // Find the base location to avoid matching it as a facility (e.g. "Mumbai" vs "Mumbai Port")

  for (const fac of facilities) {
    // Strip common boilerplates from facility names to match against query
    const normalizedName = fac.facilityName.toLowerCase()
      .replace(/modernisation of |development of |construction of fisheries |construction of |fishing harbour |fishing harbour| port|at |revised|\(|\)/g, '')
      .trim();
      
    // Exclude if the normalized name is just the query's target city itself, to avoid false positives (like 'mumbai port' matching 'mumbai')
    // We want to match specific facilities like 'sassoon dock'
    if (normalizedName.length > 3 && queryLower.includes(normalizedName)) {
      // If the query is strictly equal to the normalized name, or it's a specific facility
      // Let's check if the query is just the location name. E.g. "fishing in mumbai" -> normalizedName="mumbai"
      // If normalized name is found, and it's not a generic word
      if (normalizedName === "mumbai" || normalizedName === "chennai") continue;
      
      explicitFacility = fac;
      break;
    }
  }

  // If a specific facility is mentioned, only evaluate that one
  const candidatesToEvaluate = explicitFacility ? [explicitFacility] : facilities;

  // 3. Evaluate each candidate using the existing risk resolver
  const results: MarineCandidateResult[] = candidatesToEvaluate.map(fac => {
    const evaluated = evaluateMarineFacilityRisk(fac, vesselType);
    
    return {
      ...evaluated,
      fishingPotential: fac.environment?.fishingPotential || null
    };
  });

  return results;
}

export function selectTopMarineCandidates(candidates: MarineCandidateResult[]): MarineCandidateResult[] {
  // 1. Exclude AVOID and INSUFFICIENT_DATA
  const suitable = candidates.filter(c => c.riskBand === 'SAFE' || c.riskBand === 'CAUTION');

  // Helper for fishing potential rank
  const getPfzRank = (pfz: string | null) => {
    if (pfz === 'high') return 3;
    if (pfz === 'moderate') return 2;
    if (pfz === 'low') return 1;
    return 0;
  };

  // Helper for risk band rank
  const getBandRank = (band: string) => {
    if (band === 'SAFE') return 2;
    if (band === 'CAUTION') return 1;
    return 0;
  };

  // 2. Sort candidates
  suitable.sort((a, b) => {
    // 1st: SAFE over CAUTION (Higher band rank is better)
    const bandDiff = getBandRank(b.riskBand) - getBandRank(a.riskBand);
    if (bandDiff !== 0) return bandDiff;

    // 2nd: Lower risk score is better
    const scoreA = a.riskScore ?? 0;
    const scoreB = b.riskScore ?? 0;
    const scoreDiff = scoreA - scoreB;
    if (Math.abs(scoreDiff) > 0.01) return scoreDiff; // avoid floating point equality issues

    // 3rd: Higher fishing potential is better
    const pfzDiff = getPfzRank(b.fishingPotential) - getPfzRank(a.fishingPotential);
    if (pfzDiff !== 0) return pfzDiff;

    // 4th: Shorter distance is better
    return a.distanceKm - b.distanceKm;
  });

  // 3. Return top 3 (or fewer if not enough suitable)
  return suitable.slice(0, 3);
}
