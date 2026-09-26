import { getLocationEnvironment } from '../data/environmentResolver';

import { resolveInlandFishingCandidates } from '../data/inlandFishingResolver';
import { selectTopInlandCandidates } from '../data/inlandFishingSelector';
import { resolveInlandFishingConditions } from '../data/inlandFishingConditionResolver';
import { evaluateInlandCandidates, type EvaluatedInlandCandidate } from '../data/inlandFishingEvaluator';
import { getInlandRecommendations } from '../data/inlandFishingRecommendation';
import { evaluateMarineCandidates, type MarineCandidateResult } from './marineCandidateEvaluator';
import { getMarineRecommendations } from '../data/marineFishingRecommendation';

export interface DecisionResult {
  riskBand: 'SAFE' | 'CAUTION' | 'AVOID' | 'INSUFFICIENT_DATA';
  reasons: string[];
  inlandRecommendations?: EvaluatedInlandCandidate[];
  marineRecommendations?: MarineCandidateResult[];
}

export function evaluateFishermanContext(locationId: string, dateTime: Date, vesselType: string, query: string = ""): DecisionResult {
  const currentMonth = dateTime.getMonth(); // 0-11
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  
  const env = getLocationEnvironment(locationId, evalMonth);

  if (!env) {
    return {
      riskBand: 'INSUFFICIENT_DATA',
      reasons: ['No environmental data found for this location and time.']
    };
  }
  
  // If inland, run the inland fishing pipeline
  if (env.waveApplicability === 'not_applicable_inland' || env.fisheriesType === 'inland') {
    const resolverResult = resolveInlandFishingCandidates({ locationId, maxRadiusKm: 200 });
    const selected = selectTopInlandCandidates(resolverResult);
    const conditioned = resolveInlandFishingConditions(selected, dateTime);
    const evaluated = evaluateInlandCandidates(conditioned, vesselType);
    const recommendations = getInlandRecommendations(evaluated);
    
    const reasons = ['Inland location detected. Environmental analysis applied.'];
    
    if (recommendations.length > 0) {
      reasons.push(`Top ${recommendations.length} Recommended Destinations:`);
      recommendations.forEach(r => {
        const distInfo = r.isFallback ? `Fallback: ${r.distanceKm.toFixed(1)} km` : `${r.distanceKm.toFixed(1)} km`;
        reasons.push(`- **${r.spotName}** (${distInfo}) [Risk: ${r.riskBand}] - ${r.suitability}`);
      });
    } else {
      reasons.push('No safe operational inland fishing destinations found nearby.');
    }
    
    return {
      riskBand: recommendations.length > 0 ? recommendations[0].riskBand : 'INSUFFICIENT_DATA',
      reasons,
      inlandRecommendations: recommendations
    };
  }

  // If marine, run the marine fishing pipeline
  // evaluateMarineCandidates already handles the "explicitly named facility" logic
  const evaluated = evaluateMarineCandidates(query, locationId, dateTime, vesselType);
  
  if (evaluated.length === 0) {
    return {
      riskBand: 'INSUFFICIENT_DATA',
      reasons: ['No safe operational marine fishing facilities found nearby.']
    };
  }

  // Use the new recommendation service to get the top 3
  const recommendations = getMarineRecommendations(evaluated);
  
  const marineReasons = ['Marine location detected. Marine safety analysis applied.'];
  
  if (recommendations.length > 0) {
    marineReasons.push(`Top ${recommendations.length} Recommended Marine Destinations:`);
    recommendations.forEach(r => {
      marineReasons.push(`- **${r.facilityName}** (${r.distanceKm.toFixed(1)} km) [Risk: ${r.riskBand}] - ${r.suitability}`);
    });
  } else {
    // Check if we have AVOID candidates
    const avoidCandidates = evaluated.filter(c => c.riskBand === 'AVOID');
    if (avoidCandidates.length > 0) {
      const closestAvoid = avoidCandidates.sort((a, b) => a.distanceKm - b.distanceKm)[0];
      return {
        riskBand: 'AVOID',
        reasons: ['Marine location detected. Severe marine hazard or risk present.', closestAvoid.suitability],
        marineRecommendations: []
      };
    }
    marineReasons.push('No safe operational marine fishing destinations found nearby.');
  }

  return {
    riskBand: recommendations.length > 0 ? recommendations[0].riskBand : 'INSUFFICIENT_DATA',
    reasons: marineReasons,
    marineRecommendations: recommendations
  };
}
