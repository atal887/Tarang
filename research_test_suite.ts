import { detectIntent } from './src/services/intentService';
import { resolveFishermanContext } from './src/services/contextResolver';
import { evaluateFishermanContext } from './src/services/decisionEngine';
import { formatResearchResponse } from './src/services/researchResponseFormatter';
import assert from 'assert';

const TEST_QUERIES = [
  // Productivity
  "Where is the nearest PFZ?",
  "Where can I find a potential fishing zone?",
  "Which fishing area is most productive?",
  "Which zone has the highest fishing potential?",
  "Where is the best fishing zone?",
  "Which area has the best chlorophyll?",
  "Why is this zone productive?",
  // Safety
  "Is it safe to fish tomorrow?",
  "Can my boat go tomorrow?",
  "What is the wave height?",
  "How strong is the wind?",
  "Is there cyclone risk?",
  "Why is this area unsafe?",
  "Why was this location rejected?",
  // Environmental
  "What are the current coastal conditions?",
  "What is the SST?",
  "What is the chlorophyll concentration?",
  "What is the surface current?",
  "What is the mixed layer depth?",
  "What is the D20 depth?",
  // Edge cases
  "",
  "gibberish asdf qwerty",
];

const LOCATIONS = [
  { name: "Mumbai", type: "marine" },
  { name: "Veraval", type: "marine" },
  { name: "Kochi", type: "marine" },
  { name: "Delhi", type: "inland" },
  { name: "Kohima", type: "inland" }
];

const VESSELS = ["non_motorized", "motorized", "mechanized"];

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log("=== STARTING RESEARCH MODE TEST SUITE ===");

  for (const loc of LOCATIONS) {
    for (const vessel of VESSELS) {
      for (const query of TEST_QUERIES) {
        try {
          // 1. Resolve context
          const ctx = resolveFishermanContext({
            query: query,
            defaultLocationName: loc.name,
            defaultBoatType: vessel
          });

          // 2. Intent Detection
          const intent = detectIntent(query, "English");

          // 3. Decision Engine
          const decision = evaluateFishermanContext(ctx.locationId, ctx.dateTime, ctx.boatType, ctx.originalQuery, false);

          // 4. Formatter
          const response = formatResearchResponse(intent, ctx, decision);

          // Checks
          assert(response.summary !== undefined, "Summary must be present");
          
          if (loc.type === "inland") {
            // Inland locations must not have marine data
            assert(!response.productivityAnalysis, "Inland locations must not have productivity Analysis");
            assert(!response.candidateComparison, "Inland locations must not have marine candidates");
            // Marine specific questions must explain unavailability
            if (["WAVE_HEIGHT", "NEAREST_PFZ", "BEST_FISHING_ZONE", "CHLOROPHYLL_ZONE"].includes(intent) || query.includes("SST") || query.includes("surface current") || query.includes("mixed layer") || query.includes("D20")) {
                assert(response.summary.includes("inapplicable") || response.summary.includes("unavailable") || response.summary.includes("general risk"), `Inland locations must explain marine unavailability for query: ${query}, got: ${response.summary}`);
            }
          }

          if (response.safetyAnalysis) {
            // Verify vessel limits matches engine logic mapped in formatter
            const windL = response.safetyAnalysis.vesselLimits.windLimitKmph;
            if (vessel === "non_motorized") assert(windL === 25, "non_motorized wind limit should be 25");
            if (vessel === "motorized") assert(windL === 40, "motorized wind limit should be 40");
            if (vessel === "mechanized") assert(windL === 55, "mechanized wind limit should be 55");
          }

          if (response.charts) {
            // Validate chart types
            response.charts.forEach(c => {
              assert(["PRODUCTIVITY_RADAR", "CANDIDATE_COMPARISON", "SAFETY_STRESS"].includes(c.type));
            });
          }

          passed++;
        } catch (e) {
          console.error(`FAILED: ${loc.name} | ${vessel} | "${query}"`);
          console.error(e);
          failed++;
        }
      }
    }
  }

  console.log(`\n=== RESULTS ===\nPassed: ${passed}\nFailed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests();
