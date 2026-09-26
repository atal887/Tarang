import { resolveFishingLocation } from './locationResolver';
import locationEnvData from './tarang_location_environment_7935x2.json';

export interface LocationEnvRecord {
  locationId: string;
  name: string;
  stateCode: string;
  districtCode: string;
  fisheriesType: string;
  latitude: number;
  longitude: number;
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
  dataType: string;
  modelBasis: string;
  waveApplicability: string;
}

export interface EnvironmentalConditions extends Partial<LocationEnvRecord> {
  isMarine: boolean;
  wind: string;
  windDesc: string;
  weather: string;
  weatherDesc: string;
  temperature: string;
  visibility: string;
  safetyStatus: string;
  safetyExplanation: string;
  // Marine only
  waves?: string;
  wavesDesc?: string;
  current?: string;
  sst?: string;
  // Inland only
  waterLevel?: string;
  rainfall?: string;
}

export function getLocationEnvironment(locationId: string, month: number): LocationEnvRecord | null {
  const records = locationEnvData as unknown as LocationEnvRecord[];
  const match = records.find(r => r.locationId === locationId && r.month === month);
  return match || null;
}

export function getEnvironmentalConditions(_locationName: string, lat: number, lon: number): EnvironmentalConditions | null {
  const locContext = resolveFishingLocation(lat, lon);
  const date = new Date();
  const currentMonth = date.getMonth(); // 0-11
  
  // JSON uses 10 (Oct) and 11 (Nov)
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  
  const envData = getLocationEnvironment(locContext.id, evalMonth);

  if (!envData) {
    return null;
  }

  const isMarine = envData.waveApplicability !== "not_applicable_inland";
  
  const windSpeed = envData.windSpeedKmph ?? 0;
  const windDesc = windSpeed > 20 ? "Strong Breeze" : windSpeed > 10 ? "Moderate" : "Light";
  
  let safetyStatus = "Favourable for fishing";
  let safetyExplanation = "Current conditions are suitable.";
  
  if (isMarine) {
    const waveHeight = envData.significantWaveHeightM ?? 0;
    if (envData.highWaveAlert || envData.cycloneStatus === "elevated" || waveHeight > 1.5 || windSpeed > 20) {
      safetyStatus = "Exercise Caution";
      safetyExplanation = envData.highWaveAlert ? "High wave alert is active." : 
        envData.cycloneStatus === "elevated" ? "Elevated cyclone risk." : 
        waveHeight > 1.5 ? "Waves are relatively high today." : 
        "Strong winds present.";
    } else {
      safetyExplanation = "Current conditions are suitable for marine operations.";
    }
  } else {
    const rain = envData.rainfallMm ?? 0;
    if (rain > 10) {
      safetyStatus = "Exercise Caution";
      safetyExplanation = "Heavy rain may affect visibility and water conditions.";
    } else {
      safetyExplanation = "Current conditions are suitable for inland fishing.";
    }
  }

  const baseConditions: EnvironmentalConditions = {
    isMarine,
    wind: `${windSpeed.toFixed(1)} km/h`,
    windDesc,
    weather: `${envData.airTemperatureC ?? 0}°C`,
    weatherDesc: (envData.weatherCondition || "Clear").replace(/_/g, " "),
    temperature: `${envData.airTemperatureC ?? 0}°C`,
    visibility: `${envData.visibilityKm ?? 0} km`,
    safetyStatus,
    safetyExplanation,
    ...envData
  };

  if (isMarine) {
    baseConditions.waves = envData.significantWaveHeightM != null ? `${envData.significantWaveHeightM} m` : undefined;
    baseConditions.wavesDesc = envData.seaCondition ? envData.seaCondition.replace(/_/g, " ") : undefined;
    baseConditions.current = envData.surfaceCurrentSpeedMs != null ? `${envData.surfaceCurrentSpeedMs} m/s` : undefined;
    baseConditions.sst = envData.seaSurfaceTemperatureC != null ? `${envData.seaSurfaceTemperatureC}°C` : undefined;
  } else {
    baseConditions.waterLevel = "Normal";
    baseConditions.rainfall = envData.rainfallMm != null ? `${envData.rainfallMm} mm` : "0 mm";
  }

  return baseConditions;
}
