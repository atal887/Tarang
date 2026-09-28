import { formatNormalResponse } from './src/services/normalResponseFormatter';
import { formatResearchResponse } from './src/services/researchResponseFormatter';
import type { DecisionResult } from './src/services/decisionEngine';
import type { ResolvedContext } from './src/services/contextResolver';

let passCount = 0;
let failCount = 0;

function ok(condition: boolean, message: string) {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    console.error(`✗ FAILED: ${message}`);
  }
}

// Mocks
const baseContext: ResolvedContext = {
  originalQuery: '',
  locationId: 'loc_0',
  locationName: 'Mumbai',
  dateTime: new Date(2026, 9, 28),
  boatType: 'motorized',
  timeScale: 'day'
};

const baseDecisionSafe: DecisionResult = {
  riskScore: 20,
  riskBand: 'SAFE',
  reasons: ['Safe to go'],
  requiresFallbackConsent: false,
  marineRecommendations: [{
    facilityName: 'Mangalore Port',
    distanceKm: 5,
    riskScore: 20,
    riskBand: 'SAFE',
    productivityEvaluation: { productivityScore: 85, productivityBand: 'HIGH', factors: { pfz: {score: 90, explanation: ''}, chlorophyll: {score: 80, explanation: ''}, sst: {score: 75, explanation: ''}, currentSpeed: {score: 50, explanation: ''}, mixedLayer: {score: 50, explanation: ''}, d20Depth: {score: 50, explanation: ''} } },
    productivityProfile: {} as any
  }],
  inlandRecommendations: []
};

const baseDecisionDanger: DecisionResult = {
  ...baseDecisionSafe,
  riskScore: 80,
  riskBand: 'AVOID',
  marineRecommendations: [{
    ...baseDecisionSafe.marineRecommendations![0],
    riskScore: 80,
    riskBand: 'AVOID'
  }]
};

// 1. UNKNOWN
const unk = formatNormalResponse(['UNKNOWN'], baseContext, baseDecisionSafe);
ok(unk.includes('Could you please elaborate'), 'Should ask for clarification on UNKNOWN');

// 2. Wind + Waves (Normal)
const ww = formatNormalResponse(['WIND_FORECAST', 'WAVE_HEIGHT'], baseContext, baseDecisionSafe);
console.log("Normal WW output:", ww);
ok(ww.includes('Wind is') && ww.includes('waves are'), 'Should synthesize wind and waves into one sentence');

// 3. Safety taking priority when dangerous
const sp = formatNormalResponse(['BEST_FISHING_ZONE', 'SAFETY_TOMORROW'], baseContext, baseDecisionDanger);
ok(sp.includes('The fishing potential may be good, but I would not recommend going'), 'Should prioritize safety warning in direct answer');

// 4. Research Mode Synthesis (Wind + Waves)
const wwRes = formatResearchResponse(['WIND_FORECAST', 'WAVE_HEIGHT'], baseContext, baseDecisionSafe).summary;
console.log("Research WW output:", wwRes);
ok(!wwRes.includes('---'), 'Research mode should not use --- separator');
ok(wwRes.includes('significant wave height') && wwRes.includes('wind speeds'), 'Research mode should combine wind and waves');

// 5. Missing Data handling
const mdCtx = { ...baseContext, locationId: 'LOC-UNKNOWN' }; // Using a dummy ID should return nulls
const md = formatNormalResponse(['D20_CONDITIONS'], mdCtx, baseDecisionSafe);
ok(md.includes("I don't have D20 depth data available"), 'Should handle missing data naturally');

console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
if (failCount > 0) process.exit(1);
