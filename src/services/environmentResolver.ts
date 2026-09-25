import baselineData from '../data/environmentalBaseline.json';

export interface EnvironmentalSource {
  organization: string;
  dataset: string;
  accessMethod: string;
  url: string;
  sourcePeriod: string;
  aggregation: string;
  method: string;
}

export interface EnvironmentalProfile {
  infrastructureId: string;
  month: number;
  windSpeedKmph: number | null;
  windDirectionDeg: number | null;
  significantWaveHeightM: number | null;
  wavePeriodSec: number | null;
  swellHeightM: number | null;
  visibilityKm: number | null;
  rainfallCategory: string | null;
  seaCondition: string | null;
  dataType: "historical_reanalysis_monthly_baseline" | "seasonal_demo_baseline";
  source: EnvironmentalSource;
}

export function getEnvironmentalProfile(infrastructureId: string, month: number): EnvironmentalProfile | null {
  // Enforce validation for demo months (October/November)
  if (month !== 10 && month !== 11) {
    return null;
  }

  const profiles = baselineData as EnvironmentalProfile[];
  
  const match = profiles.find(p => p.infrastructureId === infrastructureId && p.month === month);
  
  return match || null;
}
