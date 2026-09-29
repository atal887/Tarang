/**
 * demoAlertDataset.ts
 * Hardcoded Alert Mode demo scenarios for TARANG AI.
 * Displays warning header FIRST, primary hazards, conditions, vessel precautions, and map integration.
 */

export interface DemoAlertScenario {
  id: number;
  matches: (q: string) => boolean;
  title: string;
  locationName: string;
  district: string;
  state: string;
  coords: [number, number];
  alertLevel: 'CAUTION' | 'DANGER' | 'SAFE';
  primaryHazard: string;
  warningHeader: string;
  waveHeight: string;
  windSpeed: string;
  weather: string;
  riskScore: number;
  briefReason: string;
  vesselPrecautions: {
    nonMotorized: string;
    motorized: string;
    mechanized: string;
  };
}

export const DEMO_ALERT_SCENARIOS: DemoAlertScenario[] = [
  // 1. Is it safe to go fishing tomorrow from Mumbai Port?
  {
    id: 1,
    matches: (q: string) => (q.includes("mumbai") && (q.includes("safe") || q.includes("fishing") || q.includes("tomorrow"))) || /mumbai/i.test(q),
    title: "Mumbai Port Marine Safety Alert",
    locationName: "Mumbai Port (Sassoon Dock)",
    district: "Mumbai",
    state: "Maharashtra",
    coords: [18.92, 72.83],
    alertLevel: "CAUTION",
    warningHeader: "⚠️ MODERATE RISK WARNING — EXPOSED SEA CONDITIONS OFFSHORE",
    primaryHazard: "Elevated wave swell (1.8 m) and wind gusts (19 km/h) beyond 5 km offshore.",
    waveHeight: "1.8 m",
    windSpeed: "19 km/h SW",
    weather: "Partly Cloudy with localized swell chop",
    riskScore: 48,
    briefReason: "Monsoon swell produces choppy seas offshore from Mumbai. Small motorized vessels and non-motorized canoes will experience unstable operating conditions.",
    vesselPrecautions: {
      nonMotorized: "⛔ DO NOT VENTURE OFFSHORE. Stay within sheltered harbour waters.",
      motorized: "🟡 EXTREME CAUTION. Limit operations within 5 km of port. Wear lifejackets at all times.",
      mechanized: "🟢 SAFE FOR OPERATION with active VHF radio and life-saving equipment."
    }
  },
  // 2. Are there any dangerous conditions around Kochi Harbour tomorrow?
  {
    id: 2,
    matches: (q: string) => (q.includes("kochi") && (q.includes("dangerous") || q.includes("condition") || q.includes("safe") || q.includes("tomorrow"))) || /kochi/i.test(q),
    title: "Kochi Harbour Marine Safety Assessment",
    locationName: "Kochi Harbour (Thoppumpady)",
    district: "Ernakulam",
    state: "Kerala",
    coords: [9.93, 76.26],
    alertLevel: "SAFE",
    warningHeader: "🟢 SAFE CONDITIONS — LOW MARINE HAZARD AROUND KOCHI HARBOUR",
    primaryHazard: "None. Slight afternoon wind refresh near outer channel entrance.",
    waveHeight: "1.2 m",
    windSpeed: "14 km/h W",
    weather: "Clear / Fair skies with calm sea surface",
    riskScore: 28,
    briefReason: "Sea conditions around Kochi Harbour remain calm tomorrow morning through evening. Wave heights are well within safe operating limits for all vessels.",
    vesselPrecautions: {
      nonMotorized: "🟢 SAFE. Favourable for coastal fishing with standard precautions.",
      motorized: "🟢 SAFE. Excellent sea conditions across all coastal sectors.",
      mechanized: "🟢 SAFE. Normal fishing operations supported."
    }
  }
];

export function findDemoAlertScenario(query: string): DemoAlertScenario | undefined {
  const qClean = query.toLowerCase().trim();
  return DEMO_ALERT_SCENARIOS.find(s => s.matches(qClean));
}
