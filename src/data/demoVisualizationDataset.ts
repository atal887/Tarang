export const demoVisualizationDataset = {
  isDemo: true,
  metadata: {
    description: "Demonstration dataset — illustrative values for visualization purposes only",
    source: "TARANG Simulator"
  },
  tripData: [
    { day: 1, label: "Day 1 (Tomorrow)", productivity: 75, risk: 25, wind: 28, wave: 0.8 },
    { day: 2, label: "Day 2", productivity: 82, risk: 30, wind: 32, wave: 0.9 },
    { day: 3, label: "Day 3", productivity: 68, risk: 65, wind: 48, wave: 1.5 }
  ],
  tradeOffData: [
    { facilityName: "Sassoon Dock", productivityScore: 82, riskScore: 24, distanceKm: 5, riskBand: "SAFE" },
    { facilityName: "Versova Harbour", productivityScore: 65, riskScore: 18, distanceKm: 12, riskBand: "SAFE" },
    { facilityName: "Alibaug", productivityScore: 88, riskScore: 65, distanceKm: 28, riskBand: "CAUTION" },
    { facilityName: "Uran", productivityScore: 45, riskScore: 12, distanceKm: 15, riskBand: "SAFE" },
    { facilityName: "Bhayandar", productivityScore: 92, riskScore: 85, distanceKm: 35, riskBand: "AVOID" }
  ]
};
