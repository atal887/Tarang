/**
 * demoFishermanDataset.ts
 * Hardcoded realistic fisherman demo dataset for TARANG Default Mode.
 * Contains 10 exact scenarios with actual place names & coordinates from TARANG dataset.
 */

export interface DemoPort {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  distanceKm: number;
  riskScore: number;
  riskBand: 'SAFE' | 'CAUTION' | 'DANGER';
  waveHeight: string;
  windSpeed: string;
  windDir: string;
  suitability: string;
}

export interface DemoFishingZone {
  id: string;
  name: string;
  nearPort: string;
  lat: number;
  lng: number;
  distanceKm: number;
  direction: string;
  riskScore: number;
  riskBand: 'SAFE' | 'CAUTION' | 'DANGER';
  productivityScore: number;
  productivityBand: 'High' | 'Moderate' | 'Low';
  suitability: string;
}

// ── 1. Mumbai Ports ────────────────────────────────────────────────────────
export const MUMBAI_DEMO_PORTS: DemoPort[] = [
  {
    id: "mumbai-sassoon",
    name: "Sassoon Dock Fishing Harbour",
    district: "Mumbai",
    state: "Maharashtra",
    lat: 18.92,
    lng: 72.83,
    distanceKm: 2.5,
    riskScore: 22,
    riskBand: "SAFE",
    waveHeight: "1.0m",
    windSpeed: "12 km/h",
    windDir: "SW",
    suitability: "Favorable conditions. Shallow, protected waters with low swell."
  },
  {
    id: "mumbai-bhaucha",
    name: "Bhaucha Dhakka (Ferry Wharf)",
    district: "Mumbai",
    state: "Maharashtra",
    lat: 18.95,
    lng: 72.85,
    distanceKm: 4.8,
    riskScore: 26,
    riskBand: "SAFE",
    waveHeight: "1.2m",
    windSpeed: "14 km/h",
    windDir: "SW",
    suitability: "Calm sea state. Ideal for all small motorized and traditional craft."
  },
  {
    id: "mumbai-versova",
    name: "Versova Fishing Harbour",
    district: "Mumbai",
    state: "Maharashtra",
    lat: 19.13,
    lng: 72.81,
    distanceKm: 18.2,
    riskScore: 42,
    riskBand: "CAUTION",
    waveHeight: "1.7m",
    windSpeed: "19 km/h",
    windDir: "WSW",
    suitability: "Slight chop near tidal inlet. Non-motorized canoes should exercise caution."
  }
];

// ── 2. Kochi Ports ─────────────────────────────────────────────────────────
export const KOCHI_DEMO_PORTS: DemoPort[] = [
  {
    id: "kochi-thoppumpady",
    name: "Thoppumpady Fishing Harbour",
    district: "Ernakulam",
    state: "Kerala",
    lat: 9.93,
    lng: 76.27,
    distanceKm: 1.8,
    riskScore: 18,
    riskBand: "SAFE",
    waveHeight: "0.8m",
    windSpeed: "10 km/h",
    windDir: "WNW",
    suitability: "Very calm waters inside harbour channel. Excellent safety profile."
  },
  {
    id: "kochi-vypin",
    name: "Vypin Fishing Harbour",
    district: "Ernakulam",
    state: "Kerala",
    lat: 9.98,
    lng: 76.24,
    distanceKm: 5.2,
    riskScore: 24,
    riskBand: "SAFE",
    waveHeight: "0.9m",
    windSpeed: "12 km/h",
    windDir: "WNW",
    suitability: "Gentle swell. Good access for traditional and motorized boats."
  },
  {
    id: "kochi-munambam",
    name: "Munambam Fishing Harbour",
    district: "Ernakulam",
    state: "Kerala",
    lat: 10.18,
    lng: 76.16,
    distanceKm: 24.5,
    riskScore: 30,
    riskBand: "SAFE",
    waveHeight: "1.1m",
    windSpeed: "14 km/h",
    windDir: "NW",
    suitability: "Stable open sea access with low hazard rating."
  }
];

