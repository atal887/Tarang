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
        summary: `**Fishing Safety Forecast**\n**${port.name}, Mumbai**\n\n**Key Conditions**\n* **Safety:** 🟢 **SAFE** (Risk Score: ${port.riskScore}/100)\n* **Wave Height:** ${port.waveHeight}\n* **Wind Speed:** ${port.windSpeed} ${port.windDir}\n* **Weather:** Clear skies with 9 km visibility\n\n**What This Means**\nSea conditions off ${port.name} remain calm and stable throughout the day. Shallow, sheltered coastal waters ensure minimal boat pitching.\n\n**Recommendation**\nFully safe to proceed for motorized and mechanized boats. Non-motorized canoes can operate safely within 3 km of shore.`,
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
        summary: `**Safest Fishing Ports Forecast**\n**Mumbai Coastal Sector**\n\n**Key Conditions**\n* **Top Safe Port:** 🟢 Sassoon Dock Fishing Harbour (Risk Score: 22/100)\n* **Secondary Port:** 🟢 Bhaucha Dhakka / Ferry Wharf (Risk Score: 26/100)\n* **Caution Area:** 🟡 Versova Fishing Harbour (Risk Score: 42/100)\n* **General Sea State:** Low swell (1.0m – 1.2m) across southern harbour channels\n\n**What This Means**\nSouth Mumbai ports offer sheltered launching conditions with low wave action. Northern inlets like Versova experience slight tidal chop.\n\n**Recommendation**\nSassoon Dock and Bhaucha Dhakka are recommended for all vessel types tomorrow.`,
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
        summary: `**Wave Height Report**\n**${port.name}, Kochi**\n\n**Key Conditions**\n* **Safety:** 🟢 **SAFE** (Risk Score: ${port.riskScore}/100)\n* **Wave Height:** ${port.waveHeight}\n* **Wind Speed:** ${port.windSpeed} ${port.windDir}\n* **Weather:** Sunny, smooth surface waters\n\n**What This Means**\nA wave height of ${port.waveHeight} is smooth and comfortable. Your boat will experience minimal roll and pitch inside and outside the channel.\n\n**Recommendation**\nExcellent conditions for all boat types including traditional canoes, motorized craft, and mechanized trawlers.`,
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
        summary: `**Wind Speed & Direction Report**\n**${port.name}, Mumbai**\n\n**Key Conditions**\n* **Safety:** 🟢 **SAFE**\n* **Wave Height:** ${port.waveHeight}\n* **Wind Speed:** ${port.windSpeed} ${port.windDir} (~7 knots)\n* **Weather:** Clear sky, good visibility\n\n**What This Means**\nA 14 km/h south-westerly wind creates minor surface ripples without dangerous wave chop.\n\n**Recommendation**\nNet deployment and line dropping will remain stable without heavy wind drift. Safe to operate.`,
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
        summary: `**Nearest Fishing Zones Forecast**\n**Kochi Offshore Sector**\n\n**Key Conditions**\n* **Top Zone:** 🟢 Chellanam Offshore Bank (14.5 km SW)\n* **Secondary Zone:** 🟢 Vypin Reef Outer Edge (11.2 km W)\n* **Deep Zone:** 🟢 Munambam Deep Coastal Edge (22.0 km NW)\n* **General Sea State:** Wave height 1.0m – 1.1m\n\n**What This Means**\nHigh chlorophyll satellite signals indicate heavy sardine and mackerel feeding activity near Chellanam and Vypin.\n\n**Recommendation**\nChellanam Offshore Bank is the safest and most productive target zone for motorized craft tomorrow.`,
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
        summary: `**Potential Fishing Zone (PFZ) Report**\n**Veraval Offshore PFZ (Sutrapada Grounds)**\n\n**Key Conditions**\n* **Safety:** 🟢 **SAFE** (Risk Score: ${veravalZone.riskScore}/100)\n* **Wave Height:** 0.9 m\n* **Wind Speed:** 12 km/h WNW\n* **Weather:** Clear skies (Sea Temp: 27.8 °C)\n\n**What This Means**\nSatellite ocean color maps show a dense chlorophyll bloom off Sutrapada with calm waves and mild currents.\n\n**Recommendation**\nHighly recommended zone for motorized gillnetters and trawlers seeking sardine, ribbonfish, and squid.`,
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
        summary: `**Sea Surface Temperature (SST) Report**\n**${port.name}, Kochi**\n\n**Key Conditions**\n* **Safety:** 🟢 **SAFE**\n* **Sea Temperature:** 28.4 °C\n* **Wave Height:** ${port.waveHeight}\n* **Weather:** Clear sky, stable ocean layer\n\n**What This Means**\nA water temperature of 28.4 °C is optimal for coastal fish activity. The thermocline at 18m draws mackerel and sardine schools to surface waters.\n\n**Recommendation**\nSurface net setting and trolling off Kochi will yield optimal catch under these thermal conditions.`,
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
        summary: `**Safest Fishing Ports Forecast**\n**Chennai Coastal Sector**\n\n**Key Conditions**\n* **Top Safe Port:** 🟢 Kasimedu / Chennai Harbour (Risk Score: 20/100)\n* **Secondary Port:** 🟢 Thiruvottriyur Kuppam Harbour (Risk Score: 24/100)\n* **Caution Area:** 🟡 Ennore Port Harbour (Risk Score: 38/100)\n* **General Sea State:** Wave height 0.9m – 1.1m\n\n**What This Means**\nKasimedu and Thiruvottriyur offer protected harbour basins with low easterly swell. Ennore experiences moderate outer chop.\n\n**Recommendation**\nKasimedu is the safest launch and docking facility near Chennai tomorrow.`,
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
        summary: `**Safest Route Navigation Forecast**\n**Mumbai Port (Sassoon Dock) → Alibaug Offshore PFZ**\n\n**Key Conditions**\n* **Safety:** 🟢 **SAFE** (Risk Score: 21/100)\n* **Wave Height:** 1.0 m\n* **Wind Speed:** 13 km/h SW\n* **Weather:** Clear navigation path (21.6 km | 1h 25m)\n\n**What This Means**\nThis path steers 3.5 km clear of JNPT commercial shipping channels and avoids shallow mudbanks off Colaba Shoals.\n\n**Recommendation**\nFollow the south-southwest coastal corridor for optimal fuel efficiency and safe navigation.`,
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
        summary: `**4-Day Fishing Trip Plan**\n**Kochi Port → Lakshadweep Archipelago**\n\n**Key Conditions**\n* **Trip Safety:** 🟢 **SAFE** (Risk Score: 28/100)\n* **Wave Height:** 1.0m – 1.4m across 9-Degree Channel\n* **Wind Speed:** 12 – 15 km/h WNW\n* **Weather:** Clear passage, low swell corridor (~355 km)\n\n**What This Means**\nStable atmospheric pressure and low monsoon swell make the 9-Degree Channel corridor safe for multi-day passage.\n\n**Recommendation**\nDepart Thoppumpady by 06:00 AM on Day 1. Focus tuna fishing during morning hours on Day 2 and Day 3. Dock at Kavaratti Lagoon Jetty on Day 4.`,
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
