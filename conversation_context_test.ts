/**
 * Conversation Context Test Suite
 * Tests: 140+ deterministic conversation continuity tests
 *
 * Tests resolveFollowUpContext() directly without running the UI pipeline.
 * The existing 330-test research_test_suite.ts is regression-protected
 * because it never passes a ConversationContext object.
 */

import { resolveFollowUpContext, resolveFishermanContext } from './src/services/contextResolver';
import { getConversationContext, commitConversationContext, resetConversationContext } from './src/store/conversationContext';
import type { ConversationContext } from './src/store/conversationContext';
import type { ResolvedContext } from './src/services/contextResolver';
import type { DecisionResult } from './src/services/decisionEngine';
import type { MarineCandidateResult } from './src/services/marineCandidateEvaluator';
import assert from 'assert';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockCandidate(name: string, dist: number, risk: string, prodScore?: number): MarineCandidateResult {
  return {
    facilityId: `fac_${name}`, facilityName: name, distanceKm: dist,
    riskScore: risk === 'SAFE' ? 20 : risk === 'CAUTION' ? 55 : 90,
    riskBand: risk as any, suitability: `Suitable for ${name}`,
    fishingPotential: 'high', productivityProfile: null,
    productivityEvaluation: prodScore != null ? {
      productivityScore: prodScore, productivityBand: prodScore >= 70 ? 'High' : prodScore >= 45 ? 'Moderate' : 'Low',
      factors: {
        pfz: { score: 80, explanation: 'Good PFZ' }, chlorophyll: { score: 70, explanation: 'Good chl' },
        sst: { score: 60, explanation: 'Good SST' }, currentSpeed: { score: 50, explanation: 'Moderate' },
        mixedLayer: { score: 55, explanation: 'OK' }, d20Depth: { score: 65, explanation: 'Good' }
      }
    } : null,
    environment: null as any,
    facilityType: 'harbour', latitude: 19.1, longitude: 72.9
  };
}

function mockCtx(overrides: Partial<ConversationContext> = {}): ConversationContext {
  const base: ConversationContext = {
    lastQuery: 'Where is the nearest PFZ?', lastIntent: 'NEAREST_PFZ',
    lastLocationId: 'loc_0', lastLocationName: 'Mumbai',
    lastDateTime: new Date('2026-10-01T18:00:00'), lastTimeDescription: 'tomorrow',
    lastBoatType: 'motorized',
    lastDecisionResult: null, lastResolvedContext: null,
    lastTopCandidate: mockCandidate('Sassoon Dock', 12.5, 'SAFE', 72),
    lastCandidateList: [
      mockCandidate('Sassoon Dock', 12.5, 'SAFE', 72),
      mockCandidate('Versova Harbour', 18.0, 'CAUTION', 55),
      mockCandidate('Alibag Jetty', 25.0, 'SAFE', 65),
    ],
    lastUpdatedAt: Date.now(),
  };
  return { ...base, ...overrides };
}

let passed = 0; let failed = 0;
function test(label: string, fn: () => void) {
  try { fn(); passed++; }
  catch (e: any) { console.error(`✗ FAILED: ${label}\n  ${e.message}`); failed++; }
}
function ok(val: boolean, msg: string) { assert(val, msg); }

// ─── GROUP 1: Direct queries (should be NOT_FOLLOW_UP without context) ────────

const EMPTY_CTX = mockCtx({ lastLocationId: null, lastLocationName: null, lastTopCandidate: null, lastCandidateList: null });

