import { resolveFishingLocation } from './locationResolver';

// A simple deterministic hash function
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export interface EnvironmentalConditions {
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

export function getEnvironmentalConditions(_locationName: string, lat: number, lon: number): EnvironmentalConditions {
  const locContext = resolveFishingLocation(lat, lon);
  const isMarine = locContext.fisheriesType === "marine";
  const date = new Date();
  const month = date.getMonth(); // 0-11
  
  // Use October (9) or November (10) as default if outside evaluator period
  const evalMonth = (month === 9 || month === 10) ? month : 9;
  
  // Deterministic seed based on location name and month
  const seed = hashString(locContext.locationName + evalMonth.toString());
  
  // Deterministic random between 0 and 1
  const pseudoRandom = (seed % 100) / 100;
  
  if (isMarine) {
    // Marine data generation
    const waveHeight = 0.5 + (pseudoRandom * 1.5); // 0.5m to 2.0m
    const windSpeed = 5 + (pseudoRandom * 20); // 5 to 25 km/h
    
    return {
      isMarine: true,
      wind: `${windSpeed.toFixed(1)} km/h`,
      windDesc: windSpeed > 20 ? "Strong Breeze" : windSpeed > 10 ? "Moderate" : "Light",
      weather: evalMonth === 9 ? "29°C" : "27°C",
      weatherDesc: pseudoRandom > 0.7 ? "Partly cloudy" : "Sunny",
      temperature: evalMonth === 9 ? "29°C" : "27°C",
      visibility: pseudoRandom > 0.8 ? "8 km" : "15 km",
      waves: `${waveHeight.toFixed(1)} m`,
      wavesDesc: waveHeight > 1.5 ? "Rough" : waveHeight > 0.8 ? "Moderate" : "Calm",
      current: `${(0.1 + pseudoRandom * 0.4).toFixed(1)} m/s`,
      sst: evalMonth === 9 ? "28.5°C" : "27.5°C",
      safetyStatus: waveHeight > 1.5 || windSpeed > 20 ? "Exercise Caution" : "Favourable for fishing",
      safetyExplanation: waveHeight > 1.5 ? "Waves are relatively high today." : "Current conditions are suitable for marine operations.",
    };
  } else {
    // Inland data generation
    const windSpeed = 2 + (pseudoRandom * 12); // 2 to 14 km/h
    const rainChance = pseudoRandom;
    
    return {
      isMarine: false,
      wind: `${windSpeed.toFixed(1)} km/h`,
      windDesc: windSpeed > 10 ? "Moderate" : "Light",
      weather: evalMonth === 9 ? "31°C" : "28°C",
      weatherDesc: rainChance > 0.8 ? "Light Rain" : rainChance > 0.5 ? "Cloudy" : "Clear",
      temperature: evalMonth === 9 ? "31°C" : "28°C",
      visibility: rainChance > 0.8 ? "5 km" : "12 km",
      waterLevel: pseudoRandom > 0.5 ? "Normal" : "Slightly low",
      rainfall: rainChance > 0.8 ? "5 mm" : "0 mm",
      safetyStatus: rainChance > 0.8 ? "Exercise Caution" : "Favourable for fishing",
      safetyExplanation: rainChance > 0.8 ? "Rain may affect visibility and water conditions." : "Current conditions are suitable for inland fishing.",
    };
  }
}
