/**
 * ConversationContext — lightweight singleton for conversation continuity.
 *
 * Uses the same module-level singleton pattern as appStore.ts.
 * No external dependencies. Session-only (not persisted to localStorage).
 *
 * Updated ONLY after a successful full pipeline cycle (confirmed context →
 * decision evaluated → response added to chat). Never updated on partial input.
 */

import type { ResolvedContext } from '../services/contextResolver';
import type { DecisionResult } from '../services/decisionEngine';
import type { MarineCandidateResult } from '../services/marineCandidateEvaluator';

export interface ConversationContext {
  /** The raw text of the last successfully completed user query. */
  lastQuery: string | null;
  /** The last detected intent category. */
  lastIntent: string | null;

  /** Location from the last confirmed + evaluated turn. */
  lastLocationId: string | null;
  lastLocationName: string | null;

  /** Date/time from the last confirmed + evaluated turn. */
  lastDateTime: Date | null;
  lastTimeDescription: string | null;

  /** Vessel type from the last confirmed + evaluated turn. */
  lastBoatType: string | null;

  /** Full decision result from the last evaluated turn. */
  lastDecisionResult: DecisionResult | null;

  /** Full resolved context from the last confirmed turn. */
  lastResolvedContext: ResolvedContext | null;

  /** The top-ranked marine candidate from the last decision (null for inland). */
  lastTopCandidate: MarineCandidateResult | null;

  /** The full ranked marine candidate list from the last decision. */
  lastCandidateList: MarineCandidateResult[] | null;

  /** Unix timestamp (ms) of last successful context update. */
  lastUpdatedAt: number | null;
}

const EMPTY_CONTEXT: ConversationContext = {
  lastQuery: null,
  lastIntent: null,
  lastLocationId: null,
  lastLocationName: null,
  lastDateTime: null,
  lastTimeDescription: null,
  lastBoatType: null,
  lastDecisionResult: null,
  lastResolvedContext: null,
  lastTopCandidate: null,
  lastCandidateList: null,
  lastUpdatedAt: null,
};

// Module-level singleton — shared across all component instances in the session.
let globalConversationContext: ConversationContext = { ...EMPTY_CONTEXT };

/**
 * Read the current conversation context.
 * Returns a frozen snapshot; callers must not mutate it.
 */
export function getConversationContext(): Readonly<ConversationContext> {
  return globalConversationContext;
}

/**
 * Commit a successful conversation turn.
 * Call ONLY after the full pipeline (resolve → decide → format → addMessage) succeeds.
 */
export function commitConversationContext(update: {
  query: string;
  intent: string;
  resolvedContext: ResolvedContext;
  decision: DecisionResult;
  preserveCandidateList?: boolean;
}) {
  const { query, intent, resolvedContext, decision, preserveCandidateList } = update;

  const marineRecs = decision.marineRecommendations ?? null;
  const topCandidate = marineRecs && marineRecs.length > 0 ? marineRecs[0] : null;

  globalConversationContext = {
    lastQuery: query,
    lastIntent: intent,
    lastLocationId: resolvedContext.locationId,
    lastLocationName: resolvedContext.locationName,
    lastDateTime: resolvedContext.dateTime,
    lastTimeDescription: resolvedContext.timeDescription,
    lastBoatType: resolvedContext.boatType,
    lastDecisionResult: decision,
    lastResolvedContext: resolvedContext,
    lastTopCandidate: preserveCandidateList ? globalConversationContext.lastTopCandidate : topCandidate,
    lastCandidateList: preserveCandidateList ? globalConversationContext.lastCandidateList : marineRecs,
    lastUpdatedAt: Date.now(),
  };
}

/**
 * Reset the conversation context.
 * Call when Fresh Chat is triggered.
 */
export function resetConversationContext() {
  globalConversationContext = { ...EMPTY_CONTEXT };
}
