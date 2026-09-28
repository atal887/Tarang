import { type MarineProductivityProfile } from '../services/marineCandidateEvaluator';

export interface ProductivityFactor {
  score: number; // 0-100
  explanation: string;
}

export interface MarineProductivityEvaluation {
  productivityScore: number; // 0-100
  productivityBand: 'Low' | 'Moderate' | 'High';
  factors: {
    pfz: ProductivityFactor;
    chlorophyll: ProductivityFactor;
    sst: ProductivityFactor;
    currentSpeed: ProductivityFactor;
    mixedLayer: ProductivityFactor;
    d20Depth: ProductivityFactor;
  };
}

export function evaluateMarineProductivity(profile: MarineProductivityProfile | null | undefined): MarineProductivityEvaluation | null {
  if (!profile) return null;
  
  // Ensure we have the required primary fields to perform a meaningful evaluation
  if (profile.pfzPotentialScore === null || profile.chlorophyllMgM3 === null) {
    return null;
  }

  // Normalization Helper (min, max based on audited dataset ranges)
  const normalize = (val: number, min: number, max: number) => {
    if (val < min) return 0;
    if (val > max) return 100;
    return ((val - min) / (max - min)) * 100;
  };

  // 1. PFZ Potential Score (Dataset range: 26 to 78) -> Normalize 20 to 80
  const pfzScore = normalize(profile.pfzPotentialScore, 20, 80);
  const pfzExplanation = `Base potential driven by historical PFZ patterns (score: ${profile.pfzPotentialScore}).`;

  // 2. Chlorophyll (Dataset range: 0.25 to 1.3 mg/m³) -> Normalize 0.2 to 1.5
  const chl = profile.chlorophyllMgM3;
  const chlScore = normalize(chl, 0.2, 1.5);
  const chlExplanation = `Chlorophyll-a concentration (${chl} mg/m³).`;

  // 3. SST (Dataset range: 27.3 to 30.2 °C) -> Normalize 27 to 31
  const sst = profile.seaSurfaceTemperatureC ?? 28.7;
  const sstScore = normalize(sst, 27, 31);
  const sstExplanation = `Sea Surface Temperature (${sst}°C).`;

  // 4. Current Speed (Dataset range: 0.26 to 0.44 m/s) -> Normalize 0.2 to 0.5
  const spd = profile.surfaceCurrentSpeedMs ?? 0.35;
  const spdScore = normalize(spd, 0.2, 0.5);
  const spdExplanation = `Surface Current Speed (${spd} m/s).`;

  // 5. Mixed Layer Depth (Dataset range: 35 to 100 m) -> Normalize 30 to 110
  const mld = profile.mixedLayerDepthM ?? 67;
  const mldScore = normalize(mld, 30, 110);
  const mldExplanation = `Mixed Layer Depth (${mld}m).`;

  // 6. D20 Depth (Dataset range: 73 to 149 m) -> Normalize 70 to 150
  const d20 = profile.d20DepthM ?? 111;
  const d20Score = normalize(d20, 70, 150);
  const d20Explanation = `D20 Isotherm Depth (${d20}m).`;

  // Weights avoiding double-counting (fishingPotential is explicitly ignored)
  const totalScore = (
    pfzScore * 0.40 + 
    chlScore * 0.30 +
    sstScore * 0.10 +
    spdScore * 0.10 +
    mldScore * 0.05 +
    d20Score * 0.05
  );

  const roundedScore = Math.round(totalScore);

  let band: 'Low' | 'Moderate' | 'High' = 'Low';
  if (roundedScore >= 70) band = 'High';
  else if (roundedScore >= 45) band = 'Moderate';

  return {
    productivityScore: roundedScore,
    productivityBand: band,
    factors: {
      pfz: { score: Math.round(pfzScore), explanation: pfzExplanation },
      chlorophyll: { score: Math.round(chlScore), explanation: chlExplanation },
      sst: { score: Math.round(sstScore), explanation: sstExplanation },
      currentSpeed: { score: Math.round(spdScore), explanation: spdExplanation },
      mixedLayer: { score: Math.round(mldScore), explanation: mldExplanation },
      d20Depth: { score: Math.round(d20Score), explanation: d20Explanation }
    }
  };
}
