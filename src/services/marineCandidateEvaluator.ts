import { getNearbyMarineFacilities, type ResolvedMarineFacility } from '../data/marineInfrastructureResolver';
import { evaluateMarineFacilityRisk, type EvaluatedMarineFacility } from '../data/marineRiskResolver';
import { evaluateMarineProductivity, type MarineProductivityEvaluation } from '../data/marineProductivityResolver';

export interface MarineProductivityProfile {
  seaSurfaceTemperatureC: number | null;
  surfaceCurrentSpeedMs: number | null;
  surfaceCurrentDirectionDeg: number | null;
  mixedLayerDepthM: number | null;
  d20DepthM: number | null;
  chlorophyllMgM3: number | null;
  pfzPotentialScore: number | null;
  fishingPotential: string | null;
}

export interface MarineCandidateResult extends EvaluatedMarineFacility {
  fishingPotential: string | null;
  productivityProfile: MarineProductivityProfile | null;
  productivityEvaluation: MarineProductivityEvaluation | null;
}

export function evaluateMarineCandidates(
  query: string, 
  locationId: string, 
  dateTime: Date, 
  vesselType: string,
  simulatedEnv?: Partial<MarineProductivityProfile & { windSpeedKmph: number, significantWaveHeightM: number }>
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

  const candidatesToEvaluate = explicitFacility ? [explicitFacility] : facilities;
  
  // 3. Evaluate each candidate using the existing risk resolver
  const results: MarineCandidateResult[] = candidatesToEvaluate.map(fac => {
    let env = fac.environment ? { ...fac.environment } : undefined;
    
    // Merge simulated values if they exist
    if (env && simulatedEnv) {
      if (simulatedEnv.windSpeedKmph !== undefined) env.windSpeedKmph = simulatedEnv.windSpeedKmph;
      if (simulatedEnv.significantWaveHeightM !== undefined) env.significantWaveHeightM = simulatedEnv.significantWaveHeightM;
      if (simulatedEnv.seaSurfaceTemperatureC !== undefined) env.seaSurfaceTemperatureC = simulatedEnv.seaSurfaceTemperatureC;
      if (simulatedEnv.surfaceCurrentSpeedMs !== undefined) env.surfaceCurrentSpeedMs = simulatedEnv.surfaceCurrentSpeedMs;
      if (simulatedEnv.mixedLayerDepthM !== undefined) env.mixedLayerDepthM = simulatedEnv.mixedLayerDepthM;
      if (simulatedEnv.d20DepthM !== undefined) env.d20DepthM = simulatedEnv.d20DepthM;
      if (simulatedEnv.chlorophyllMgM3 !== undefined) env.chlorophyllMgM3 = simulatedEnv.chlorophyllMgM3;
      if (simulatedEnv.pfzPotentialScore !== undefined) env.pfzPotentialScore = simulatedEnv.pfzPotentialScore;
    }
    
    // We need to pass the cloned/modified env to evaluateMarineFacilityRisk as well, but evaluateMarineFacilityRisk takes fac.
    // So we need to create a shallow copy of fac as well!
    const modifiedFac = { ...fac, environment: env };
    
    const evaluated = evaluateMarineFacilityRisk(modifiedFac, vesselType);
    
    const profile = env ? {
      seaSurfaceTemperatureC: env.seaSurfaceTemperatureC,
      surfaceCurrentSpeedMs: env.surfaceCurrentSpeedMs,
      surfaceCurrentDirectionDeg: env.surfaceCurrentDirectionDeg,
      mixedLayerDepthM: env.mixedLayerDepthM,
      d20DepthM: env.d20DepthM,
      chlorophyllMgM3: env.chlorophyllMgM3,
      pfzPotentialScore: env.pfzPotentialScore,
      fishingPotential: env.fishingPotential
    } : null;
    
    return {
      ...evaluated,
      fishingPotential: env?.fishingPotential || null,
      productivityProfile: profile,
      productivityEvaluation: evaluateMarineProductivity(profile)
    };
  });

  return results;
}

export function selectTopMarineCandidates(candidates: MarineCandidateResult[]): MarineCandidateResult[] {
  // 1. Exclude AVOID and INSUFFICIENT_DATA
  const suitable = candidates.filter(c => c.riskBand === 'SAFE' || c.riskBand === 'CAUTION');

  // Helper for fishing potential rank

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

    // 3rd: Shorter distance is better
    return a.distanceKm - b.distanceKm;
  });

  // 3. Return all suitable candidates for the recommendation engine to rank
  return suitable;
}
