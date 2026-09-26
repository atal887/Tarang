import type { ResolvedMarineFacility } from './marineInfrastructureResolver.js';

export interface EvaluatedMarineFacility {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  distanceKm: number;
  windSpeedKmph: number | null;
  significantWaveHeightM: number | null;
  riskScore: number | null;
  riskBand: 'SAFE' | 'CAUTION' | 'AVOID' | 'INSUFFICIENT_DATA';
  suitability: string;
}

export function evaluateMarineFacilityRisk(facility: ResolvedMarineFacility, vesselType: string): EvaluatedMarineFacility {
  const env = facility.environment;
  
  if (!env || env.windSpeedKmph === null || env.significantWaveHeightM === null) {
    return {
      facilityId: facility.facilityId,
      facilityName: facility.facilityName,
      facilityType: facility.facilityType,
      distanceKm: facility.distanceKm,
      windSpeedKmph: env?.windSpeedKmph ?? null,
      significantWaveHeightM: env?.significantWaveHeightM ?? null,
      riskScore: null,
      riskBand: 'INSUFFICIENT_DATA',
      suitability: 'Insufficient data for accurate risk evaluation.'
    };
  }

  const windSpeedKmph = env.windSpeedKmph;
  const significantWaveHeightM = env.significantWaveHeightM;
  
  let vesselWindLimit = 40;
  let vesselWaveLimit = 1.4;
  
  const vType = vesselType.toLowerCase();
  if (vType.includes('non_motorized') || vType.includes('non-motorized')) {
    vesselWindLimit = 25;
    vesselWaveLimit = 0.6;
  } else if (vType.includes('mechanized')) {
    vesselWindLimit = 55;
    vesselWaveLimit = 2.4;
  } else {
    // Default to motorized
    vesselWindLimit = 40;
    vesselWaveLimit = 1.4;
  }

  // Check hard guardrails
  const isAvoidHazard = env.highWaveAlert || 
                       env.marineWarning === 'severe' || 
                       (env.cycloneStatus && env.cycloneStatus.toLowerCase().includes('elevated'));

  if (isAvoidHazard) {
    return {
      facilityId: facility.facilityId,
      facilityName: facility.facilityName,
      facilityType: facility.facilityType,
      distanceKm: facility.distanceKm,
      windSpeedKmph,
      significantWaveHeightM,
      riskScore: 100,
      riskBand: 'AVOID',
      suitability: 'Severe marine hazard present (cyclone, high wave alert, or severe warning).'
    };
  }

  // Calculate stress
  const windStress = Math.min(1.5, windSpeedKmph / vesselWindLimit);
  const waveStress = Math.min(1.5, significantWaveHeightM / vesselWaveLimit);
  
  const baseStress = (0.30 * windStress) + (0.40 * waveStress);
  const baseScore = Math.min(100, baseStress * 100);
  
  let riskBand: 'SAFE' | 'CAUTION' | 'AVOID' = 'SAFE';
  if (baseScore >= 71) {
    riskBand = 'AVOID';
  } else if (baseScore >= 41) {
    riskBand = 'CAUTION';
  }

  let suitability = 'Conditions are safe for operations.';
  if (riskBand === 'CAUTION') {
    suitability = 'Exercise caution. Conditions are approaching limits for this vessel type.';
  } else if (riskBand === 'AVOID') {
    suitability = 'Conditions are unsafe for this vessel type. Avoid operations.';
  }

  return {
    facilityId: facility.facilityId,
    facilityName: facility.facilityName,
    facilityType: facility.facilityType,
    distanceKm: facility.distanceKm,
    windSpeedKmph,
    significantWaveHeightM,
    riskScore: baseScore,
    riskBand,
    suitability
  };
}
