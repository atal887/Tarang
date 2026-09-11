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
  user: {
    location: "Kochi",
    vesselType: "Motorized boat",
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
  routeData: {
    distance: "18.4 km",
    estimatedTime: "1h 12m",
    risk: "Low Risk",
    positions: [
      [9.9312, 76.2673], // Kochi
      [9.9100, 76.2000],
      [9.8800, 76.1500],
      [9.8500, 76.1000] // Zone A
    ] as [number, number][]
  },
  mapCoordinates: {
    kochi: [9.9312, 76.2673] as [number, number],
    zoneAlpha: [9.85, 76.10] as [number, number],
    hazardZone: [9.88, 76.14] as [number, number]
  }
};
