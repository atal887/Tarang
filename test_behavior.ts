import { detectIntent } from './src/services/intentService';
import { resolveFishermanContext } from './src/services/contextResolver';
import { evaluateFishermanContext } from './src/services/decisionEngine';
import { formatNormalResponse } from './src/services/normalResponseFormatter';

const queries = [
  "Is Mumbai a marine location?",
  "Is Delhi an inland location?",
  "What are the top 3 fishing locations near Mumbai?",
  "What is the nearest PFZ zone from Mumbai?"
];

for (const q of queries) {
  console.log(`\n--- Query: "${q}" ---`);
  
  // 1. Detect Intent
  const intents = detectIntent(q, "English");
  console.log(`Intents: ${JSON.stringify(intents)}`);
  
  // 2. Resolve Context
  const context = resolveFishermanContext({
    query: q,
    defaultLocationName: "Mumbai",
    defaultBoatType: "motorized"
  });
  
  // 3. Evaluate Decision
  const decision = evaluateFishermanContext(
    context.locationId,
    context.dateTime,
    context.boatType,
    context.originalQuery
  );
  
  // 4. Format Response
  const textResponse = formatNormalResponse(intents, context, decision);
  console.log(`Text Response: ${textResponse}`);
  
  // 5. Simulate Chat.tsx actionToSet logic
  let actionToSet: string | null = null;
  // mock shouldConfirm to false for simplicity in this test, 
  // since the user test expects the final outcome.
  const shouldConfirm = false; 
  
  if (shouldConfirm) {
    actionToSet = "context_confirm";
  } else {
    const isExplicitRec = intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE', 'TRIP_PLANNING'].includes(i));
    if (isExplicitRec) {
      actionToSet = "DECISION_RESULT"; // Triggers recommendations UI
    }
  }
  
  console.log(`actionToSet (UI Cards Trigger): ${actionToSet}`);
}
