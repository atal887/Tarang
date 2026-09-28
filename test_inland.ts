import { resolveInlandFishingCandidates } from './src/data/inlandFishingResolver.js';
import { selectTopInlandCandidates } from './src/data/inlandFishingSelector.js';
import { resolveInlandFishingConditions } from './src/data/inlandFishingConditionResolver.js';
import { evaluateInlandCandidates } from './src/data/inlandFishingEvaluator.js';
import { getInlandRecommendations } from './src/data/inlandFishingRecommendation.js';

console.log("\n--- Test: Inland Recommendations ---");
const result = resolveInlandFishingCandidates({ locationId: "loc_7917", maxRadiusKm: 50 }); // Udaipura
const selected = selectTopInlandCandidates(result);
const conditioned = resolveInlandFishingConditions(selected, new Date());
const evaluated = evaluateInlandCandidates(conditioned, 'motorized');
const recommendations = getInlandRecommendations(evaluated);

recommendations.forEach((s, i) => {
  console.log(`  ${i+1}. ${s.spotName}`);
  console.log(`     Risk Band: ${s.riskBand} (Score: ${s.riskScore?.toFixed(2)})`);
  console.log(`     Distance: ${s.distanceKm.toFixed(1)} km`);
});