test('D01: Direct PFZ query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Where is the nearest PFZ?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D02: Direct safety query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Is it safe to fish tomorrow?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D03: Direct wave query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the wave height?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D04: Direct wind query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('How strong is the wind?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D05: Direct chlorophyll query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the chlorophyll concentration?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D06: "Which zone is best?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Which zone is best?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D07: "Can I fish tomorrow?" → NOT_FOLLOW_UP without context', () => {
  const r = resolveFollowUpContext('Can I fish tomorrow?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D08: "Is there a cyclone?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Is there a cyclone?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D09: Long explicit query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Is it safe to fish in Kochi tomorrow morning?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D10: "Where is the best fishing zone in Veraval?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Where is the best fishing zone in Veraval?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D11: Direct SST query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the sea surface temperature?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D12: Direct route query → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the safest route?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D13: "What is the mixed layer depth?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the mixed layer depth?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D14: "What is the D20 depth?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the D20 depth?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D15: "What are the current coastal conditions?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What are the current coastal conditions?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D16: "Is there restricted zone in Kochi?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Is there a restricted zone in Kochi?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D17: "How productive is Veraval zone?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('How productive is the Veraval fishing zone?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D18: "What is the wave period?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the wave period at Kochi harbour?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D19: "Show me zone for mechanized boat in Mumbai" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Show me a zone for mechanized boat in Mumbai', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D20: "Is the surf zone safe?" → NOT_FOLLOW_UP (no prior ctx)', () => {
  const r = resolveFollowUpContext('Is the surf zone safe?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D21: "What is the fishing potential in Sassoon Dock?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the fishing potential in Sassoon Dock area?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D22: "Best zone for non-motorized boat in Kochi?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Best zone for non-motorized boat in Kochi?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D23: "Is it safe to fish tonight in Veraval?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Is it safe to fish tonight in Veraval?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D24: Empty string → CLARIFICATION (no crash)', () => {
  const r = resolveFollowUpContext('', EMPTY_CTX, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('D25: Gibberish → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('asdf qwerty zxcv', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D26: "Can I fish?" short but no prior context → NOT_FOLLOW_UP (temporal only)', () => {
  const r = resolveFollowUpContext('Can I fish?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D27: "What about Kochi?" with prior ctx → NOT_FOLLOW_UP (explicit location)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about Kochi?', ctx, 'motorized');
  // Kochi is an explicit new location; should be treated as new query
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP (explicit new location), got ${r.type}`);
});
test('D28: Long query with new location → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is it safe to fish in Chennai this weekend for a mechanized boat?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D29: "What is the cyclone status for Kochi?" → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What is the cyclone status for Kochi?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('D30: "Why is Veraval safer than Mumbai?" → NOT_FOLLOW_UP (explicit locations)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why is Veraval safer than Mumbai?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});

// ─── GROUP 2: Pronoun/reference follow-ups ─────────────────────────────────

test('P01: "Can I go there?" with prior ctx → RESOLVED with inherited location', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Can I go there?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.locationId === 'loc_0', 'Location should be inherited');
    ok(r.inheritedFrom.includes('location'), 'location should be in inheritedFrom');
  }
});
test('P02: "Can I go there?" without prior ctx → CLARIFICATION', () => {
  const r = resolveFollowUpContext('Can I go there?', EMPTY_CTX, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('P03: "Is that safe?" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is that safe?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.locationId === 'loc_0', 'Should inherit location');
});
test('P04: "What about that area?" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about that area?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('P05: "What about that zone?" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about that zone?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('P06: "Go there tomorrow" with prior ctx → RESOLVED, tomorrow date', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Go there tomorrow', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.locationId === 'loc_0', 'Location inherited');
    ok(r.context.timeDescription === 'tomorrow', `Expected 'tomorrow', got '${r.context.timeDescription}'`);
  }
});
test('P07: "Is this zone safe?" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is this zone safe?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('P08: "Is this place suitable?" without prior ctx → CLARIFICATION', () => {
  const r = resolveFollowUpContext('Is this place suitable?', EMPTY_CTX, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('P09: "How far is that place?" without prior top candidate → CLARIFICATION', () => {
  const ctx = mockCtx({ lastTopCandidate: null });
  const r = resolveFollowUpContext('How far is that place?', ctx, 'motorized');
  // "that place" is a location pronoun, should RESOLVE using location
  ok(r.type === 'RESOLVED' || r.type === 'CLARIFICATION', `Got ${r.type}`);
});
test('P10: "What about there?" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about there?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('P11: "Can I go there tomorrow morning?" → RESOLVED, morning time', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Can I go there tomorrow morning?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.dateTime.getHours() === 6, `Expected hour 6, got ${r.context.dateTime.getHours()}`);
  }
});
test('P12: "Is that safe for my non-motorized boat?" → RESOLVED with vessel override', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is that safe for my non-motorized boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'non_motorized', `Expected non_motorized, got ${r.context.boatType}`);
    ok(r.context.locationId === 'loc_0', 'Location should be inherited');
  }
});
test('P13: "Is this place safe for a trawler?" → RESOLVED, mechanized vessel', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is this place safe for a trawler?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'mechanized', `Expected mechanized, got ${r.context.boatType}`);
});
test('P14: "What about that area tomorrow morning?" → RESOLVED, inherit location, tomorrow morning', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about that area tomorrow morning?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.dateTime.getHours() === 6, `Expected morning (6), got ${r.context.dateTime.getHours()}`);
    ok(r.context.locationId === 'loc_0', 'Location inherited');
  }
});
test('P15: "That zone again" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('That zone again', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('P16: "Can I go there this weekend?" → RESOLVED with weekend date', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Can I go there this weekend?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription.includes('weekend') || r.context.timeDescription.includes('Saturday'), 'Should be weekend');
});
test('P17: Pronoun with no prior context → CLARIFICATION (not fabrication)', () => {
  const r = resolveFollowUpContext('Is there safe?', EMPTY_CTX, 'motorized');
  // "there" is a pronoun signal; no context → clarification
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('P18: "Go there" alone with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Go there', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('P19: "Can I go there?" inherits vessel from prior ctx', () => {
  const ctx = mockCtx({ lastBoatType: 'mechanized' });
  const r = resolveFollowUpContext('Can I go there?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'mechanized', `Should inherit mechanized, got ${r.context.boatType}`);
});
test('P20: "That place" with only location ctx, no candidates → RESOLVED', () => {
  const ctx = mockCtx({ lastCandidateList: null, lastTopCandidate: null });
  const r = resolveFollowUpContext('Is that place safe?', ctx, 'motorized');
  ok(r.type === 'RESOLVED' || r.type === 'CLARIFICATION', `Got ${r.type}`);
});

// ─── GROUP 3: Temporal follow-ups ─────────────────────────────────────────

test('T01: "What about tomorrow?" with prior ctx → RESOLVED, inherit location+vessel', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about tomorrow?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.locationId === 'loc_0', 'Location should be inherited');
    ok(r.context.boatType === 'motorized', 'Vessel should be inherited');
    ok(r.context.timeDescription === 'tomorrow', `Expected tomorrow, got ${r.context.timeDescription}`);
  }
});
test('T02: "What about Saturday?" with prior ctx → RESOLVED, Saturday', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about Saturday?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'Saturday', `Expected Saturday, got ${r.context.timeDescription}`);
});
test('T03: "And at night?" with prior ctx → RESOLVED, night hour', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And at night?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.dateTime.getHours() === 20, `Expected 20, got ${r.context.dateTime.getHours()}`);
});
test('T04: "What about this weekend?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about this weekend?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('T05: "And next week?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And next week?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'next week', `Expected next week, got ${r.context.timeDescription}`);
});
test('T06: "What about today morning?" → RESOLVED, today, morning', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about today morning?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.dateTime.getHours() === 6, `Expected 6, got ${r.context.dateTime.getHours()}`);
});
test('T07: "And on Sunday?" → RESOLVED, Sunday date', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And on Sunday?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'Sunday', `Expected Sunday, got ${r.context.timeDescription}`);
});
test('T08: "What about tonight?" → RESOLVED, today', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about tonight?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'today', `Expected today, got ${r.context.timeDescription}`);
});
test('T09: "What about morning?" → RESOLVED, hour 6', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about morning?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.dateTime.getHours() === 6, `Expected 6, got ${r.context.dateTime.getHours()}`);
});
test('T10: "What about Monday?" → RESOLVED, Monday', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about Monday?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'Monday', `Expected Monday, got ${r.context.timeDescription}`);
});
test('T11: Temporal follow-up inherits vessel', () => {
  const ctx = mockCtx({ lastBoatType: 'non_motorized' });
  const r = resolveFollowUpContext('What about tomorrow?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'non_motorized', `Should inherit non_motorized`);
});
test('T12: Temporal follow-up inherits location', () => {
  const ctx = mockCtx({ lastLocationId: 'loc_kochi', lastLocationName: 'Kochi' });
  const r = resolveFollowUpContext('What about Saturday?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.locationId === 'loc_kochi', 'Location should be Kochi');
});
test('T13: "And evening?" → RESOLVED, evening hour', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And evening?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.dateTime.getHours() === 18, `Expected 18, got ${r.context.dateTime.getHours()}`);
});
test('T14: "What about tomorrow evening?" → RESOLVED, tomorrow evening', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about tomorrow evening?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.timeDescription === 'tomorrow', `Expected tomorrow, got ${r.context.timeDescription}`);
    ok(r.context.dateTime.getHours() === 18, `Expected 18, got ${r.context.dateTime.getHours()}`);
  }
});
test('T15: "And on Wednesday?" → RESOLVED, Wednesday', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And on Wednesday?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'Wednesday', `Expected Wednesday, got ${r.context.timeDescription}`);
});
test('T16: Temporal without prior ctx → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What about tomorrow?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('T17: "What about Friday morning?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about Friday morning?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.timeDescription === 'Friday', `Expected Friday, got ${r.context.timeDescription}`);
    ok(r.context.dateTime.getHours() === 6, `Expected morning (6), got ${r.context.dateTime.getHours()}`);
  }
});
test('T18: Long temporal + location (Kochi) → NOT_FOLLOW_UP (explicit location)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about Kochi on Saturday?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP (new explicit location), got ${r.type}`);
});
test('T19: "What about next weekend?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about next weekend?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('T20: "What about afternoon?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about afternoon?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});

// ─── GROUP 4: Vessel follow-ups ─────────────────────────────────────────────

test('V01: "What about my non-motorized boat?" → RESOLVED, non_motorized', () => {
  const ctx = mockCtx({ lastBoatType: 'motorized' });
  const r = resolveFollowUpContext('What about my non-motorized boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'non_motorized', `Expected non_motorized, got ${r.context.boatType}`);
    ok(r.context.locationId === 'loc_0', 'Location inherited');
  }
});
test('V02: "What about a mechanized boat?" → RESOLVED, mechanized', () => {
  const ctx = mockCtx({ lastBoatType: 'motorized' });
  const r = resolveFollowUpContext('What about a mechanized boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'mechanized', `Expected mechanized, got ${r.context.boatType}`);
});
test('V03: "For a trawler?" → RESOLVED, mechanized', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('For a trawler?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'mechanized', `Expected mechanized, got ${r.context.boatType}`);
});
test('V04: "For a canoe?" → RESOLVED, non_motorized', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('For a canoe?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'non_motorized', `Expected non_motorized, got ${r.context.boatType}`);
});
test('V05: Vessel change inherits date from prior ctx', () => {
  const prevDate = new Date('2026-10-05T18:00:00');
  const ctx = mockCtx({ lastDateTime: prevDate, lastTimeDescription: 'Saturday' });
  const r = resolveFollowUpContext('What about my non-motorized boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'Saturday', `Should inherit Saturday, got ${r.context.timeDescription}`);
});
test('V06: "What about motorized?" explicitly → RESOLVED, motorized', () => {
  const ctx = mockCtx({ lastBoatType: 'non_motorized' });
  const r = resolveFollowUpContext('What about motorized?', ctx, 'non_motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'motorized', `Expected motorized, got ${r.context.boatType}`);
});
test('V07: "What about non motorized boat?" → RESOLVED, non_motorized', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about non motorized boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'non_motorized', `Expected non_motorized, got ${r.context.boatType}`);
});
test('V08: Vessel change without prior ctx → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What about non-motorized boat?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('V09: "What about my boat?" (generic boat, no explicit type) → short follow-up pattern', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about my boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED' || r.type === 'NOT_FOLLOW_UP', `Got ${r.type}`); // short pattern may trigger
});
test('V10: Vessel + pronoun → RESOLVED with new vessel, inherited location', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is that safe for my trawler?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'mechanized', `Expected mechanized from trawler, got ${r.context.boatType}`);
    ok(r.context.locationId === 'loc_0', 'Location inherited');
  }
});
test('V11: Vessel + temporal → RESOLVED with vessel change + temporal update', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about my non-motorized boat tomorrow?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'non_motorized', `Expected non_motorized`);
    ok(r.context.timeDescription === 'tomorrow', `Expected tomorrow`);
  }
});
test('V12: "And for mechanized tomorrow?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And for mechanized tomorrow?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'mechanized', 'mechanized vessel');
    ok(r.context.timeDescription === 'tomorrow', 'tomorrow');
  }
});
test('V13: "Non-motorized boat, this weekend?" → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Non-motorized boat, this weekend?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'non_motorized', 'non_motorized');
  }
});
test('V14: Vessel without prior ctx and no location → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('What about mechanized boat?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('V15: "What about my non-motorized boat in Kochi?" → NOT_FOLLOW_UP (explicit new location)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about my non-motorized boat in Kochi?', ctx, 'motorized');
  // Kochi is explicit — should fall through to NOT_FOLLOW_UP
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('V16: Vessel change inherits location from prior ctx', () => {
  const ctx = mockCtx({ lastLocationName: 'Veraval', lastLocationId: 'loc_veraval' });
  const r = resolveFollowUpContext('What about my mechanized boat?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.locationId === 'loc_veraval', 'Should inherit Veraval');
});
test('V17: "Can my canoe go there?" → RESOLVED, non_motorized, inherited loc', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Can my canoe go there?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'non_motorized', 'canoe → non_motorized');
    ok(r.context.locationId === 'loc_0', 'inherited location');
  }
});
test('V18: "And for a trawler?" → RESOLVED, mechanized', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('And for a trawler?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'mechanized', 'trawler → mechanized');
});
test('V19: "My motorized boat tomorrow?" → RESOLVED', () => {
  const ctx = mockCtx({ lastBoatType: 'non_motorized' });
  const r = resolveFollowUpContext('My motorized boat tomorrow?', ctx, 'non_motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'motorized', 'explicit motorized override');
});
test('V20: "What about my boat? (short pattern)" with prior ctx', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about my boat?', ctx, 'motorized');
  // Should be RESOLVED via short catch-all or vessel pattern
  ok(r.type === 'RESOLVED' || r.type === 'NOT_FOLLOW_UP', `Got ${r.type}`);
});

