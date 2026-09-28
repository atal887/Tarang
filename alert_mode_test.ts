import { detectIntent } from './src/services/intentService';
import { resolveFishermanContext } from './src/services/contextResolver';
import { evaluateFishermanContext } from './src/services/decisionEngine';
import { formatAlertResponse } from './src/services/alertResponseFormatter';
import assert from 'assert';

const TEST_QUERIES = [
  "Are there any alerts right now?",
  "Are there any marine warnings?",
  "Is there any warning near Mumbai?",
  "Any cyclone warning?",
  "Are there dangerous conditions today?",
  "Are there any alerts tomorrow?",
  "Will there be a cyclone tomorrow?",
  "Will conditions become dangerous during my trip?",
  "Any warnings for the next 3 days?",
  "Is Mumbai under any marine alert?",
  "Is there a warning near Kochi?",
  "Are there alerts around my fishing area?",
  "Will any alerts affect my trip tomorrow?",
  "I am going for 3 days. Are there any warnings during the trip?",
  "Will the cyclone affect my return journey?",
  "Why is this alert dangerous?",
  "What does this warning mean?",
  "How serious is this alert?",
  "What should I do?",
  "Is there a warning tomorrow and is fishing safe?",
  "What about tomorrow?",
  "Will it affect my boat?",
  "completely random gibberish"
];

const LOCATIONS = [
  { name: "Mumbai", type: "marine" },
  { name: "Veraval", type: "marine" },
  { name: "Delhi", type: "inland" }
];

const VESSELS = ["non_motorized", "motorized", "mechanized"];

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log("=== STARTING ALERT MODE TEST SUITE ===");

  for (const loc of LOCATIONS) {
    for (const vessel of VESSELS) {
      for (const query of TEST_QUERIES) {
        try {
          const intents = detectIntent(query, "English");
          
          const ctx = resolveFishermanContext({
            query,
            defaultLocationName: loc.name,
            defaultBoatType: vessel
          });
          
          const decision = evaluateFishermanContext(
            ctx.locationId, 
            ctx.dateTime, 
            ctx.boatType, 
            ctx.originalQuery, 
            false
          );
          
          const response = formatAlertResponse(intents, ctx, decision, false);
          
          assert(response.length > 0, "Response should not be empty");
          
          if (decision.riskBand === 'SAFE' && !intents.includes("DATA_SOURCE") && !intents.includes("SAFETY_METHODOLOGY")) {
            assert(response.includes("No Active Marine Alert") || response.includes("There are no active alerts"), "Should state no active alert when SAFE");
          } else if (decision.riskBand === 'AVOID') {
            assert(response.includes("SEVERE") || response.includes("AVOID") || response.includes("Based on the following factors") || response.includes("TARANG uses data from") || response.includes("The alert is based on"), "Should state severe when AVOID");
          }
          
          passed++;
        } catch (error: any) {
          console.error(`❌ Failed on Query: "${query}", Loc: ${loc.name}, Vessel: ${vessel}`);
          console.error(error.message);
          failed++;
        }
      }
    }
  }
  
  // Specific Test 1: Digital Twin simulation does not trigger official alert
  try {
    const ctx = resolveFishermanContext({
      query: "Are there any alerts right now?",
      defaultLocationName: "Mumbai",
      defaultBoatType: "motorized"
    });
    // Create dummy simulated env that forces AVOID
    const simulatedEnv = {
      facilityId: ctx.locationId,
      significantWaveHeightM: 5.0, // huge waves
      windSpeedKmph: 80 // hurricane winds
    };
    
    const decision = evaluateFishermanContext(
      ctx.locationId, 
      ctx.dateTime, 
      ctx.boatType, 
      ctx.originalQuery, 
      false,
      simulatedEnv
    );
    
    const response = formatAlertResponse(["MARINE_ALERT"], ctx, decision, true); // isSimulated = true
    
    assert(response.includes("Scenario Alert"), "Should clearly state it is a Scenario Alert");
    assert(response.includes("This is a simulation and should not be interpreted as an official marine warning"), "Should disclaim simulation");
    passed++;
  } catch (error: any) {
    console.error("❌ Failed Digital Twin Simulation Test");
    console.error(error.message);
    failed++;
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
