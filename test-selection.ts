import { evaluateMarineCandidates, selectTopMarineCandidates } from './src/services/marineCandidateEvaluator.js';

const candidates = evaluateMarineCandidates("fishing in Mumbai", "loc_0", new Date(), "motorized");

console.log(`Evaluated ${candidates.length} candidates.`);
candidates.forEach(r => {
  console.log(`  - ${r.facilityName} (${r.distanceKm}km): ${r.riskBand} (Score: ${r.riskScore}) - PFZ: ${r.fishingPotential}`);
});

const top3 = selectTopMarineCandidates(candidates);

console.log(`\nTop ${top3.length} Selected Candidates:`);
top3.forEach((r, i) => {
  console.log(`  ${i+1}. ${r.facilityName} (${r.distanceKm}km): ${r.riskBand} (Score: ${r.riskScore}) - PFZ: ${r.fishingPotential}`);
});
