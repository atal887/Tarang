import { evaluateMarineCandidates } from './src/services/marineCandidateEvaluator.js';

const testCases = [
  { query: "fishing in Mumbai", loc: "loc_0", time: new Date(), boat: "motorized" },
  { query: "how about Sassoon Dock?", loc: "loc_0", time: new Date(), boat: "motorized" }
];

testCases.forEach(c => {
  console.log(`Query: ${c.query}`);
  const results = evaluateMarineCandidates(c.query, c.loc, c.time, c.boat);
  console.log(`Evaluated ${results.length} candidates.`);
  results.forEach(r => {
    console.log(`  - ${r.facilityName} (${r.distanceKm}km): ${r.riskBand} (Score: ${r.riskScore}) - PFZ: ${r.fishingPotential}`);
  });
});
