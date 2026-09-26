import { type InlandFishingResult, type ResolvedInlandCandidate } from './inlandFishingResolver';

export interface SelectedInlandCandidate extends ResolvedInlandCandidate {
  isFallback: boolean;
}

export function selectTopInlandCandidates(
  result: InlandFishingResult
): SelectedInlandCandidate[] {
  let candidates: ResolvedInlandCandidate[] = [];
  let isFallback = false;

  // 1. If we have nearby operational candidates, use those. 
  // Otherwise, use the nearest overall as fallbacks.
  if (result.hasNearbyCandidates && result.candidatesWithinRadius.length > 0) {
    candidates = result.candidatesWithinRadius;
  } else {
    candidates = result.nearestOverall;
    isFallback = true;
  }

  // 2. Prioritize by shorter distance
  // (Resolver already sorts by distance, but we re-sort to guarantee)
  const sortedCandidates = [...candidates].sort((a, b) => a.distanceKm - b.distanceKm);

  // 3. Select up to 3 candidates
  const top3 = sortedCandidates.slice(0, 3);

  // 4. Preserve all evidence fields and inject fallback status
  return top3.map(candidate => ({
    ...candidate,
    isFallback
  }));
}
