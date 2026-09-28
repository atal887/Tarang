import { evaluateFishermanContext } from './src/services/decisionEngine';
import { detectIntent } from './src/services/intentService';

function runTest(name: string, condition: boolean) {
  if (condition) {
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ ${name}`);
    process.exit(1);
  }
}

console.log("=== DIGITAL TWIN TESTS ===");

const loc = 'loc_0'; // Mumbai
const dt = new Date(2026, 9, 28);
const boat = 'motorized'; // 1.4m wave limit, 40km/h wind limit

// 1. Baseline
const baseline = evaluateFishermanContext(loc, dt, boat, "");
runTest("Baseline is SAFE", baseline.riskBand === 'SAFE');

// 2. Simulated environment (increase waves past safe limit)
const simulatedDangerous = { significantWaveHeightM: 4.0, windSpeedKmph: 70 };
const simDecision = evaluateFishermanContext(loc, dt, boat, "", false, simulatedDangerous);

runTest("Simulated environment becomes AVOID", simDecision.riskBand === 'AVOID');
runTest("Simulated reason mentions wave height", simDecision.reasons.some(r => r.includes('Severe marine hazard')));

// 3. Simulated environment (increase productivity)
const simulatedProductive = { chlorophyllMgM3: 4.5, pfzPotentialScore: 98 };
const simDecision2 = evaluateFishermanContext(loc, dt, boat, "", false, simulatedProductive);
console.log("simDecision2.riskBand:", simDecision2.riskBand);
runTest("Productive simulated environment remains SAFE", simDecision2.riskBand === 'SAFE');

const productivityScore = simDecision2.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore;
const baseScore = baseline.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore;
runTest("Productivity score increased in simulation", !!(productivityScore && baseScore && productivityScore > baseScore));

console.log("Passed all Digital Twin tests.");
