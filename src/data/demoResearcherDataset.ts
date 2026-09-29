/**
 * demoResearcherDataset.ts
 * 5 hardcoded realistic Researcher Mode scenarios for TARANG AI.
 * Contains comparisons, trends, multi-factor analysis, and route trade-offs.
 */

export interface DemoResearcherScenario {
  id: number;
  matches: (q: string) => boolean;
  title: string;
  queryPattern: string;
  tableData: any[];
  interpretation: string;
  summaryMarkdown: string;
  visualizationType: 'SIDE_BY_SIDE' | 'GROUPED_BAR' | 'TREND_LINE' | 'BUBBLE_SCATTER' | 'ROUTE_MAP_COMPARISON';
  customPayload?: any;
}

export const RESEARCHER_DEMO_SCENARIOS: DemoResearcherScenario[] = [
  // 1. Compare Mumbai and Kochi for fishing conditions
  {
    id: 1,
    queryPattern: "compare mumbai and kochi",
    matches: (q: string) => (q.includes("mumbai") && q.includes("kochi") && (q.includes("compare") || q.includes("vs"))) || /compare\s+mumbai\s+and\s+kochi/i.test(q),
    title: "Mumbai vs Kochi — Marine Condition Comparison",
    tableData: [
      { factor: "Wave Height", mumbai: "1.8 m", kochi: "1.2 m", numMumbai: 1.8, numKochi: 1.2 },
      { factor: "Wind Speed", mumbai: "19 km/h", kochi: "14 km/h", numMumbai: 19, numKochi: 14 },
      { factor: "SST", mumbai: "28.4°C", kochi: "29.1°C", numMumbai: 28.4, numKochi: 29.1 },
      { factor: "Chlorophyll", mumbai: "0.72 mg/m³", kochi: "0.48 mg/m³", numMumbai: 0.72, numKochi: 0.48 },
      { factor: "Risk Score", mumbai: "48/100", kochi: "28/100", numMumbai: 48, numKochi: 28 }
    ],
    interpretation: "Mumbai shows stronger wind and higher waves, resulting in higher operational risk. Kochi has calmer sea conditions, while Mumbai shows higher chlorophyll concentration, which may indicate comparatively better biological productivity.",
    summaryMarkdown: `**Mumbai vs Kochi — Marine Condition Comparison**\n\nMumbai shows stronger wind and higher waves, resulting in higher operational risk. Kochi has calmer sea conditions, while Mumbai shows higher chlorophyll concentration, which may indicate comparatively better biological productivity.`,
    visualizationType: 'SIDE_BY_SIDE',
    customPayload: {
      locations: [
        {
          name: "Mumbai Port (Sassoon Dock)",
          district: "Mumbai",
          state: "Maharashtra",
          coords: [18.92, 72.83] as [number, number],
          waveHeight: "1.8 m",
          windSpeed: "19 km/h SW",
          sst: "28.4°C",
          weather: "Partly Cloudy",
          riskBand: "CAUTION",
          riskScore: 48,
          suitability: "Higher wave height (1.8m) and wind speed (19 km/h) create moderate operational risk. High chlorophyll concentration (0.72 mg/m³) indicates strong biological productivity."
        },
        {
          name: "Kochi Harbour (Thoppumpady)",
          district: "Ernakulam",
          state: "Kerala",
          coords: [9.93, 76.26] as [number, number],
          waveHeight: "1.2 m",
          windSpeed: "14 km/h SW",
          sst: "29.1°C",
          weather: "Clear / Fair",
          riskBand: "SAFE",
          riskScore: 28,
          suitability: "Calm marine conditions with 1.2m waves and 14 km/h wind. Highly suitable for all vessel types with minimal operational risk."
        }
      ]
    }
  },
  // 2. Compare two ports near Mumbai (Bhaucha Dhakka vs Sassoon Dock)
  {
    id: 2,
    queryPattern: "compare ports near mumbai bhaucha dhakka sassoon dock",
    matches: (q: string) => (q.includes("bhaucha") && q.includes("sassoon")) || (q.includes("ports") && q.includes("mumbai") && q.includes("compare")),
    title: "Bhaucha Dhakka vs Sassoon Dock — Port Condition Comparison",
    tableData: [
      { factor: "Wave Height", bhaucha: "1.2 m", sassoon: "1.5 m", numBhaucha: 1.2, numSassoon: 1.5 },
      { factor: "Wind Speed", bhaucha: "14 km/h", sassoon: "17 km/h", numBhaucha: 14, numSassoon: 17 },
      { factor: "SST", bhaucha: "28.6°C", sassoon: "28.5°C", numBhaucha: 28.6, numSassoon: 28.5 },
      { factor: "Risk Score", bhaucha: "26/100", sassoon: "38/100", numBhaucha: 26, numSassoon: 38 }
    ],
    interpretation: "Both ports have similar sea temperature, but Sassoon Dock has slightly stronger winds and higher waves. This produces a higher operational risk score.",
    summaryMarkdown: `**Bhaucha Dhakka vs Sassoon Dock**\n\nBoth ports have similar sea temperature, but Sassoon Dock has slightly stronger winds and higher waves. This produces a higher operational risk score.`,
    visualizationType: 'GROUPED_BAR',
    customPayload: {
      ports: [
        { name: "Bhaucha Dhakka (Ferry Wharf)", coords: [18.95, 72.85] as [number, number] },
        { name: "Sassoon Dock Fishing Harbour", coords: [18.92, 72.83] as [number, number] }
      ],
      locations: [
        {
          name: "Bhaucha Dhakka (Ferry Wharf)",
          district: "Mumbai",
          state: "Maharashtra",
          coords: [18.95, 72.85] as [number, number],
          waveHeight: "1.2 m",
          windSpeed: "14 km/h WNW",
          sst: "28.6°C",
          weather: "Clear / Fair",
          riskBand: "SAFE",
          riskScore: 26,
          suitability: "Sheltered harbor location with low 1.2m waves and mild winds. Excellent safety profile."
        },
        {
          name: "Sassoon Dock Fishing Harbour",
          district: "Mumbai",
          state: "Maharashtra",
          coords: [18.92, 72.83] as [number, number],
          waveHeight: "1.5 m",
          windSpeed: "17 km/h WNW",
          sst: "28.5°C",
          weather: "Partly Cloudy",
          riskBand: "CAUTION",
          riskScore: 38,
          suitability: "Slightly more exposed to open bay swell with 1.5m wave height. Moderate risk level."
        }
      ]
    }
  },
  // 3. How do wave height, wind and SST change over 3 days at Kochi?
  {
    id: 3,
    queryPattern: "3-day trend kochi wave wind sst",
    matches: (q: string) => (q.includes("kochi") && (q.includes("3 days") || q.includes("3-day") || q.includes("change") || q.includes("trend"))),
    title: "3-Day Environmental Trend — Kochi",
    tableData: [
      { day: "Day 1", wave: 1.1, wind: 12, sst: 29.2, waveText: "1.1 m", windText: "12 km/h", sstText: "29.2°C" },
      { day: "Day 2", wave: 1.3, wind: 15, sst: 29.1, waveText: "1.3 m", windText: "15 km/h", sstText: "29.1°C" },
      { day: "Day 3", wave: 1.6, wind: 19, sst: 28.9, waveText: "1.6 m", windText: "19 km/h", sstText: "28.9°C" }
    ],
    interpretation: "Wave height and wind gradually increase over the three-day period, while SST shows a small decline.\n\nThe combination suggests progressively rougher marine conditions by Day 3. The change in SST is relatively small compared with the increase in wind and waves.",
    summaryMarkdown: `**3-Day Environmental Trend — Kochi**\n\nWave height and wind gradually increase over the three-day period, while SST shows a small decline.\n\nThe combination suggests progressively rougher marine conditions by Day 3. The change in SST is relatively small compared with the increase in wind and waves.`,
    visualizationType: 'TREND_LINE'
  },
  // 4. Which fishing area has better fishing potential and why?
  {
    id: 4,
    queryPattern: "fishing area potential kochi kavaratti veraval",
    matches: (q: string) => (q.includes("better") && q.includes("potential")) || (q.includes("kochi") && q.includes("kavaratti") && q.includes("veraval")),
    title: "Fishing Area Comparison — Productivity vs Risk",
    tableData: [
      { area: "Kochi Fishing Grounds", sst: 29.1, chlorophyll: 0.48, wave: 1.2, risk: 28, sstText: "29.1°C", chloText: "0.48 mg/m³", waveText: "1.2 m" },
      { area: "Kavaratti Fishing Grounds", sst: 29.4, chlorophyll: 0.63, wave: 1.3, risk: 31, sstText: "29.4°C", chloText: "0.63 mg/m³", waveText: "1.3 m" },
      { area: "Veraval Fishing Grounds", sst: 28.4, chlorophyll: 0.72, wave: 1.7, risk: 46, sstText: "28.4°C", chloText: "0.72 mg/m³", waveText: "1.7 m" }
    ],
    interpretation: "The three areas show different combinations of productivity indicators and operating conditions:\n• Kochi: Lower risk with moderate environmental productivity.\n• Kavaratti: Good SST and stronger biological productivity indicators with manageable sea conditions.\n• Veraval: Higher chlorophyll but also stronger waves and higher operational risk.\n\nThe researcher should consider productivity and safety together, rather than using a single factor.",
    summaryMarkdown: `**Fishing Area Comparison**\n\nThe three areas show different combinations of productivity indicators and operating conditions:\n\n* **Kochi:** Lower risk with moderate environmental productivity.\n* **Kavaratti:** Good SST and stronger biological productivity indicators with manageable sea conditions.\n* **Veraval:** Higher chlorophyll but also stronger waves and higher operational risk.\n\nThe researcher should consider productivity and safety together, rather than using a single factor.`,
    visualizationType: 'BUBBLE_SCATTER'
  },
  // 5. How do environmental conditions affect the safest route from Mumbai to the fishing area?
  {
    id: 5,
    queryPattern: "route comparison mumbai environmental conditions",
    matches: (q: string) => (q.includes("route") && q.includes("mumbai") && (q.includes("affect") || q.includes("safest") || q.includes("environmental"))),
    title: "Route Comparison — Mumbai Fishing Trip",
    tableData: [
      { route: "Route 1 — Coastal Route", distanceKm: 42, wave: "1.2 m", wind: "Low", risk: 29, color: "#0284c7", positions: [[18.92, 72.83], [18.88, 72.81], [18.82, 72.78], [18.80, 72.70]] },
      { route: "Route 2 — Direct Offshore Route", distanceKm: 31, wave: "1.8 m", wind: "High", risk: 52, color: "#ef4444", positions: [[18.92, 72.83], [18.86, 72.76], [18.80, 72.70]] },
      { route: "Route 3 — Sheltered Route", distanceKm: 47, wave: "1.1 m", wind: "Low–Moderate", risk: 24, color: "#10b981", positions: [[18.92, 72.83], [18.94, 72.87], [18.86, 72.85], [18.80, 72.70]] }
    ],
    interpretation: "The direct offshore route is shorter, but it crosses areas with higher wave and wind exposure.\n\nThe sheltered route takes longer but has lower environmental exposure. The coastal route provides a middle option between distance and environmental risk.",
    summaryMarkdown: `**Route Comparison — Mumbai Fishing Trip**\n\nThe direct offshore route is shorter, but it crosses areas with higher wave and wind exposure.\n\nThe sheltered route takes longer but has lower environmental exposure. The coastal route provides a middle option between distance and environmental risk.`,
    visualizationType: 'ROUTE_MAP_COMPARISON'
  }
];

export function findDemoResearcherScenario(query: string): DemoResearcherScenario | undefined {
  const qClean = query.toLowerCase().trim();
  return RESEARCHER_DEMO_SCENARIOS.find(s => s.matches(qClean));
}
