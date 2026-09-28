import { detectIntent } from './src/services/intentService';
import assert from 'assert';

let passed = 0;
let failed = 0;

function test(label: string, query: string, expected: string | string[]) {
  try {
    const result = detectIntent(query, "English");
    if (Array.isArray(expected)) {
      const missing = expected.filter(e => !result.includes(e as any));
      assert.ok(missing.length === 0, `Query: "${query}" -> Expected [${expected.join(', ')}] to be in [${result.join(', ')}]. Missing: ${missing.join(', ')}`);
    } else {
      assert.ok(result.includes(expected as any), `Query: "${query}" -> Expected ${expected} to be in [${result.join(', ')}]`);
    }
    passed++;
  } catch (e: any) {
    console.error(`✗ FAILED: ${label}`);
    console.error(`  ${e.message}`);
    failed++;
  }
}

console.log("=== STARTING INTENT DETECTION TEST SUITE ===");

// 1. Safety & Feasibility
test("S01", "Is it safe tomorrow?", "SAFETY_TOMORROW");
test("S02", "Can I go tomorrow?", "SAFETY_TOMORROW");
test("S03", "Is tomorrow okay for fishing?", "SAFETY_TOMORROW");
test("S04", "Can my boat go out tomorrow?", "SAFETY_TOMORROW");
test("S05", "Will the sea be rough tomorrow?", "SAFETY_TOMORROW");
test("S06", "Are the conditions dangerous?", "BOAT_SAFETY");
test("S07", "Can my motorized boat go out today?", "BOAT_SAFETY");
test("S08", "Is it dangerous?", "BOAT_SAFETY");
test("S09", "Is the weather safe?", "BOAT_SAFETY");

// 2. Wave / Sea Conditions
test("W01", "What is the wave height?", "WAVE_HEIGHT");
test("W02", "How rough is the sea?", "WAVE_HEIGHT");
test("W03", "Are the waves high?", "WAVE_HEIGHT");
test("W04", "Is the water calm?", "WAVE_HEIGHT");
test("W05", "How bad are the waves?", "WAVE_HEIGHT");
test("W06", "Is the sea rough?", "WAVE_HEIGHT");

// 3. Wind
test("WI01", "How strong is the wind?", "WIND_FORECAST");
test("WI02", "Is it windy tomorrow?", "WIND_FORECAST");
test("WI03", "Will there be strong winds?", "WIND_FORECAST");
test("WI04", "What are the wind conditions?", "WIND_FORECAST");

// 3.5 Specific Environmental Metrics
test("ENV01", "What is the SST?", "SST_CONDITIONS");
test("ENV02", "How warm is the water?", "SST_CONDITIONS");
test("ENV03", "Is the water temperature good for fishing?", "SST_CONDITIONS");
test("ENV04", "What is the temperature?", "SST_CONDITIONS");

test("ENV05", "What is the mixed layer depth?", "MLD_CONDITIONS");
test("ENV06", "Where is the thermocline?", "MLD_CONDITIONS");
test("ENV07", "How deep is the warm water?", "MLD_CONDITIONS");

test("ENV08", "What is the D20 depth?", "D20_CONDITIONS");
test("ENV09", "Where is the d-20?", "D20_CONDITIONS");

test("ENV10", "What is the surface current speed?", "CURRENT_COASTAL_CONDITIONS");
test("ENV11", "How strong are the currents?", "CURRENT_COASTAL_CONDITIONS");
test("ENV12", "Which way is the current moving?", "CURRENT_COASTAL_CONDITIONS");

test("ENV13", "What is the chlorophyll concentration?", "CHLOROPHYLL_ZONE");
test("ENV14", "Is there enough food for fish?", "CHLOROPHYLL_ZONE");
test("ENV15", "Is the water green?", "CHLOROPHYLL_ZONE");

test("AMB01", "What are the current conditions?", "BOAT_SAFETY");
test("AMB02", "What is the current situation?", "BOAT_SAFETY");
test("AMB03", "Is the current strong?", "CURRENT_COASTAL_CONDITIONS");


// 4. Fishing / Productivity
test("F01", "Where should I fish?", "BEST_FISHING_ZONE");
test("F02", "Where can I find good fishing?", "BEST_FISHING_ZONE");
test("F03", "Show me the best fishing area.", "BEST_FISHING_ZONE");
test("F04", "Where is the nearest fishing zone?", "NEAREST_PFZ");
test("F05", "Where should I go for fishing?", "BEST_FISHING_ZONE");
test("F06", "Which zone has better fishing potential?", "BEST_FISHING_ZONE");
test("F07", "Where am I likely to get better fishing?", "BEST_FISHING_ZONE");
test("F08", "Which area looks more productive?", "BEST_FISHING_ZONE");
test("F09", "Which zone has the best conditions for fishing?", "BEST_FISHING_ZONE");
test("F10", "Where is the nearest PFZ?", "NEAREST_PFZ");

// 5. Why / Explanations
test("E01", "Why is this zone recommended?", "WHY_RECOMMENDED");
test("E02", "Why did you recommend this?", "WHY_RECOMMENDED");
test("E03", "Why is this area safer?", "SAFETY_ANALYSIS");
test("E04", "What makes this zone better?", "WHY_RECOMMENDED");
test("E05", "Why is this place not recommended?", "WHY_NOT_RECOMMENDED");
test("E06", "Why is this zone dangerous?", "SAFETY_ANALYSIS");
test("E07", "Why is this zone productive?", "PRODUCTIVITY_ANALYSIS");

// 6. False-positive / Ambiguous / Similar-looking
test("A01", "Is there a cyclone?", "MARINE_ALERT");
test("A02", "What is the current situation?", "BOAT_SAFETY");
test("A03", "How far is it?", "DISTANCE_ANALYSIS");
test("A04", "Why?", "UNKNOWN");
test("A05", "How is safety calculated?", "SAFETY_METHODOLOGY");
test("A06", "How is the score calculated?", "SCORE_BREAKDOWN");
test("A07", "What data is this?", "DATA_SOURCE");
test("A08", "Compare them.", "COMPARE_ZONES");

// 7. Compound / Multi-Intent
test("C01", "Where is the nearest fishing zone and is it safe tomorrow?", ["NEAREST_PFZ", "SAFETY_TOMORROW"]);
test("C02", "What are the wind and wave conditions there?", ["WIND_FORECAST", "WAVE_HEIGHT"]);
test("C03", "What is the SST there and how does it affect fishing?", ["SST_CONDITIONS", "FACTOR_EXPLANATION"]);
test("C04", "Can I fish there tomorrow with my boat and what are the waves?", ["SAFETY_TOMORROW", "WAVE_HEIGHT"]);
test("C05", "Which zone is safest and has the best fishing potential?", ["SAFETY_ANALYSIS", "BEST_FISHING_ZONE"]);
test("C06", "Why is this zone recommended and what are its risks?", ["WHY_RECOMMENDED", "SAFETY_ANALYSIS"]);

console.log(`\n=== RESULTS ===`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
}
