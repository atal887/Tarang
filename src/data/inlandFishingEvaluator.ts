import { type ConditionedInlandCandidate } from './inlandFishingConditionResolver';

export interface EvaluatedInlandCandidate extends ConditionedInlandCandidate {
  riskScore: number | null;
  riskBand: 'SAFE' | 'CAUTION' | 'AVOID' | 'INSUFFICIENT_DATA';
  suitability: string;
  dataQualityFlag: 'COMPLETE' | 'MISSING_RAINFALL';
}

export function evaluateInlandCandidates(
  candidates: ConditionedInlandCandidate[],
  vesselType: string = 'motorized'
): EvaluatedInlandCandidate[] {
  return candidates.map(candidate => {
    const env = candidate.environment;

    if (!env || env.windSpeedKmph === null) {
      return {
        ...candidate,
        riskScore: null,
        riskBand: 'INSUFFICIENT_DATA',
        suitability: 'Insufficient environmental data for accurate inland risk evaluation.',
        dataQualityFlag: 'COMPLETE' // Defaulting to complete here, though it's technically insufficient data
      };
    }


    // Inland risk logic: primarily driven by wind and rainfall.
    // Significant wave height is often inapplicable inland.
    
    // 1. Set Vessel limits for wind (same as marine conventions)
    let vesselWindLimit = 40;
    const vType = vesselType.toLowerCase();
    if (vType.includes('non_motorized') || vType.includes('non-motorized')) {
      vesselWindLimit = 25;
    } else if (vType.includes('mechanized')) {
      vesselWindLimit = 55;
    }

    const windSpeedKmph = env.windSpeedKmph;
    const isRainfallMissing = env.rainfallMm === null;
    const rainfallMm = env.rainfallMm || 0; // default for guardrails if needed

    // 2. Hard guardrails
    // Severe cyclone or heavy rainfall warnings
    const isAvoidHazard = (env.cycloneStatus && env.cycloneStatus.toLowerCase().includes('elevated')) ||
                          (!isRainfallMissing && rainfallMm > 150) || 
                          (env.weatherCondition?.toLowerCase().includes('storm'));

    if (isAvoidHazard) {
      return {
        ...candidate,
        riskScore: 100,
        riskBand: 'AVOID',
        suitability: 'Severe weather hazard present (cyclone, severe storm, or excessive rainfall).',
        dataQualityFlag: isRainfallMissing ? 'MISSING_RAINFALL' : 'COMPLETE'
      };
    }

    // 3. Stress calculations
    // Wind stress
    const windStress = Math.min(1.5, windSpeedKmph / vesselWindLimit);
    
    let baseStress: number;
    if (isRainfallMissing) {
      // Neutral approach: 100% weight to wind if rain is unknown
      baseStress = windStress;
    } else {
      // Rain stress (arbitrary safe limit for fishing = 50mm, max stress at 100mm)
      const rainStress = Math.min(1.5, rainfallMm / 75);
      // Base score based on wind (70%) and rain (30%)
      baseStress = (0.70 * windStress) + (0.30 * rainStress);
    }
    
    const baseScore = Math.min(100, baseStress * 100);
    
    let riskBand: 'SAFE' | 'CAUTION' | 'AVOID' = 'SAFE';
    if (baseScore >= 71) {
      riskBand = 'AVOID';
    } else if (baseScore >= 41) {
      riskBand = 'CAUTION';
    }

    let suitability = 'Conditions are safe for inland fishing operations.';
    if (riskBand === 'CAUTION') {
      suitability = 'Exercise caution. Conditions are approaching limits due to wind or rainfall.';
    } else if (riskBand === 'AVOID') {
      suitability = 'Conditions are unsafe for this vessel type. Avoid operations.';
    }

    return {
      ...candidate,
      riskScore: baseScore,
      riskBand,
      suitability,
      dataQualityFlag: isRainfallMissing ? 'MISSING_RAINFALL' : 'COMPLETE'
    };
  });
}