// ── 3. Chennai Ports ───────────────────────────────────────────────────────
export const CHENNAI_DEMO_PORTS: DemoPort[] = [
  {
    id: "chennai-kasimedu",
    name: "Kasimedu (Chennai Fishing Harbour)",
    district: "Chennai",
    state: "Tamil Nadu",
    lat: 13.09,
    lng: 80.30,
    distanceKm: 2.1,
    riskScore: 20,
    riskBand: "SAFE",
    waveHeight: "0.9m",
    windSpeed: "11 km/h",
    windDir: "ESE",
    suitability: "Protected bay area with gentle easterly breeze. Safe for all vessel types."
  },
  {
    id: "chennai-thiruvottriyur",
    name: "Thiruvottriyur Kuppam Harbour",
    district: "Chennai",
    state: "Tamil Nadu",
    lat: 13.17,
    lng: 80.33,
    distanceKm: 10.4,
    riskScore: 24,
    riskBand: "SAFE",
    waveHeight: "1.1m",
    windSpeed: "13 km/h",
    windDir: "ESE",
    suitability: "Low sea-state risk. Well suited for motorized gillnetters."
  },
  {
    id: "chennai-ennore",
    name: "Ennore Port Harbour",
    district: "Chennai",
    state: "Tamil Nadu",
    lat: 13.24,
    lng: 80.34,
    distanceKm: 18.0,
    riskScore: 38,
    riskBand: "CAUTION",
    waveHeight: "1.5m",
    windSpeed: "18 km/h",
    windDir: "E",
    suitability: "Moderate swell outside harbour breakwater. Small canoes should avoid deep water."
  }
];

// ── 4. Kochi Fishing Zones ────────────────────────────────────────────────
export const KOCHI_DEMO_ZONES: DemoFishingZone[] = [
  {
    id: "zone-chellanam",
    name: "Chellanam Offshore Bank",
    nearPort: "Thoppumpady Fishing Harbour",
    lat: 9.82,
    lng: 76.20,
    distanceKm: 14.5,
    direction: "SW",
    riskScore: 25,
    riskBand: "SAFE",
    productivityScore: 88,
    productivityBand: "High",
    suitability: "High chlorophyll density. Abundant sardine & mackerel activity in calm 1.0m swell."
  },
  {
    id: "zone-vypin-reef",
    name: "Vypin Reef Outer Edge",
    nearPort: "Vypin Fishing Harbour",
    lat: 10.02,
    lng: 76.15,
    distanceKm: 11.2,
    direction: "W",
    riskScore: 28,
    riskBand: "SAFE",
    productivityScore: 82,
    productivityBand: "High",
    suitability: "Good reef fish & prawn potential. Moderate currents, easy navigation."
  },
  {
    id: "zone-munambam-deep",
    name: "Munambam Deep Coastal Edge",
    nearPort: "Munambam Fishing Harbour",
    lat: 10.22,
    lng: 76.10,
    distanceKm: 22.0,
    direction: "NW",
    riskScore: 32,
    riskBand: "SAFE",
    productivityScore: 79,
    productivityBand: "Moderate",
    suitability: "Deeper grounds suitable for mechanized trawlers. Low wave height (1.1m)."
  }
];