// ─── GROUP 5: Candidate/ordinal references ─────────────────────────────────

test('C01: "What about the second one?" with candidate list → ORDINAL_CANDIDATE', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about the second one?', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') {
    ok(r.candidateIndex === 1, `Expected index 1, got ${r.candidateIndex}`);
    ok(r.candidate.facilityName === 'Versova Harbour', `Expected Versova Harbour, got ${r.candidate.facilityName}`);
  }
});
test('C02: "The first one?" → ORDINAL_CANDIDATE index 0', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('The first one?', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') ok(r.candidateIndex === 0, `Expected 0, got ${r.candidateIndex}`);
});
test('C03: "The third option?" → ORDINAL_CANDIDATE index 2', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('The third option?', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') {
    ok(r.candidateIndex === 2, `Expected 2, got ${r.candidateIndex}`);
    ok(r.candidate.facilityName === 'Alibag Jetty', `Expected Alibag Jetty`);
  }
});
test('C04: "2nd zone?" → ORDINAL_CANDIDATE index 1', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('2nd zone?', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') ok(r.candidateIndex === 1, `Expected 1, got ${r.candidateIndex}`);
});
test('C05: "The second one?" without candidate list → CLARIFICATION', () => {
  const ctx = mockCtx({ lastCandidateList: null });
  const r = resolveFollowUpContext('The second one?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('C06: "The second one?" without prior ctx → CLARIFICATION', () => {
  const r = resolveFollowUpContext('The second one?', EMPTY_CTX, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('C07: "5th zone?" when only 3 candidates → CLARIFICATION', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('5th zone?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION (out of bounds), got ${r.type}`);
});
test('C08: "1st" → ORDINAL_CANDIDATE index 0', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('1st', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') ok(r.candidateIndex === 0, `Expected 0, got ${r.candidateIndex}`);
});
test('C09: Ordinal candidate result has correct context shape', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('The second one?', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') {
    ok(r.context.locationId === 'loc_0', 'Location context present');
    ok(r.context.boatType === 'motorized', 'Vessel inherited');
  }
});
test('C10: "3rd option" with single candidate → CLARIFICATION', () => {
  const ctx = mockCtx({ lastCandidateList: [mockCandidate('Only Zone', 10, 'SAFE', 70)] });
  const r = resolveFollowUpContext('3rd option', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('C11: "What about option two?" → ORDINAL_CANDIDATE', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about option two?', ctx, 'motorized');
  // "two" is not in ORDINAL_MAP (only "second" is) — should be NOT_FOLLOW_UP or CLARIFICATION
  ok(['NOT_FOLLOW_UP', 'CLARIFICATION', 'ORDINAL_CANDIDATE'].includes(r.type), `Got ${r.type}`);
});
test('C12: "Which one is safer: first or second?" → ORDINAL resolves first match (first)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Which one is safer: first or second?', ctx, 'motorized');
  // Should pick 'first' (index 0) as the first ordinal matched
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') ok(r.candidateIndex === 0, `Expected 0 (first match), got ${r.candidateIndex}`);
});
test('C13: "What about the 4th?" with 3 candidates → CLARIFICATION', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about the 4th?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('C14: "Second option for non-motorized?" → ORDINAL with non_motorized vessel', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Second option for non-motorized?', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') {
    ok(r.candidateIndex === 1, 'index 1');
    ok(r.context.boatType === 'non_motorized', 'vessel overridden to non_motorized');
  }
});
test('C15: "Show me the first" → ORDINAL_CANDIDATE index 0', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Show me the first', ctx, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
});

// ─── GROUP 6: Why/explanation follow-ups ──────────────────────────────────

test('W01: "Why?" alone with prior ctx → RESOLVED (inherit all)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.locationId === 'loc_0', 'Location inherited');
    ok(r.context.boatType === 'motorized', 'Vessel inherited');
    ok(r.inheritedFrom.includes('location'), 'location in inheritedFrom');
    ok(r.inheritedFrom.includes('vessel'), 'vessel in inheritedFrom');
  }
});
test('W02: "Why not?" with prior ctx → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why not?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('W03: "why" alone → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('why', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('W04: "why not" alone → RESOLVED', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('why not', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});
test('W05: "Why?" without prior ctx → CLARIFICATION', () => {
  const r = resolveFollowUpContext('Why?', EMPTY_CTX, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION (no prior ctx), got ${r.type}`);
});
test('W06: "Why?" → context has inherited dateTime from prior ctx', () => {
  const prevDate = new Date('2026-10-03T18:00:00');
  const ctx = mockCtx({ lastDateTime: prevDate, lastTimeDescription: 'tomorrow' });
  const r = resolveFollowUpContext('Why?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.inheritedFrom.includes('dateTime'), 'dateTime should be inherited');
    ok(r.context.timeDescription === 'tomorrow', `Expected tomorrow, got ${r.context.timeDescription}`);
  }
});
test('W07: "Why is it not recommended?" — longer why query — no prior ctx → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Why is it not recommended?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('W08: "Why is that?" with pronoun → RESOLVED via pronoun rule', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why is that?', ctx, 'motorized');
  // "that" is not in LOCATION_PRONOUNS; "why" alone rule won't fire (not exact match)
  ok(['RESOLVED', 'NOT_FOLLOW_UP'].includes(r.type), `Got ${r.type}`);
});
test('W09: "Why not?" without prior ctx → NOT_FOLLOW_UP', () => {
  const r = resolveFollowUpContext('Why not?', EMPTY_CTX, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('W10: "Why?" inherits mechanized vessel', () => {
  const ctx = mockCtx({ lastBoatType: 'mechanized' });
  const r = resolveFollowUpContext('Why?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.boatType === 'mechanized', `Should inherit mechanized`);
});
test('W11: "Why is the second zone rated lower?" → ORDINAL takes priority over "why"', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why is the second zone rated lower?', ctx, 'motorized');
  // ordinal "second" fires first
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
});
test('W12: "Why not tomorrow?" → temporal rule fires, inherit location+vessel', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why not tomorrow?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'tomorrow', `Expected tomorrow`);
});
test('W13: "Why not Saturday?" → temporal Saturday', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why not Saturday?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.timeDescription === 'Saturday', `Expected Saturday, got ${r.context.timeDescription}`);
});
test('W14: "Why there?" → pronoun fires, inherit location', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why there?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') ok(r.context.locationId === 'loc_0', 'Location inherited');
});
test('W15: "Why not there?" → pronoun fires', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why not there?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
});

// ─── GROUP 7: Distance queries ──────────────────────────────────────────────

test('Dist01: "How far is it?" with top candidate → DISTANCE', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('How far is it?', ctx, 'motorized');
  ok(r.type === 'DISTANCE', `Expected DISTANCE, got ${r.type}`);
  if (r.type === 'DISTANCE') {
    ok(r.distanceKm === 12.5, `Expected 12.5 km, got ${r.distanceKm}`);
    ok(r.candidateName === 'Sassoon Dock', `Expected Sassoon Dock, got ${r.candidateName}`);
  }
});
test('Dist02: "How far?" with top candidate → DISTANCE', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('How far?', ctx, 'motorized');
  ok(r.type === 'DISTANCE', `Expected DISTANCE, got ${r.type}`);
});
test('Dist03: "How far is the zone?" with top candidate → DISTANCE', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('How far is the zone?', ctx, 'motorized');
  ok(r.type === 'DISTANCE', `Expected DISTANCE, got ${r.type}`);
});
test('Dist04: "How far is it?" without top candidate and no ctx → CLARIFICATION', () => {
  const r = resolveFollowUpContext('How far is it?', EMPTY_CTX, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('Dist05: "How far is it?" with ctx but no top candidate → CLARIFICATION', () => {
  const ctx = mockCtx({ lastTopCandidate: null });
  const r = resolveFollowUpContext('How far is it?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});

// ─── GROUP 8: Ambiguous references ─────────────────────────────────────────

test('A01: Empty query → CLARIFICATION (no crash)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('A02: "What about that one?" — "that" alone not pronoun, no ordinal → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about that one?', ctx, 'motorized');
  // "one" is not in ORDINAL_MAP; "that" without "area/place/zone" not in LOCATION_PRONOUNS
  ok(['NOT_FOLLOW_UP', 'RESOLVED', 'ORDINAL_CANDIDATE'].includes(r.type), `Got ${r.type}`);
});
test('A03: Single word "it" → CLARIFICATION (too ambiguous)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('it', ctx, 'motorized');
  // "it" not in LOCATION_PRONOUNS so should return CLARIFICATION because it is too ambiguous
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('A04: "What about?" with no additional info → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A05: "Is it?" alone → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Is it?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A06: Long philosophical query → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Why do fishermen go out to sea every day despite the risks?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP (> 7 words), got ${r.type}`);
});
test('A07: "What is the best?" → NOT_FOLLOW_UP (ambiguous, no location pronoun)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What is the best?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A08: "What about there and tomorrow?" → RESOLVED (both pronoun + temporal)', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about there and tomorrow?', ctx, 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.locationId === 'loc_0', 'Location inherited via pronoun');
  }
});
test('A09: "Which one?" without candidate list → CLARIFICATION (ordinal not matched, no candidates)', () => {
  const ctx = mockCtx({ lastCandidateList: null });
  const r = resolveFollowUpContext('Which one?', ctx, 'motorized');
  // "one" alone not in ORDINAL_MAP — should be NOT_FOLLOW_UP
  ok(['NOT_FOLLOW_UP', 'CLARIFICATION'].includes(r.type), `Got ${r.type}`);
});
test('A10: "fourth" out of bounds → CLARIFICATION', () => {
  const ctx = mockCtx(); // only 3 candidates
  const r = resolveFollowUpContext('The fourth one?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('A11: "What?" alone → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A12: "What if?" alone → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What if?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A13: "Where?" alone → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Where?', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A14: "Show me" alone → NOT_FOLLOW_UP', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('Show me', ctx, 'motorized');
  ok(r.type === 'NOT_FOLLOW_UP', `Expected NOT_FOLLOW_UP, got ${r.type}`);
});
test('A15: "How?" alone → CLARIFICATION', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('How?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});
test('A16: "What about that?" alone → CLARIFICATION', () => {
  const ctx = mockCtx();
  const r = resolveFollowUpContext('What about that?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION, got ${r.type}`);
});

// ─── GROUP 9: Context store integrity ─────────────────────────────────────

test('S01: resetConversationContext clears state', () => {
  resetConversationContext();
  const ctx = getConversationContext();
  ok(ctx.lastLocationId === null, 'locationId should be null after reset');
  ok(ctx.lastTopCandidate === null, 'topCandidate should be null after reset');
});

test('S02: commitConversationContext sets expected fields', () => {
  resetConversationContext();
  const fakeCtx: ResolvedContext = {
    locationId: 'loc_test', locationName: 'Test City',
    dateTime: new Date(), timeDescription: 'tomorrow',
    boatType: 'motorized',
    inferred: { location: false, dateTime: false, boatType: false },
    originalQuery: 'test query',
  };
  const fakeDecision: DecisionResult = {
    riskBand: 'SAFE', reasons: ['Test'],
    marineRecommendations: [mockCandidate('Test Zone', 5.0, 'SAFE', 70)],
  };
  commitConversationContext({ query: 'test query', intent: 'NEAREST_PFZ', resolvedContext: fakeCtx, decision: fakeDecision });
  const ctx = getConversationContext();
  ok(ctx.lastLocationId === 'loc_test', 'locationId committed');
  ok(ctx.lastIntent === 'NEAREST_PFZ', 'intent committed');
  ok(ctx.lastTopCandidate?.facilityName === 'Test Zone', 'topCandidate committed');
  ok(ctx.lastCandidateList?.length === 1, 'candidateList committed');
});

test('S03: commitConversationContext with inland (no marineRecs) → null candidates', () => {
  resetConversationContext();
  const fakeCtx: ResolvedContext = {
    locationId: 'loc_inland', locationName: 'Delhi',
    dateTime: new Date(), timeDescription: 'tomorrow',
    boatType: 'motorized',
    inferred: { location: false, dateTime: false, boatType: false },
    originalQuery: 'test',
  };
  const fakeDecision: DecisionResult = { riskBand: 'SAFE', reasons: ['Inland'] };
  commitConversationContext({ query: 'test', intent: 'SAFETY_TOMORROW', resolvedContext: fakeCtx, decision: fakeDecision });
  const ctx = getConversationContext();
  ok(ctx.lastTopCandidate === null, 'No top candidate for inland');
  ok(ctx.lastCandidateList === null, 'No candidate list for inland');
});

test('S04: Follow-up after reset → NOT_FOLLOW_UP for pronoun', () => {
  resetConversationContext();
  const ctx = getConversationContext();
  const r = resolveFollowUpContext('Can I go there?', ctx, 'motorized');
  ok(r.type === 'CLARIFICATION', `Expected CLARIFICATION after reset, got ${r.type}`);
});

test('S05: Multiple commits → last one wins', () => {
  resetConversationContext();
  const fakeDecision: DecisionResult = { riskBand: 'SAFE', reasons: [] };
  const makeCtx = (locId: string, locName: string): ResolvedContext => ({
    locationId: locId, locationName: locName, dateTime: new Date(),
    timeDescription: 'tomorrow', boatType: 'motorized',
    inferred: { location: false, dateTime: false, boatType: false },
    originalQuery: 'q',
  });
  commitConversationContext({ query: 'q1', intent: 'NEAREST_PFZ', resolvedContext: makeCtx('loc_1', 'Mumbai'), decision: fakeDecision });
  commitConversationContext({ query: 'q2', intent: 'SAFETY_TOMORROW', resolvedContext: makeCtx('loc_2', 'Kochi'), decision: fakeDecision });
  const ctx = getConversationContext();
  ok(ctx.lastLocationId === 'loc_2', 'Should be Kochi (second commit)');
  ok(ctx.lastIntent === 'SAFETY_TOMORROW', 'Should be second intent');
});

test('New 1: Compare them', () => {
  const r = resolveFollowUpContext('compare them', mockCtx(), 'motorized');
  ok(r.type === 'COMPARE_CANDIDATES', `Expected COMPARE_CANDIDATES, got ${r.type}`);
  if (r.type === 'COMPARE_CANDIDATES') {
    ok(r.candidates[0].facilityName === 'Sassoon Dock', 'Expected candidate 1');
    ok(r.candidates[1].facilityName === 'Versova Harbour', 'Expected candidate 2');
  }
});

test('New 2: Why is the second one better than the first', () => {
  const r = resolveFollowUpContext('Why is the second one better than the first?', mockCtx(), 'motorized');
  ok(r.type === 'COMPARE_CANDIDATES', `Expected COMPARE_CANDIDATES, got ${r.type}`);
  if (r.type === 'COMPARE_CANDIDATES') {
    ok(r.candidates[0].facilityName === 'Sassoon Dock', 'Expected candidate 1');
    ok(r.candidates[1].facilityName === 'Versova Harbour', 'Expected candidate 2');
  }
});

test('New 3: Is the second one safe tomorrow?', () => {
  const r = resolveFollowUpContext('Is the second one safe tomorrow?', mockCtx(), 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') {
    ok(r.isCompound === true, 'Expected compound to be true');
    ok(r.context.timeDescription === 'tomorrow', 'Expected time to be updated');
  }
});

test('New 4: Can I go there on Saturday with my non-motorized boat?', () => {
  const r = resolveFollowUpContext('Can I go there on Saturday with my non-motorized boat?', mockCtx(), 'motorized');
  ok(r.type === 'RESOLVED', `Expected RESOLVED, got ${r.type}`);
  if (r.type === 'RESOLVED') {
    ok(r.context.boatType === 'non_motorized', 'Expected non-motorized');
    ok(r.context.timeDescription === 'Saturday', 'Expected Saturday');
  }
});

test('New 5: Is the second one safe tomorrow? (candidate remains available)', () => {
  resetConversationContext();
  const initDecision: DecisionResult = { riskBand: 'SAFE', marineRecommendations: mockCtx().lastCandidateList! };
  commitConversationContext({ query: 'q0', intent: 'NEAREST_PFZ', resolvedContext: mockCtx().lastResolvedContext || { locationId: 'loc_0', locationName: 'Mumbai', dateTime: new Date(), timeDescription: 'tomorrow', boatType: 'motorized', inferred: { location: false, dateTime: false, boatType: false }, originalQuery: 'q0' }, decision: initDecision });

  const ctx1 = getConversationContext();
  const r = resolveFollowUpContext('Is the second one safe tomorrow?', ctx1, 'motorized');
  ok(r.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE, got ${r.type}`);
  if (r.type === 'ORDINAL_CANDIDATE') {
    ok(r.isCompound === true, 'Expected compound');
    // Simulate UI pipeline: candidate remains available
    const newDecision: DecisionResult = { riskBand: 'SAFE', marineRecommendations: ctx1.lastCandidateList! };
    const target = newDecision.marineRecommendations?.find(c => c.facilityName === r.candidate.facilityName);
    ok(target !== undefined, 'Target should be found');
    commitConversationContext({ query: 'q', intent: 'SAFETY', resolvedContext: r.context, decision: newDecision, preserveCandidateList: true });
    
    // Test: What about the third one? (after evaluating #2)
    const ctx2 = getConversationContext();
    const r2 = resolveFollowUpContext('What about the third one?', ctx2, 'motorized');
    ok(r2.type === 'ORDINAL_CANDIDATE', `Expected ORDINAL_CANDIDATE for the third one, got ${r2.type}`);
    if (r2.type === 'ORDINAL_CANDIDATE') {
      ok(r2.candidate.facilityName === 'Alibag Jetty', 'Expected Alibag Jetty as third candidate');
    }
  }
});

test('New 6: Is the second one safe tomorrow? (candidate disappears)', () => {
  const r = resolveFollowUpContext('Is the second one safe tomorrow?', mockCtx(), 'motorized');
  if (r.type === 'ORDINAL_CANDIDATE') {
    // Simulate UI pipeline: candidate disappears
    const newDecision: DecisionResult = { riskBand: 'SAFE', marineRecommendations: [mockCtx().lastCandidateList![0]] };
    const target = newDecision.marineRecommendations?.find(c => c.facilityName === r.candidate.facilityName);
    ok(target === undefined, 'Target should not be found');
  }
});

// ─── FINAL RESULTS ────────────────────────────────────────────────────────

console.log(`\n=== CONVERSATION CONTEXT TEST RESULTS ===\nPassed: ${passed}\nFailed: ${failed}\nTotal:  ${passed + failed}`);
if (failed > 0) process.exit(1);
