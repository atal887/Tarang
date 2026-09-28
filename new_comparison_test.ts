import { formatComparisonResponse } from './src/services/comparisonFormatter';
import type { MarineCandidateResult } from './src/services/marineCandidateEvaluator';
import { detectIntent } from './src/services/intentService';

const mockCandidates: MarineCandidateResult[] = [
  {
    facilityName: 'Zone A',
    distanceKm: 10,
    riskScore: 25,
    riskBand: 'SAFE',
    productivityEvaluation: { productivityScore: 80, productivityBand: 'HIGH', factors: {} as any },
    productivityProfile: {} as any,
  },
  {
    facilityName: 'Zone B',
    distanceKm: 15,
    riskScore: 65,
    riskBand: 'CAUTION',
    productivityEvaluation: { productivityScore: 40, productivityBand: 'LOW', factors: {} as any },
    productivityProfile: {} as any,
  },
  {
    facilityName: 'Zone C',
    distanceKm: 20,
    riskScore: 10,
    riskBand: 'SAFE',
    productivityEvaluation: { productivityScore: 90, productivityBand: 'HIGH', factors: {} as any },
    productivityProfile: {} as any,
  }
];

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

// 1. Comparison tests
const res1 = formatComparisonResponse([mockCandidates[0], mockCandidates[1]], 'Normal');
ok(res1.includes('Zone A is the better overall choice'), 'Should conclude Zone A is better');
ok(!res1.includes('Note: This analysis'), 'Should not have research disclaimer in normal mode');

const res2 = formatComparisonResponse([mockCandidates[0], mockCandidates[1]], 'Research');
ok(res2.includes('Note: This analysis is based on the currently available TARANG dataset.'), 'Should have research disclaimer');
ok(res2.includes('Safety Analysis:') && res2.includes('Productivity Analysis:'), 'Should have structural headers in research mode');

const res3 = formatComparisonResponse(mockCandidates, 'Normal');
ok(res3.includes('Quick comparison'), 'Should use 3-way format');
ok(res3.includes('Zone C') && res3.includes('lowest risk'), 'Should identify Zone C as safest');

// 2. Intent Taxonomy Tests
ok(detectIntent('Compare the first and second zones', 'English').includes('COMPARE_ZONES'), 'Should detect COMPARE_ZONES');
ok(detectIntent('Why does SST affect fishing?', 'English').includes('FACTOR_EXPLANATION'), 'Should detect FACTOR_EXPLANATION');
ok(detectIntent('How is the productivity score calculated?', 'English').includes('SCORE_BREAKDOWN'), 'Should detect SCORE_BREAKDOWN');
ok(detectIntent('How is safety calculated?', 'English').includes('SAFETY_METHODOLOGY'), 'Should detect SAFETY_METHODOLOGY');
ok(detectIntent('What data are you using?', 'English').includes('DATA_SOURCE'), 'Should detect DATA_SOURCE');
ok(detectIntent('Why is this zone productive?', 'English').includes('PRODUCTIVITY_ANALYSIS'), 'Should detect PRODUCTIVITY_ANALYSIS');
ok(detectIntent('Why is this zone unsafe?', 'English').includes('SAFETY_ANALYSIS'), 'Should detect SAFETY_ANALYSIS');
ok(detectIntent('Why did you recommend this location?', 'English').includes('WHY_RECOMMENDED'), 'Should detect WHY_RECOMMENDED');
ok(detectIntent('Which is closer?', 'English').includes('DISTANCE_ANALYSIS'), 'Should detect DISTANCE_ANALYSIS');

console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
if (failCount > 0) process.exit(1);