// ── Scenario Matchers & Logic ──────────────────────────────────────────────
export interface DemoScenario {
  id: number;
  matches: (q: string) => boolean;
  title: string;
  requiresPortSelection: boolean;
  ports?: DemoPort[];
  zones?: DemoFishingZone[];
  getResponse: (portName?: string, boatType?: string) => {
    summary: string;
    ports?: DemoPort[];
    zones?: DemoFishingZone[];
    mapCoords?: [number, number];
    mapName?: string;
  };
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  // 1. Is it safe to go fishing tomorrow from Mumbai?
  {
    id: 1,
    matches: (q: string) => /safe\s+to\s+go\s+fishing\s+tomorrow\s+from\s+mumbai/i.test(q) || (q.includes("safe") && q.includes("tomorrow") && q.includes("mumbai")),
    title: "Fishing Safety Tomorrow (Mumbai)",
    requiresPortSelection: true,
    ports: MUMBAI_DEMO_PORTS,
    getResponse: (portName = "Sassoon Dock Fishing Harbour") => {
      const port = MUMBAI_DEMO_PORTS.find(p => p.name.toLowerCase().includes(portName.toLowerCase())) || MUMBAI_DEMO_PORTS[0];
      return {
        summary: `### Safety Forecast for Tomorrow (${port.name})\n\n**Safety Level:** ✅ **SAFE (Risk Score: ${port.riskScore}/100)**\n\n* **Wave Height:** ${port.waveHeight} (Gentle swell)\n* **Wind Speed:** ${port.windSpeed} ${port.windDir} (Mild breeze)\n* **Weather:** Clear skies with good visibility (9 km)\n* **Vessel Suitability:** Fully safe for **Motorized** and **Mechanized** boats. Non-motorized canoes can operate within 3 km of shore.\n\n> **Recommendation:** Conditions off ${port.name} are favorable tomorrow. Sea state remains calm throughout the day with no storm or wave warnings.`,
        ports: [port],
        mapCoords: [port.lat, port.lng],
        mapName: port.name
      };
    }
  },
  // 2. Which fishing port near Mumbai is safest tomorrow?
  {
    id: 2,
    matches: (q: string) => /safest\s+port\s+near\s+mumbai/i.test(q) || (q.includes("safest") && q.includes("port") && q.includes("mumbai")),
    title: "Safest Fishing Ports Near Mumbai",
    requiresPortSelection: false,
    ports: MUMBAI_DEMO_PORTS,
    getResponse: () => {
      return {
        summary: `### Top 3 Safest Fishing Ports Near Mumbai Tomorrow\n\nBased on wave height, wind shear, and coast shelter analysis, here are the safest operating ports near Mumbai:`,
        ports: MUMBAI_DEMO_PORTS,
        mapCoords: [MUMBAI_DEMO_PORTS[0].lat, MUMBAI_DEMO_PORTS[0].lng],
        mapName: MUMBAI_DEMO_PORTS[0].name
      };
    }
  },
  // 3. What is the wave height at Kochi?
  {
    id: 3,
    matches: (q: string) => /wave\s+height\s+at\s+kochi/i.test(q) || (q.includes("wave") && q.includes("kochi")),
    title: "Wave Height at Kochi",
    requiresPortSelection: true,
    ports: KOCHI_DEMO_PORTS,
    getResponse: (portName = "Thoppumpady Fishing Harbour") => {
      const port = KOCHI_DEMO_PORTS.find(p => p.name.toLowerCase().includes(portName.toLowerCase())) || KOCHI_DEMO_PORTS[0];
      return {
        summary: `### Wave Height Report — ${port.name}\n\n* **Current / Tomorrow Wave Height:** **${port.waveHeight}**\n* **Swell Period:** 9.2 seconds\n* **Sea Condition:** Calm to gentle swell\n\n> **Boat Comfort & Safety:** A wave height of **${port.waveHeight}** is smooth and comfortable for all boat types including traditional canoes, motorized craft, and mechanized trawlers. You will experience minimal boat pitch.`,
        ports: [port],
        mapCoords: [port.lat, port.lng],
        mapName: port.name
      };
    }
  },
  // 4. What is the wind speed at Mumbai?
  {
    id: 4,
    matches: (q: string) => /wind\s+speed\s+at\s+mumbai/i.test(q) || (q.includes("wind") && q.includes("mumbai")),
    title: "Wind Speed at Mumbai",
    requiresPortSelection: true,
    ports: MUMBAI_DEMO_PORTS,
    getResponse: (portName = "Sassoon Dock Fishing Harbour") => {
      const port = MUMBAI_DEMO_PORTS.find(p => p.name.toLowerCase().includes(portName.toLowerCase())) || MUMBAI_DEMO_PORTS[0];
      return {
        summary: `### Wind Speed & Direction — ${port.name}\n\n* **Wind Speed:** **${port.windSpeed}** (~7 knots)\n* **Wind Direction:** **${port.windDir}** (South-Westerly)\n* **Gust Speed:** Up to 17 km/h\n* **Weather:** Clear sky, mild atmospheric humidity\n\n> **Fisherman Note:** A 14 km/h wind creates light surface ripples. Net deployment and line dropping will remain stable without heavy wind drift.`,
        ports: [port],
        mapCoords: [port.lat, port.lng],
        mapName: port.name
      };
    }
  },
  // 5. Where is the nearest fishing zone from Kochi?
  {
    id: 5,
    matches: (q: string) => /nearest\s+fishing\s+zone\s+from\s+kochi/i.test(q) || (q.includes("nearest") && (q.includes("fishing zone") || q.includes("pfz")) && q.includes("kochi")),
    title: "Nearest Fishing Zones From Kochi",
    requiresPortSelection: false,
    zones: KOCHI_DEMO_ZONES,
    getResponse: () => {
      return {
        summary: `### Top 3 Recommended Fishing Zones Near Kochi\n\nHere are the top potential fishing zones (PFZs) identified from satellite chlorophyll and ocean temperature maps near Kochi:`,
        zones: KOCHI_DEMO_ZONES,
        mapCoords: [KOCHI_DEMO_ZONES[0].lat, KOCHI_DEMO_ZONES[0].lng],
        mapName: KOCHI_DEMO_ZONES[0].name
      };
    }
  },
  // 6. What is the PFZ near Veraval?
  {
    id: 6,
    matches: (q: string) => /pfz\s+near\s+veraval/i.test(q) || (q.includes("pfz") && q.includes("veraval")),
    title: "PFZ Near Veraval",
    requiresPortSelection: false,
    getResponse: () => {
      const veravalZone: DemoFishingZone = {
        id: "veraval-pfz-1",
        name: "Veraval Offshore PFZ (Sutrapada Coastal Grounds)",
        nearPort: "Veraval Fishery Harbour",
        lat: 20.85,
        lng: 70.45,
        distanceKm: 12.8,
        direction: "SE",
        riskScore: 26,
        riskBand: "SAFE",
        productivityScore: 91,
        productivityBand: "High",
        suitability: "High plankton bloom detected. Ideal for sardine, ribbonfish & squid catch."
      };
      return {
        summary: `### Recommended Potential Fishing Zone (PFZ) — Veraval\n\n* **Zone Name:** **${veravalZone.name}**\n* **Approx Location:** 12.8 km South-East of Veraval Fishery Harbour (Gir Somnath)\n* **Distance & Bearing:** 12.8 km (${veravalZone.direction})\n* **Risk Level:** ✅ **SAFE (${veravalZone.riskScore}/100)**\n* **Fishing Potential:** 🔥 **High (${veravalZone.productivityScore}/100)**\n\n> **Fisherman Guidance:** Satellite ocean color data shows a dense chlorophyll concentration off Sutrapada. Sea surface temperature is 27.8 °C with calm waves (0.9m). Excellent potential for motorized gillnetters and trawlers.`,
        zones: [veravalZone],
        mapCoords: [veravalZone.lat, veravalZone.lng],
        mapName: veravalZone.name
      };
    }
  },
  // 7. What is the sea temperature at Kochi?
  {
    id: 7,
    matches: (q: string) => /sea\s+temperature\s+at\s+kochi/i.test(q) || (q.includes("temperature") && q.includes("kochi")),
    title: "Sea Temperature at Kochi",
    requiresPortSelection: true,
    ports: KOCHI_DEMO_PORTS,
    getResponse: (portName = "Thoppumpady Fishing Harbour") => {
      const port = KOCHI_DEMO_PORTS.find(p => p.name.toLowerCase().includes(portName.toLowerCase())) || KOCHI_DEMO_PORTS[0];
      return {
        summary: `### Sea Surface Temperature (SST) — ${port.name}\n\n* **Sea Temperature:** **28.4 °C**\n* **Mixed Layer Depth (MLD):** 18 meters\n* **Thermal Gradient:** Normal stable range\n\n> **Fisherman Explanation:** A water temperature of 28.4 °C is highly suitable for coastal fish activity. Thermocline depth is stable at 18 meters, drawing mackerel and sardine schools close to surface feeding zones.`,
        ports: [port],
        mapCoords: [port.lat, port.lng],
        mapName: port.name
      };
    }
  },
  // 8. Which is the safest fishing port near Chennai?
  {
    id: 8,
    matches: (q: string) => /safest\s+(fishing\s+)?port\s+near\s+chennai/i.test(q) || (q.includes("safest") && q.includes("chennai")),
    title: "Safest Fishing Ports Near Chennai",
    requiresPortSelection: false,
    ports: CHENNAI_DEMO_PORTS,
    getResponse: () => {
      return {
        summary: `### Safest Fishing Ports Near Chennai Tomorrow\n\nComparative safety evaluation of major harbour facilities along the Chennai coastline:`,
        ports: CHENNAI_DEMO_PORTS,
        mapCoords: [CHENNAI_DEMO_PORTS[0].lat, CHENNAI_DEMO_PORTS[0].lng],
        mapName: CHENNAI_DEMO_PORTS[0].name
      };
    }
  },
  // 9. What is the safest way to travel from Mumbai Port to the fishing area?
  {
    id: 9,
    matches: (q: string) => /safest\s+way\s+to\s+travel\s+from\s+mumbai/i.test(q) || (q.includes("safest") && q.includes("route") && q.includes("mumbai")) || (q.includes("travel") && q.includes("mumbai port")),
    title: "Safest Route: Mumbai Port to Fishing Area",
    requiresPortSelection: false,
    getResponse: () => {
      const routeInfo = {
        origin: "Mumbai Port (Sassoon Dock)",
        originCoords: [18.92, 72.83] as [number, number],
        destination: "Alibaug Offshore Fishing Zone",
        destCoords: [18.80, 72.70] as [number, number],
        distanceKm: 21.6,
        travelTime: "1 hour 25 mins",
        riskBand: "SAFE (21/100)",
        conditions: "Wave 1.0m, Wind 13 km/h SW, low swell."
      };
      return {
        summary: `### Safest Travel Route Recommendation\n\n* **Start:** **${routeInfo.origin}**\n* **Destination:** **${routeInfo.destination}**\n* **Total Distance:** **${routeInfo.distanceKm} km** (~${routeInfo.travelTime})\n* **Route Risk:** ✅ **${routeInfo.riskBand}**\n* **Sea Conditions along Route:** ${routeInfo.conditions}\n\n> **Why this route is safest:** This path steers 3.5 km clear of the high-density JNPT commercial shipping lane and avoids shallow reefs near Colaba Shoals, offering smooth water and optimal fuel economy.`,
        mapCoords: routeInfo.destCoords,
        mapName: routeInfo.destination
      };
    }
  },
  // 10. Help me plan a 4-day fishing trip from Kochi to Lakshadweep.
  {
    id: 10,
    matches: (q: string) => /4-day\s+fishing\s+trip\s+from\s+kochi\s+to\s+lakshadweep/i.test(q) || ((q.includes("4-day") || q.includes("4 day") || (q.includes("plan") && q.includes("trip"))) && q.includes("kochi") && q.includes("lakshadweep")),
    title: "4-Day Fishing Trip Plan: Kochi to Lakshadweep",
    requiresPortSelection: false,
    getResponse: () => {
      return {
        summary: `### 4-Day Fishing Trip Plan: Kochi → Lakshadweep Archipelago\n\nHere is a day-by-day operational itinerary designed for safety, calm sea corridors, and high fish yield:\n\n* **Day 1: Depart Thoppumpady Harbour, Kochi → Chellanam Offshore Pass (45 km)**\n  * *Conditions:* Waves 1.0m, Wind 12 km/h SW. Safe passage. Set initial nets by evening.\n\n* **Day 2: Chellanam Pass → Nine Degree Channel Edge (120 km)**\n  * *Conditions:* Waves 1.3m, Wind 15 km/h WNW. High tuna & skipjack activity along oceanic drop-off.\n\n* **Day 3: Nine Degree Channel → Kalpeni / Kavaratti Reef Outer Edge (110 km)**\n  * *Conditions:* Waves 1.4m. Peak fishing window 06:00 AM – 02:00 PM. High productivity zone.\n\n* **Day 4: Kavaratti Harbour Return Approach & Lagoon Entrance (80 km)**\n  * *Conditions:* Waves 1.1m. Safe sheltered docking at Kavaratti Lagoon Jetty (10.56, 72.64).\n\n> **Safety Summary:** Overall trip risk level is **SAFE (28/100)**. No squalls or monsoon surges forecast along the 9-Degree Channel corridor.`,
        mapCoords: [10.56688, 72.64203],
        mapName: "Kavaratti Harbour Jetty"
      };
    }
  }
];

export function findDemoScenario(query: string): DemoScenario | undefined {
  const qClean = query.toLowerCase().trim();
  return DEMO_SCENARIOS.find(s => s.matches(qClean));
}
