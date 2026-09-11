import kochiImg from '../assets/locations/kochi.jpg';
import mangaloreImg from '../assets/locations/mangalore.jpg';
import veravalImg from '../assets/locations/veraval.jpg';
import chennaiImg from '../assets/locations/chennai.jpg';
import vizagImg from '../assets/locations/visakhapatnam.jpg';
import dighaImg from '../assets/locations/digha.jpg';
import fallbackImg from '../assets/locations/fallback.jpg';

export interface LocationData {
  id: string;
  name: string;
  state: string;
  image: string;
  wind: string;
  windDesc: string;
  weather: string;
  weatherDesc: string;
  waves: string;
  wavesDesc: string;
  safetyStatus: string;
  safetyExplanation: string;
  suggestedQuestions: string[];
}

export const locationData: Record<string, LocationData> = {
  kochi: {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    image: kochiImg,
    wind: "12 km/h",
    windDesc: "Moderate",
    weather: "28°C",
    weatherDesc: "Partly cloudy",
    waves: "0.8 m",
    wavesDesc: "Calm",
    safetyStatus: "Favourable for fishing",
    safetyExplanation: "Current conditions are suitable for your selected boat type.",
    suggestedQuestions: ["Is it safe to fish today?", "Where is the nearest fishing zone?", "What is the safest route?"]
  },
  mangalore: {
    id: "mangalore",
    name: "Mangalore",
    state: "Karnataka",
    image: mangaloreImg,
    wind: "14 km/h",
    windDesc: "Moderate",
    weather: "29°C",
    weatherDesc: "Sunny",
    waves: "1.0 m",
    wavesDesc: "Moderate",
    safetyStatus: "Favourable for fishing",
    safetyExplanation: "Current conditions are suitable for your selected boat type.",
    suggestedQuestions: ["What is the wave height?", "Is it safe to fish tomorrow?", "Where is the nearest fishing zone?"]
  },
  veraval: {
    id: "veraval",
    name: "Veraval",
    state: "Gujarat",
    image: veravalImg,
    wind: "18 km/h",
    windDesc: "Breezy",
    weather: "27°C",
    weatherDesc: "Clear",
    waves: "1.2 m",
    wavesDesc: "Moderate",
    safetyStatus: "Exercise Caution",
    safetyExplanation: "Wind speeds are slightly elevated. Monitor conditions closely.",
    suggestedQuestions: ["Is there any cyclone alert?", "Is it safe to fish today?", "What is the safest route?"]
  },
  chennai: {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    image: chennaiImg,
    wind: "10 km/h",
    windDesc: "Light breeze",
    weather: "31°C",
    weatherDesc: "Sunny",
    waves: "0.6 m",
    wavesDesc: "Calm",
    safetyStatus: "Favourable for fishing",
    safetyExplanation: "Conditions are excellent for all boat types today.",
    suggestedQuestions: ["Where is the nearest fishing zone?", "What is the safest route?", "Is it safe to fish tomorrow?"]
  },
  visakhapatnam: {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    image: vizagImg,
    wind: "16 km/h",
    windDesc: "Moderate",
    weather: "30°C",
    weatherDesc: "Partly cloudy",
    waves: "0.9 m",
    wavesDesc: "Moderate",
    safetyStatus: "Favourable for fishing",
    safetyExplanation: "Current conditions are suitable for your selected boat type.",
    suggestedQuestions: ["What is the safest route?", "Is it safe to fish today?", "Where is the nearest fishing zone?"]
  },
  digha: {
    id: "digha",
    name: "Digha",
    state: "West Bengal",
    image: dighaImg,
    wind: "20 km/h",
    windDesc: "Strong breeze",
    weather: "26°C",
    weatherDesc: "Overcast",
    waves: "1.5 m",
    wavesDesc: "Rough",
    safetyStatus: "Not Recommended",
    safetyExplanation: "Sea conditions are rough. Avoid venturing out.",
    suggestedQuestions: ["Is there any cyclone alert?", "Is it safe to fish tomorrow?", "What is the wave height?"]
  },
  other: {
    id: "other",
    name: "Coastal Area",
    state: "India",
    image: fallbackImg,
    wind: "-- km/h",
    windDesc: "Unavailable",
    weather: "--°C",
    weatherDesc: "Unavailable",
    waves: "-- m",
    wavesDesc: "Unavailable",
    safetyStatus: "Data Unavailable",
    safetyExplanation: "We currently do not have live conditions for this location. Proceed with standard caution.",
    suggestedQuestions: ["Is it safe to fish today?", "What is the safest route?", "Where is the nearest fishing zone?"]
  }
};

