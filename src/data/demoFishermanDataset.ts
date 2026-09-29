/**
 * demoFishermanDataset.ts
 * Hardcoded realistic fisherman demo dataset for TARANG Default Mode.
 * Contains 10 exact scenarios with actual place names & coordinates from TARANG dataset.
 * Written in a natural, friendly, conversational style for fishermen.
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
  requiresPortSelection?: boolean;
  requiresConfirmation?: boolean;
  confirmPrompt?: string;
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

// ── 5. Mumbai Hindi Ports ──────────────────────────────────────────────────
export const MUMBAI_HINDI_DEMO_PORTS: DemoPort[] = [
  {
    id: "mumbai-sassoon-hi",
    name: "ससून डॉक मछली पकड़ने का बंदरगाह",
    district: "मुंबई",
    state: "महाराष्ट्र",
    lat: 18.92,
    lng: 72.83,
    distanceKm: 2.5,
    riskScore: 22,
    riskBand: "SAFE",
    waveHeight: "1.0 मीटर",
    windSpeed: "12 किमी/घंटा",
    windDir: "दक्षिण-पश्चिम",
    suitability: "अनुकूल परिस्थितियां। कम लहरों के साथ शांत समुद्री क्षेत्र।"
  },
  {
    id: "mumbai-bhaucha-hi",
    name: "भाऊचा धक्का (फेरी घाट)",
    district: "मुंबई",
    state: "महाराष्ट्र",
    lat: 18.95,
    lng: 72.85,
    distanceKm: 4.8,
    riskScore: 26,
    riskBand: "SAFE",
    waveHeight: "1.2 मीटर",
    windSpeed: "14 किमी/घंटा",
    windDir: "दक्षिण-पश्चिम",
    suitability: "शांत समुद्री स्थिति। मोटर चालित और पारंपरिक नावों के लिए आदर्श।"
  },
  {
    id: "mumbai-versova-hi",
    name: "वर्सोवा मछली पकड़ने का बंदरगाह",
    district: "मुंबई",
    state: "महाराष्ट्र",
    lat: 19.13,
    lng: 72.81,
    distanceKm: 18.2,
    riskScore: 42,
    riskBand: "CAUTION",
    waveHeight: "1.7 मीटर",
    windSpeed: "19 किमी/घंटा",
    windDir: "पश्चिम-दक्षिण-पश्चिम",
    suitability: "मुहाने के पास हल्की लहरें। छोटी नौकाओं को थोड़ी सावधानी बरतनी चाहिए।"
  }
];

// ── 6. Kochi Hindi Fishing Zones ───────────────────────────────────────────
export const KOCHI_HINDI_DEMO_ZONES: DemoFishingZone[] = [
  {
    id: "zone-chellanam-hi",
    name: "चेलनम अपतटीय क्षेत्र (Chellanam Offshore Zone)",
    nearPort: "थोपमपडी मछली पकड़ने का बंदरगाह",
    lat: 9.82,
    lng: 76.20,
    distanceKm: 14.5,
    direction: "दक्षिण-पश्चिम",
    riskScore: 25,
    riskBand: "SAFE",
    productivityScore: 88,
    productivityBand: "High",
    suitability: "उच्च क्लोरोफिल घनत्व। 1.0 मीटर की शांत लहरों में प्रचुर सरडाइन और मैकेरल मछली।"
  },
  {
    id: "zone-vypin-reef-hi",
    name: "वाइपीन रीफ बाहरी किनारा (Vypin Reef Outer Edge)",
    nearPort: "वाइपीन मछली पकड़ने का बंदरगाह",
    lat: 10.02,
    lng: 76.15,
    distanceKm: 11.2,
    direction: "पश्चिम",
    riskScore: 28,
    riskBand: "SAFE",
    productivityScore: 82,
    productivityBand: "High",
    suitability: "झींगा और रीफ मछलियों की अच्छी संभावना। मध्यम धाराएं, आसान नौकायन।"
  },
  {
    id: "zone-munambam-deep-hi",
    name: "मुनंबम तटीय क्षेत्र (Munambam Deep Coastal Zone)",
    nearPort: "मुनंबम मछली पकड़ने का बंदरगाह",
    lat: 10.22,
    lng: 76.10,
    distanceKm: 22.0,
    direction: "उत्तर-पश्चिम",
    riskScore: 32,
    riskBand: "SAFE",
    productivityScore: 79,
    productivityBand: "Moderate",
    suitability: "यंत्रीकृत ट्रॉलरों के लिए उपयुक्त गहरा क्षेत्र। कम लहर की ऊंचाई (1.1 मीटर)।"
  }
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  // 1. Is it safe to go fishing tomorrow from Mumbai?
  {
    id: 1,
    matches: (q: string) => /safe\s+to\s+go\s+fishing\s+tomorrow\s+from\s+mumbai/i.test(q) || (q.includes("safe") && q.includes("tomorrow") && q.includes("mumbai") && !q.includes("मुंबई")),
    title: "Fishing Safety Tomorrow (Mumbai)",
    requiresPortSelection: true,
    ports: MUMBAI_DEMO_PORTS,
    getResponse: (portName = "Sassoon Dock Fishing Harbour") => {
      const port = MUMBAI_DEMO_PORTS.find(p => p.name.toLowerCase().includes(portName.toLowerCase())) || MUMBAI_DEMO_PORTS[0];
      return {
        summary: `### 🌊 Fishing Safety Forecast
**${port.name}, Mumbai**

Sea conditions off **${port.name}** tomorrow look **calm and favourable** for fishing.

Waves will stay low around **${port.waveHeight}** with a light south-westerly wind at **${port.windSpeed} ${port.windDir}**. Weather is clear with good visibility, so sea movement will be gentle without heavy rolling.

🟢 **Overall Assessment:** Safe for motorized and mechanized boats. Non-motorized canoes can operate comfortably within 3 km of the coastline.

**Recommendation:** It is safe to head out tomorrow. Setting nets in the morning will give you smooth, hassle-free operations.`,
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
        summary: `### ⚓ Safest Fishing Ports Near Mumbai Tomorrow
**Mumbai Coastal Sector**

If you are deciding where to launch from near Mumbai tomorrow, the southern harbours offer the most sheltered water:

🟢 **Sassoon Dock Fishing Harbour:** Safest choice tomorrow. Waves are low at **1.0 m** and winds are gentle (**12 km/h SW**).
🟢 **Bhaucha Dhakka (Ferry Wharf):** Very calm bay waters with **1.2 m** waves. Great option for motorized and traditional boats.
🟡 **Versova Fishing Harbour:** Expect slight tidal chop near the mouth (**1.7 m** waves, **19 km/h** wind). Exercise extra care if using small canoes.

**Recommendation:** Sassoon Dock and Bhaucha Dhakka are your best launch options for a smooth trip tomorrow.`,
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
        summary: `### 🌊 Wave Height Report
**${port.name}, Kochi**

Waves at **${port.name}** tomorrow will be very gentle, holding around **${port.waveHeight}** with a smooth swell period.

🟢 **Favourable conditions:** This low wave height means minimal boat pitching and very comfortable movement on the water.

**What this means:** Whether you are going out in a traditional canoe, a motorized boat, or a mechanized trawler, the sea will be calm and easy to navigate inside and outside the channel.

**Recommendation:** Ideal day for setting nets or line fishing without worrying about rough seas.`,
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
        summary: `### 💨 Wind Forecast
**${port.name}, Mumbai**

Wind speed off **${port.name}** tomorrow is forecast at **${port.windSpeed}** (~7 knots) coming from the **${port.windDir}**, with occasional light gusts up to 17 km/h.

🟢 **Favourable breeze:** A ${port.windSpeed} wind creates light surface ripples but no steep waves or heavy drift.

**What this means:** Your boat will stay steady while setting nets or dropping lines, and you won't get pushed off course by strong wind pressure.

**Recommendation:** Wind conditions are safe and comfortable for fishing all through the morning and afternoon.`,
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
        summary: `### 🎣 Top Fishing Zones Near Kochi Tomorrow
**Kochi Offshore Sector**

Satellite ocean data shows strong fish activity and clear water conditions at three main spots off Kochi tomorrow:

🟢 **Chellanam Offshore Bank** (14.5 km SW): Highest sardine & mackerel concentration. Waves are calm around **1.0 m**.
🟢 **Vypin Reef Outer Edge** (11.2 km W): Good potential for reef fish and prawns. Easy 11 km run from harbour.
🟢 **Munambam Deep Coastal Edge** (22.0 km NW): Suitable deeper grounds for trawlers with low **1.1 m** waves.

**Recommendation:** Chellanam Offshore Bank is your top choice for a high-yield, safe trip tomorrow.`,
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
        summary: `### 🐟 Potential Fishing Zone (PFZ)
**Veraval Offshore PFZ (Sutrapada Grounds)**

The top recommended fishing zone off Veraval tomorrow is **Veraval Offshore PFZ (Sutrapada Coastal Grounds)**, located about **12.8 km South-East** of Veraval Harbour.

🟢 **Favourable Fishing Spot:** High plankton density and stable **27.8 °C** sea surface temperature have drawn large schools of sardine, ribbonfish, and squid to this area.

**Sea Conditions:** Waves are gentle at **0.9 m** with mild winds (**12 km/h WNW**).

**Recommendation:** Highly recommended zone for motorized gillnetters and trawlers. Head 12.8 km South-East toward Sutrapada grounds for best catch potential.`,
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
        summary: `### 🌡️ Sea Surface Temperature Report
**${port.name}, Kochi**

The sea surface temperature off **${port.name}** is currently **28.4 °C**, with the thermocline layer steady at **18 meters** depth.

🟢 **Good thermal balance:** 28.4 °C is an optimal water temperature that keeps coastal fish active and feeding near the surface.

**What this means:** Because the cooler deep water meets warm surface water at 18m, mackerel and sardine schools are swimming closer to surface nets.

**Recommendation:** Great conditions for surface net setting and trolling off Kochi today and tomorrow.`,
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
        summary: `### ⚓ Safest Fishing Ports Near Chennai Tomorrow
**Chennai Coastal Sector**

Here is how sea conditions compare across Chennai harbours tomorrow:

🟢 **Kasimedu (Chennai Fishing Harbour):** Safest launch point. Protected breakwater with low **0.9 m** waves and **11 km/h** easterly breeze.
🟢 **Thiruvottriyur Kuppam Harbour:** Calm coastal waters (**1.1 m** waves). Very safe for motorized gillnetters.
🟡 **Ennore Port Harbour:** Moderate swell outside the channel (**1.5 m** waves, **18 km/h** wind). Small canoes should stay close to shore.

**Recommendation:** Kasimedu Harbour offers the safest, smoothest departure near Chennai tomorrow.`,
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
        summary: `### 🛥️ Safe Navigation Route
**Mumbai Port (Sassoon Dock) → Alibaug Offshore Fishing Zone**

🟢 **Safe Route:** Waves along this path are low at **1.0 m** with light **13 km/h** south-westerly winds. Estimated travel time is **1 hour 25 minutes** over a distance of **21.6 km**.

**Why this route is safer:** This path steers **3.5 km clear** of the main JNPT commercial ship traffic and avoids the shallow reef rocks near Colaba Shoals.

**Recommendation:** Follow the south-southwest coastal channel for a smooth, fuel-efficient voyage.`,
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
        summary: `### 🛥️ Your 4-Day Fishing Plan
**Kochi → Lakshadweep Archipelago**

Based on weather, wind, and sea conditions across the 9-Degree Channel, this 4-day trip looks **generally safe and favourable**.

### 📍 Day 1 — Kochi to Chellanam Pass (45 km)
**Departure:** Thoppumpady Harbour, early morning  
**Sea:** Wave height around 1.0–1.2 m  
**Wind:** 12–15 km/h  
🟢 **Good conditions for departure**  

The sea is expected to remain calm during the first leg. Starting early will help you travel during the most favourable morning window.

### 🎣 Day 2 — Fishing near 9-Degree Channel (120 km)
**Sea:** Around 1.3 m waves  
**Wind:** 15 km/h WNW  
🟢 **Suitable for tuna fishing**  

High tuna and skipjack activity along the oceanic drop-off. Morning hours offer the smoothest fishing window before mild afternoon swells.

### 🎣 Day 3 — Fishing near Kalpeni Outer Reef (110 km)
**Sea:** Around 1.4 m waves  
**Wind:** Moderate swell  
🟡 **Use normal caution**  

Conditions remain manageable. Prefer fishing closer to the sheltered reef edge between 06:00 AM and 02:00 PM.

### 🛥️ Day 4 — Kavaratti Lagoon Arrival (80 km)
**Sea:** Wave height drops to 1.1 m  
🟢 **Safe sheltered approach**  

Smooth entry into Kavaratti Lagoon Jetty. Safe sheltered docking.

**Recommendation:** Start early on Day 1, keep monitoring sea updates before deep channel crossings, and enjoy high catch potential along the reef edges.`,
        mapCoords: [10.56688, 72.64203],
        mapName: "Kavaratti Harbour Jetty"
      };
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // HINDI DEMO SCENARIOS (11, 12, 13)
  // ──────────────────────────────────────────────────────────────────────────

  // 11. क्या कल मुंबई से मछली पकड़ने जाना सुरक्षित है?
  {
    id: 11,
    matches: (q: string) => (q.includes("मुंबई") || q.includes("mumbai")) && (q.includes("सुरक्षित") || q.includes("मछली पकड़ने")) && (q.includes("कल") || q.includes("सुरक्षा")),
    title: "समुद्री सुरक्षा पूर्वानुमान — मुंबई",
    requiresPortSelection: true,
    ports: MUMBAI_HINDI_DEMO_PORTS,
    getResponse: (portName = "ससून डॉक मछली पकड़ने का बंदरगाह") => {
      const port = MUMBAI_HINDI_DEMO_PORTS.find(p => p.name.includes(portName)) || MUMBAI_HINDI_DEMO_PORTS[0];
      return {
        summary: `समुद्री सुरक्षा पूर्वानुमान
${port.name}, मुंबई

कल ${port.name} से समुद्र में मछली पकड़ने जाना पूरी तरह सुरक्षित और अनुकूल है।

मौसम और समुद्री स्थिति:
• लहर की ऊंचाई: ${port.waveHeight}
• हवा की गति: ${port.windSpeed} (${port.windDir})
• मौसम: साफ आसमान और शांत समुद्र
• जोखिम स्तर: सुरक्षित (${port.riskScore}/100)
• नाव की उपयुक्तता: मोटर चालित और पारंपरिक नावों के लिए पूरी तरह अनुकूल

मछुआरों के लिए जानकारी:
समुद्र में कम लहरें और हल्की हवा होने के कारण नाव का संतुलन बना रहेगा। आप बिना किसी जोखिम के मछली पकड़ने जा सकते हैं।

सिफारिश:
कल सुबह के समय प्रस्थान करना सबसे अच्छा रहेगा। सुबह के समय जाल बिछाना सुरक्षित और सुविधाजनक रहेगा।`,
        ports: [port],
        mapCoords: [port.lat, port.lng],
        mapName: port.name
      };
    }
  },

  // 12. मेरे पास के सबसे अच्छे मछली पकड़ने वाले क्षेत्र कहाँ हैं?
  {
    id: 12,
    matches: (q: string) => (q.includes("पास") || q.includes("नजदीक") || q.includes("नज़दीक")) && (q.includes("क्षेत्र") || q.includes("जगह") || q.includes("मछली")),
    title: "निकटतम सर्वोत्तम मछली पकड़ने के क्षेत्र",
    requiresConfirmation: true,
    confirmPrompt: "स्थान की पुष्टि: क्या आप अपने प्रस्थान स्थल (थोपमपडी / कोच्चि क्षेत्र) के 3 नजदीकी मछली पकड़ने वाले क्षेत्र देखना चाहते हैं?",
    zones: KOCHI_HINDI_DEMO_ZONES,
    getResponse: () => {
      return {
        summary: `स्थान की पुष्टि के बाद 3 नजदीकी उपयुक्त मछली पकड़ने वाले क्षेत्र:

1. चेलनम अपतटीय क्षेत्र (Chellanam Offshore Zone)
• दूरी: 14.5 किमी (दक्षिण-पश्चिम)
• मछली पकड़ने की स्थिति: सरडाइन और मैकेरल मछली की सर्वाधिक सघनता। शांत 1.0 मीटर लहरें।
• जोखिम स्तर: सुरक्षित (25/100)

2. वाइपीन रीफ बाहरी किनारा (Vypin Reef Outer Edge)
• दूरी: 11.2 किमी (पश्चिम)
• मछली पकड़ने की स्थिति: झींगा और रीफ मछलियों की उत्तम संभावना। आसान नौकायन।
• जोखिम स्तर: सुरक्षित (28/100)

3. मुनंबम तटीय क्षेत्र (Munambam Deep Coastal Zone)
• दूरी: 22.0 किमी (उत्तर-पश्चिम)
• मछली पकड़ने की स्थिति: यंत्रीकृत ट्रॉलरों के लिए उपयुक्त गहरा क्षेत्र, शांत समुद्र।
• जोखिम स्तर: सुरक्षित (32/100)

सिफारिश: चेलनम अपतटीय क्षेत्र कल उच्च उपज और सुरक्षित यात्रा के लिए सबसे उत्तम विकल्प है।`,
        zones: KOCHI_HINDI_DEMO_ZONES,
        mapCoords: [KOCHI_HINDI_DEMO_ZONES[0].lat, KOCHI_HINDI_DEMO_ZONES[0].lng],
        mapName: KOCHI_HINDI_DEMO_ZONES[0].name
      };
    }
  },

  // 13. मैं कोच्चि से 3 दिन के लिए मछली पकड़ने जाना चाहता हूँ। मेरे लिए सुरक्षित यात्रा की योजना बनाओ।
  {
    id: 13,
    matches: (q: string) => (q.includes("कोच्चि") || q.includes("3 दिन") || q.includes("3-दिन") || q.includes("तीन दिन")) && (q.includes("योजना") || q.includes("यात्रा") || q.includes("मछली")),
    title: "कोच्चि से 3-दिवसीय सुरक्षित मछली पकड़ने की योजना",
    requiresConfirmation: true,
    confirmPrompt: `सुरक्षित यात्रा योजना बनाने के लिए कृपया अपने विवरण की पुष्टि करें:

• प्रस्थान स्थान: कोच्चि (थोपमपडी बंदरगाह)
• गंतव्य: लक्षद्वीप समुद्री क्षेत्र
• नाव का प्रकार: मोटर चालित नाव
• जाने का समय: कल सुबह 06:00 बजे
• यात्रा की अवधि: 3 दिन

क्या आप 3-दिवसीय सुरक्षित यात्रा योजना देखना चाहते हैं?`,
    getResponse: () => {
      return {
        summary: `कोच्चि से 3-दिवसीय दिन-वार सुरक्षित यात्रा योजना:

दिन 1 — कोच्चि से चेल्लनम तट (45 किमी)
• मौसम: साफ आसमान
• समुद्री स्थिति: शांत समुद्र, लहर की ऊंचाई 1.0 से 1.2 मीटर, हवा 12 से 15 किमी/घंटा
• सुरक्षित अवधि: सुबह 06:00 बजे से शाम 05:00 बजे तक (सुरक्षित प्रस्थान अवधि)
• उपयुक्त मछली पकड़ने का क्षेत्र: चेल्लनम अपतटीय बैंक
• वापसी मार्ग: तटीय सुरक्षित मार्ग से थोपमपडी बंदरगाह

दिन 2 — 9-डिग्री चैनल के पास (120 किमी)
• मौसम: हल्का बादली
• समुद्री स्थिति: मध्यम लहरें 1.3 से 1.4 मीटर, हवा 15 किमी/घंटा
• सावधानी अवधि: सुबह 06:00 बजे से दोपहर 02:00 बजे तक (दोपहर बाद सावधानी बरतें)
• उपयुक्त मछली पकड़ने का क्षेत्र: रीफ बाहरी किनारा (ट्यूना और मैकेरल)
• वापसी मार्ग: चैनल सुरक्षित नौकायन मार्ग

दिन 3 — सुरक्षित वापसी और आगमन (80 किमी)
• मौसम: साफ और सुहाना
• समुद्री स्थिति: लहरें घट कर 1.1 मीटर
• सुरक्षित अवधि: पूरा दिन (सुरक्षित आगमन अवधि)
• उपयुक्त मछली पकड़ने का क्षेत्र: तटीय क्षेत्र
• वापसी मार्ग: थोपमपडी बंदरगाह सुरक्षित आगमन

सिफारिश: यात्रा के दौरान मौसम अलर्ट का ध्यान रखें और सुरक्षित मार्ग का पालन करें।`,
        mapCoords: [10.56688, 72.64203],
        mapName: "सुरक्षित मार्ग (कोच्चि से लक्षद्वीप)"
      };
    }
  }
];

export function findDemoScenario(query: string): DemoScenario | undefined {
  const qClean = query.toLowerCase().trim();
  return DEMO_SCENARIOS.find(s => s.matches(qClean));
}
