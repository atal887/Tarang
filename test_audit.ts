import { resolveFishermanContext } from './src/services/contextResolver.js';
import { evaluateFishermanContext } from './src/services/decisionEngine.js';
import { evaluateMarineCandidates } from './src/services/marineCandidateEvaluator.js';
import { resolveInlandFishingCandidates } from './src/data/inlandFishingResolver.js';
import { selectTopInlandCandidates } from './src/data/inlandFishingSelector.js';

function runScenario(name: string, query: string, defaultLoc: string, defaultBoat: string = "motorized") {
  console.log(`\n\n=== ${name} ===`);
  
  const ctx = resolveFishermanContext({ query, defaultLocationName: defaultLoc, defaultBoatType: defaultBoat });
  const result = evaluateFishermanContext(ctx.locationId, ctx.dateTime, ctx.boatType, ctx.originalQuery);
  
  let branch = "Unknown";
  let fallbackStatus = "No Fallback";
  let candidateCount = 0;
  
  if (result.marineRecommendations) {
    branch = "Marine";
    const evaluated = evaluateMarineCandidates(ctx.originalQuery, ctx.locationId, ctx.dateTime, ctx.boatType);
    candidateCount = evaluated.length;
  } else if (result.inlandRecommendations) {
    branch = "Inland";
    // Check inland fallback status
    const resolvedInland = resolveInlandFishingCandidates(ctx.locationId);
    if (resolvedInland) {
      const selected = selectTopInlandCandidates(resolvedInland);
      candidateCount = selected.length;
      if (selected.length > 0 && selected[0].isFallback) {
        fallbackStatus = "Fallback applied";
      }
    }
  }

  const recCount = result.marineRecommendations ? result.marineRecommendations.length : (result.inlandRecommendations ? result.inlandRecommendations.length : 0);

  console.log(`LocationID: ${ctx.locationId}`);
  console.log(`Branch: ${branch}`);
  console.log(`Vessel: ${ctx.boatType}`);
  console.log(`Candidate Count: ${candidateCount}`);
  console.log(`Recommendation Count: ${recCount}`);
  console.log(`RiskBand: ${result.riskBand}`);
  console.log(`Fallback Status: ${fallbackStatus}`);
  console.log("Reasons:");
  result.reasons.forEach(r => console.log(` - ${r}`));
}

runScenario("1. Mumbai General Fishing", "Can I go fishing tomorrow in Mumbai?", "Mumbai");
runScenario("2. Mumbai Sassoon Dock", "Can I fish from Sassoon Dock tomorrow?", "Mumbai");
runScenario("3. Mumbai Non-motorized", "Can I go fishing tomorrow in Mumbai in a non-motorized boat?", "Mumbai");
runScenario("4. Veraval General Fishing", "Can I go fishing tomorrow in Veraval?", "Veraval");
runScenario("5. Veraval Non-motorized", "Can I go fishing tomorrow in Veraval in a non-motorized boat?", "Veraval");
runScenario("6. Chandigarh Fishing", "Can I go fishing tomorrow in Chandigarh?", "Chandigarh");
runScenario("7. Kohima Fishing", "Can I go fishing tomorrow in Kohima?", "Kohima");