export const demoData = {
  availableLocations: ["Kochi", "Mangalore", "Veraval", "Chennai", "Visakhapatnam", "Digha"],
  availableLanguages: ["English", "Hindi", "Malayalam", "Kannada", "Gujarati", "Tamil", "Telugu", "Bengali"],
  // NOTE: demoData.user is only a runtime fallback. The ProfileContext is the single source of truth.
  user: {
    location: "Kochi",
    vesselType: "Motorized Boat",
    language: "English",
    phoneVerified: false
  },
  activeAlerts: [
    {
      id: "cyclone_alert",
      title: "Cyclonic Circulation",
      description: "Squally weather with wind speed 40-45 kmph gusting to 55 kmph is likely along and off Kerala coast.",
    }
  ],
  riskThresholds: {
    safe: { min: 0, max: 40, label: "Safe", color: "safe" },
    caution: { min: 41, max: 70, label: "Caution", color: "caution" },
    danger: { min: 71, max: 100, label: "Danger", color: "danger" },
    low: { min: 0, max: 40, label: "Safe", color: "safe" },
    moderate: { min: 40, max: 70, label: "Caution", color: "caution" },
    high: { min: 70, max: 100, label: "Danger", color: "danger" }
  },
  currentConditions: {
    waveHeight: 1.2,
    windSpeed: 14,
    weather: "Favourable",
    chlorophyll: "Moderate",
    seaCurrent: "Moderate"
  },
  tripAnalysis: {
    day1: { status: "SAFE", score: 28, details: ["Sea conditions are favourable.", "Fishing potential is high.", "Recommended route has low risk."] },
    day2: { status: "SAFE", score: 34, details: ["Sea conditions remain acceptable.", "Fishing potential is very high.", "Recommended route has low risk."] },
    day3: { status: "CAUTION", score: 62, details: ["Sea conditions are deteriorating.", "Fishing potential is moderate.", "Route risk is increased."] },
    overall: {
      status: "CAUTION",
      recommendation: "We recommend a 2-day trip instead of 3 days.",
      explanation: "Day 1 and Day 2 show acceptable safety conditions with good fishing potential. Day 3 has significantly higher risk, so extending the trip is not recommended.",
      bestPlan: "Return by the end of Day 2."
    }
  },
  recommendedZone: {
    name: "Zone A",
    distance: "18 km",
    score: 28,
    status: "Low Risk",
    details: [
      "Current conditions are favourable, with moderate wind and relatively calm sea conditions.",
      "Fishing productivity is high in this area, making it a good balance between safety and fishing potential.",
      "Based on the current conditions and your boat type, this is the recommended zone for you."
    ]
  },
};

// ─── Per-location map configuration (SINGLE SOURCE OF TRUTH for map data) ───
// Real coastal coordinates for all six supported locations.

export interface LocationMapConfig {
  centre: [number, number];
  zoom: number;
  harbour: [number, number];
  zone: [number, number];
  hazard: [number, number];
  restricted: [number, number];
  route: [number, number][];
  zoneLabel: string;
}

export const locationMapData: Record<string, LocationMapConfig> = {
  kochi: {
    centre:     [9.9312,  76.2673],
    zoom: 10.5,
    harbour:    [9.9312,  76.2673],
    zone:       [9.8500,  76.1000],
    hazard:     [9.8800,  76.1400],
    restricted: [9.9000,  76.1200],
    route: [
      [9.9312, 76.2673],
      [9.9100, 76.2000],
      [9.8800, 76.1500],
      [9.8500, 76.1000],
    ],
    zoneLabel: "Zone A",
  },
  mangalore: {
    centre:     [12.8698, 74.8425],
    zoom: 10.5,
    harbour:    [12.8698, 74.8425],
    zone:       [12.7800, 74.6800],
    hazard:     [12.8200, 74.7400],
    restricted: [12.8500, 74.7000],
    route: [
      [12.8698, 74.8425],
      [12.8400, 74.7900],
      [12.8100, 74.7200],
      [12.7800, 74.6800],
    ],
    zoneLabel: "Zone A",
  },
  veraval: {
    centre:     [20.9100, 70.3670],
    zoom: 10.5,
    harbour:    [20.9100, 70.3670],
    zone:       [20.8200, 70.2000],
    hazard:     [20.8700, 70.2800],
    restricted: [20.8400, 70.3200],
    route: [
      [20.9100, 70.3670],
      [20.8800, 70.3100],
      [20.8500, 70.2500],
      [20.8200, 70.2000],
    ],
    zoneLabel: "Zone A",
  },
  chennai: {
    centre:     [13.0827, 80.2707],
    zoom: 10.5,
    harbour:    [13.0827, 80.2707],
    zone:       [13.1600, 80.4200],
    hazard:     [13.1200, 80.3600],
    restricted: [13.0500, 80.3900],
    route: [
      [13.0827, 80.2707],
      [13.1100, 80.3100],
      [13.1400, 80.3700],
      [13.1600, 80.4200],
    ],
    zoneLabel: "Zone A",
  },
  visakhapatnam: {
    centre:     [17.6868, 83.2185],
    zoom: 10.5,
    harbour:    [17.6868, 83.2185],
    zone:       [17.7800, 83.4000],
    hazard:     [17.7300, 83.3200],
    restricted: [17.7000, 83.3700],
    route: [
      [17.6868, 83.2185],
      [17.7100, 83.2800],
      [17.7500, 83.3500],
      [17.7800, 83.4000],
    ],
    zoneLabel: "Zone A",
  },
  digha: {
    centre:     [21.6278, 87.5064],
    zoom: 10.5,
    harbour:    [21.6278, 87.5064],
    zone:       [21.7100, 87.6800],
    hazard:     [21.6700, 87.5900],
    restricted: [21.6400, 87.6400],
    route: [
      [21.6278, 87.5064],
      [21.6500, 87.5600],
      [21.6800, 87.6200],
      [21.7100, 87.6800],
    ],
    zoneLabel: "Zone A",
  },
};

/** Returns the map config for the given city name (case-insensitive). Falls back to Kochi. */
export function getLocationMapConfig(locationName: string): LocationMapConfig {
  const key = locationName.toLowerCase().replace(/\s+/g, "");
  return locationMapData[key] ?? locationMapData["kochi"];
}
