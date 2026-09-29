/**
 * demoDigitalTwinDataset.ts
 * Hardcoded Digital Twin Mode demo scenarios for TARANG AI.
 * Contains BEFORE -> CHANGED -> AFTER simulation results, combined factor effects, and multi-chart payloads.
 */

export interface DemoDigitalTwinScenario {
  id: number;
  matches: (q: string) => boolean;
  title: string;
  locationName: string;
  district: string;
  state: string;
  coords: [number, number];
  before: {
    waveHeight: string;
    windSpeed: string;
    sst: string;
    riskScore: number;
    riskBand: string;
  };
  changed: {
    paramName: string;
    changeText: string;
    description: string;
  };
  after: {
    waveHeight: string;
    windSpeed: string;
    sst: string;
    riskScore: number;
    riskBand: string;
  };
  affectedFactors: string[];
  boatSuitability: {
    nonMotorized: { before: string; after: string; status: 'PROHIBITED' | 'CAUTION' | 'SAFE' };
    motorized: { before: string; after: string; status: 'PROHIBITED' | 'CAUTION' | 'SAFE' };
    mechanized: { before: string; after: string; status: 'PROHIBITED' | 'CAUTION' | 'SAFE' };
  };
  fishingSuitabilityChange: string;
  combinedEffectDetails?: {
    waveDeltaRisk: number;
    windDeltaRisk: number;
    sstDeltaRisk: number;
    totalRiskShift: number;
    explanation: string;
  };
  chartData: any;
}

