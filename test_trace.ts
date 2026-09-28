import { resolveFishermanContext } from './src/services/contextResolver.js';
import { evaluateFishermanContext } from './src/services/decisionEngine.js';

console.log("\n--- Test: Marine Pipeline Trace ---");
const inputQuery = "I want to go fishing at Sassoon Dock tomorrow in a motorized boat";
console.log(`Original Query: "${inputQuery}"`);

// 1. Resolve context
const context = resolveFishermanContext({
  query: inputQuery,
  defaultLocationName: 'Mumbai',
  defaultBoatType: 'motorized'
});
console.log(`Resolved Location: ${context.locationName} (${context.locationId})`);
console.log(`Passed Query: "${context.originalQuery}"`);

// 2. Evaluate context
const decision = evaluateFishermanContext(context.locationId, context.dateTime, context.boatType, context.originalQuery);

console.log("\nDecision Result:");
console.log(`Risk Band: ${decision.riskBand}`);
console.log("Reasons:");
decision.reasons.forEach(r => console.log(` - ${r}`));
