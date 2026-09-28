import { type MarineCandidateResult } from '../services/marineCandidateEvaluator';

export function getMarineRecommendations(
  candidates: MarineCandidateResult[]
): MarineCandidateResult[] {
  // 1. Exclude AVOID and INSUFFICIENT_DATA candidates
  const suitable = candidates.filter(c => 
    c.riskBand !== 'AVOID' && c.riskBand !== 'INSUFFICIENT_DATA'
  );

  // Helper for risk band rank (Higher is better)
  const getBandRank = (band: string) => {
    if (band === 'SAFE') return 2;
    if (band === 'CAUTION') return 1;
    return 0;
  };

  // 2. Sort candidates
  suitable.sort((a, b) => {
    // 1st: SAFE over CAUTION
    const bandDiff = getBandRank(b.riskBand) - getBandRank(a.riskBand);
    if (bandDiff !== 0) return bandDiff;

    // 2nd: Lower risk score is better
    const scoreA = a.riskScore ?? 0;
    const scoreB = b.riskScore ?? 0;
    const scoreDiff = scoreA - scoreB;
    if (Math.abs(scoreDiff) > 0.01) return scoreDiff;

    // 3rd: Higher productivity score is better
    const prodA = a.productivityEvaluation?.productivityScore ?? 0;
    const prodB = b.productivityEvaluation?.productivityScore ?? 0;
    const prodDiff = prodB - prodA;
    if (prodDiff !== 0) return prodDiff;

    // 4th: Shorter distance is better
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });

  // 3. Return top 3 maximum
  return suitable.slice(0, 3);
}