export const DEMO_DIGITAL_TWIN_SCENARIOS: DemoDigitalTwinScenario[] = [
  // 1. What happens if I increase the wave height from 1.2 m to 2.0 m at Kochi Harbour?
  {
    id: 1,
    matches: (q: string) => (q.includes("kochi") && q.includes("wave") && (q.includes("2.0") || q.includes("increase")) && !q.includes("sst")),
    title: "Digital Twin Simulation — Wave Height Spike (+0.8 m) at Kochi Harbour",
    locationName: "Kochi Harbour (Thoppumpady)",
    district: "Ernakulam",
    state: "Kerala",
    coords: [9.93, 76.26],
    before: { waveHeight: "1.2 m", windSpeed: "14 km/h", sst: "29.1°C", riskScore: 28, riskBand: "SAFE" },
    changed: { paramName: "Wave Height", changeText: "1.2 m → 2.0 m (+0.8 m)", description: "Simulated wave swell increase of +0.8m over baseline conditions." },
    after: { waveHeight: "2.0 m", windSpeed: "14 km/h", sst: "29.1°C", riskScore: 58, riskBand: "HIGH RISK / CAUTION" },
    affectedFactors: ["Significant Wave Height (+66%)", "Operational Risk Score (+30 pts)", "Small Craft Stability (-60%)", "Fishing Gear Handling (-35%)"],
    boatSuitability: {
      nonMotorized: { before: "🟢 SAFE", after: "⛔ PROHIBITED — High risk of capsizing in 2.0m waves", status: "PROHIBITED" },
      motorized: { before: "🟢 SAFE", after: "🟡 EXTREME CAUTION — Restricted within 3 km of shore", status: "CAUTION" },
      mechanized: { before: "🟢 SAFE", after: "🟢 SAFE — Manageable for >12m trawlers", status: "SAFE" }
    },
    fishingSuitabilityChange: "Overall fishing suitability drops by 35%. Rough surface swell makes net casting difficult and dangerous for small craft.",
    chartData: {
      comparisonBar: [
        { metric: "Wave Height (m)", Baseline: 1.2, Simulated: 2.0 },
        { metric: "Wind Speed (km/h)", Baseline: 14, Simulated: 14 },
        { metric: "Risk Score (/100)", Baseline: 28, Simulated: 58 }
      ],
      vesselLimits: [
        { vessel: "Non-Motorized (Canoe)", Limit: 0.6, Baseline: 1.2, Simulated: 2.0 },
        { vessel: "Motorized (<12m)", Limit: 1.4, Baseline: 1.2, Simulated: 2.0 },
        { vessel: "Mechanized (>12m)", Limit: 2.4, Baseline: 1.2, Simulated: 2.0 }
      ],
      productivityImpact: [
        { factor: "Gear Handling", Baseline: 85, Simulated: 45 },
        { factor: "Vessel Stability", Baseline: 90, Simulated: 35 },
        { factor: "Biological Potential", Baseline: 75, Simulated: 75 },
        { factor: "Overall Yield Index", Baseline: 82, Simulated: 52 }
      ]
    }
  },
  // 2. What happens if the wind speed increases from 14 km/h to 28 km/h at Mumbai Port?
  {
    id: 2,
    matches: (q: string) => (q.includes("mumbai") && q.includes("wind") && (q.includes("28") || q.includes("increase"))),
    title: "Digital Twin Simulation — Wind Speed Surge (+14 km/h) at Mumbai Port",
    locationName: "Mumbai Port (Sassoon Dock)",
    district: "Mumbai",
    state: "Maharashtra",
    coords: [18.92, 72.83],
    before: { waveHeight: "1.8 m", windSpeed: "14 km/h", sst: "28.4°C", riskScore: 38, riskBand: "SAFE / CAUTION" },
    changed: { paramName: "Wind Speed", changeText: "14 km/h → 28 km/h (+14 km/h)", description: "Simulated offshore wind speed doubling from gentle breeze to fresh gale force." },
    after: { waveHeight: "2.4 m", windSpeed: "28 km/h", sst: "28.4°C", riskScore: 68, riskBand: "DANGER / HIGH RISK" },
    affectedFactors: ["Wind Speed (+100%)", "Secondary Wave Build-up (+0.6m wind swell)", "Operational Risk Score (+30 pts)", "Net Drift & Navigation Drift (+120%)"],
    boatSuitability: {
      nonMotorized: { before: "🟡 CAUTION", after: "⛔ STRICTLY PROHIBITED — Extreme drift hazard", status: "PROHIBITED" },
      motorized: { before: "🟡 CAUTION", after: "⛔ HIGH DANGER — Do not venture offshore", status: "PROHIBITED" },
      mechanized: { before: "🟢 SAFE", after: "🟡 EXTREME CAUTION — Only experienced crew with storm gear", status: "CAUTION" }
    },
    fishingSuitabilityChange: "Fishing suitability drops by 60%. Strong wind drift renders purse seine and gillnet deployment unmanageable.",
    chartData: {
      comparisonBar: [
        { metric: "Wind Speed (km/h)", Baseline: 14, Simulated: 28 },
        { metric: "Wave Height (m)", Baseline: 1.8, Simulated: 2.4 },
        { metric: "Risk Score (/100)", Baseline: 38, Simulated: 68 }
      ],
      vesselLimits: [
        { vessel: "Non-Motorized (Canoe)", Limit: 25, Baseline: 14, Simulated: 28 },
        { vessel: "Motorized (<12m)", Limit: 35, Baseline: 14, Simulated: 28 },
        { vessel: "Mechanized (>12m)", Limit: 50, Baseline: 14, Simulated: 28 }
      ],
      riskMatrix: [
        { category: "Drift Hazard", Baseline: 30, Simulated: 85 },
        { category: "Wave Stress", Baseline: 45, Simulated: 75 },
        { category: "Port Return Safety", Baseline: 80, Simulated: 40 },
        { category: "Safety Score", Baseline: 62, Simulated: 32 }
      ]
    }
  },
  // 3. What happens if I increase the wave height and wind speed and decrease the SST at Kochi Harbour?
  {
    id: 3,
    matches: (q: string) => (q.includes("kochi") && (q.includes("decrease") || q.includes("sst") || (q.includes("wave") && q.includes("wind")))),
    title: "Digital Twin Multi-Factor Simulation — Compound Environmental Shock at Kochi Harbour",
    locationName: "Kochi Harbour (Thoppumpady)",
    district: "Ernakulam",
    state: "Kerala",
    coords: [9.93, 76.26],
    before: { waveHeight: "1.2 m", windSpeed: "14 km/h", sst: "29.1°C", riskScore: 28, riskBand: "SAFE" },
    changed: {
      paramName: "Compound Shock (Wave + Wind + SST)",
      changeText: "Wave: 1.2m → 2.2m (+1.0m) | Wind: 14 → 32 km/h (+18 km/h) | SST: 29.1°C → 25.5°C (-3.6°C)",
      description: "Simulated storm front event with severe wave escalation, strong wind gusts, and coastal upwelling SST cooling."
    },
    after: { waveHeight: "2.2 m", windSpeed: "32 km/h", sst: "25.5°C", riskScore: 76, riskBand: "SEVERE DANGER / STORM STATE" },
    affectedFactors: [
      "Significant Wave Height (+83%)",
      "Wind Speed (+128%)",
      "Sea Surface Temperature (-3.6°C upwelling drop)",
      "Combined Operational Risk (+48 pts)",
      "Vessel Safety Margin (-70%)"
    ],
    boatSuitability: {
      nonMotorized: { before: "🟢 SAFE", after: "⛔ SEVERE DANGER — PROHIBITED", status: "PROHIBITED" },
      motorized: { before: "🟢 SAFE", after: "⛔ SEVERE DANGER — PROHIBITED", status: "PROHIBITED" },
      mechanized: { before: "🟢 SAFE", after: "🟡 HIGH CAUTION — Severe weather warning active", status: "CAUTION" }
    },
    fishingSuitabilityChange: "Combined fishing suitability drops by 75%. Cold upwelling initially displaces surface fish schools, while 2.2m waves and 32 km/h winds make marine operations extremely hazardous.",
    combinedEffectDetails: {
      waveDeltaRisk: 20,
      windDeltaRisk: 22,
      sstDeltaRisk: 6,
      totalRiskShift: 48,
      explanation: "Compound effect calculation: Wave elevation (+1.0m) contributes +20 risk points, Wind surge (+18 km/h) adds +22 risk points, and Thermal Upwelling (-3.6°C drop) adds +6 thermal shock risk points. Total Risk jumps from 28/100 (SAFE) to 76/100 (SEVERE DANGER)."
    },
    chartData: {
      waterfallRisk: [
        { stage: "Baseline State", Risk: 28, fill: "#10b981" },
        { stage: "+1.0m Wave Delta", Risk: 48, fill: "#0ea5e9" },
        { stage: "+18 km/h Wind Delta", Risk: 70, fill: "#f59e0b" },
        { stage: "-3.6°C SST Cooling", Risk: 76, fill: "#ef4444" }
      ],
      combinedRadar: [
        { subject: "Wave Exposure", Baseline: 30, Simulated: 85 },
        { subject: "Wind Exposure", Baseline: 28, Simulated: 90 },
        { subject: "Thermal Shock", Baseline: 15, Simulated: 65 },
        { subject: "Vessel Risk", Baseline: 28, Simulated: 76 },
        { subject: "Gear Safety", Baseline: 85, Simulated: 25 }
      ],
      vesselImpact: [
        { vessel: "Non-Motorized Canoe", BaselineRisk: 30, SimulatedRisk: 95 },
        { vessel: "Small Motorized Boat", BaselineRisk: 28, SimulatedRisk: 82 },
        { vessel: "Mechanized Trawler", BaselineRisk: 22, SimulatedRisk: 55 }
      ]
    }
  }
];

export function findDemoDigitalTwinScenario(query: string): DemoDigitalTwinScenario | undefined {
  const qClean = query.toLowerCase().trim();
  return DEMO_DIGITAL_TWIN_SCENARIOS.find(s => s.matches(qClean));
}
