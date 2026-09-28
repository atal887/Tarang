import { resolveFollowUpContext } from './src/services/contextResolver';
import type { ConversationContext } from './src/store/conversationContext';

const mockCtx: ConversationContext = {
  lastQuery: 'Where is the nearest PFZ?', lastIntent: 'NEAREST_PFZ',
  lastLocationId: 'loc_0', lastLocationName: 'Mumbai',
  lastDateTime: new Date('2026-10-01T18:00:00'), lastTimeDescription: 'tomorrow',
  lastBoatType: 'motorized',
  lastDecisionResult: null, lastResolvedContext: null,
  lastTopCandidate: null,
  lastCandidateList: [],
  lastUpdatedAt: Date.now(),
};

console.log(resolveFollowUpContext('What about that one?', mockCtx, 'motorized'));
