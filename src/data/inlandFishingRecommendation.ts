import { type EvaluatedInlandCandidate } from './inlandFishingEvaluator';

export function getInlandRecommendations(
  candidates: EvaluatedInlandCandidate[]
): EvaluatedInlandCandidate[] {
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

  // Helper for fishing potential rank (Higher is better)
  const getPfzRank = (pfz: string | null) => {
    if (pfz === 'high') return 3;
    if (pfz === 'moderate') return 2;
    if (pfz === 'low') return 1;
    return 0;
  };

  // Helper for evidence class rank (Higher is better)
  const getEvidenceRank = (ec: string) => {
    if (ec === 'documented_fishing_or_access_evidence') return 2;
    if (ec === 'documented_fisheries_resource') return 1;
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

    // 3rd: Higher fishing potential is better
    const pfzDiff = getPfzRank(b.fishingPotential) - getPfzRank(a.fishingPotential);
    if (pfzDiff !== 0) return pfzDiff;

    // 4th: Stronger evidence is better
    const ecDiff = getEvidenceRank(b.evidenceClass) - getEvidenceRank(a.evidenceClass);
    if (ecDiff !== 0) return ecDiff;

    // 5th: Shorter distance is better
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });

  // 3. Return top 3 maximum
  return suitable.slice(0, 3);
}
