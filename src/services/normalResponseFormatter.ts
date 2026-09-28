import { type IntentCategory } from '../data/questionBank';
import { type DecisionResult } from './decisionEngine';
import { type ResolvedContext } from './contextResolver';
import { getLocationEnvironment } from '../data/environmentResolver';

export function formatNormalResponse(
  intent: IntentCategory,
  context: ResolvedContext,
  decision: DecisionResult
): string {
  // If the decision engine explicitly triggered a fallback consent prompt, return the reason immediately.
  if (decision.requiresFallbackConsent && decision.reasons.length > 0) {
    return decision.reasons[0];
  }

  // Common variables
  const currentMonth = context.dateTime.getMonth();
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  const env = getLocationEnvironment(context.locationId, evalMonth);

  const isMarine = env?.waveApplicability !== 'not_applicable_inland' && env?.fisheriesType !== 'inland';
  const hasMarineRecs = decision.marineRecommendations && decision.marineRecommendations.length > 0;
  const hasInlandRecs = decision.inlandRecommendations && decision.inlandRecommendations.length > 0;
  
  const topMarine = hasMarineRecs ? decision.marineRecommendations![0] : null;

  // Handle Productivity Intents
  if (intent === 'NEAREST_PFZ' || intent === 'BEST_FISHING_ZONE' || intent === 'CHLOROPHYLL_ZONE') {
    if (isMarine) {
      if (topMarine && topMarine.productivityEvaluation) {
        const prod = topMarine.productivityEvaluation;
        const factors = [];
        if (prod.factors.pfz.score > 50) factors.push("strong historical PFZ patterns");
        if (prod.factors.chlorophyll.score > 50) factors.push("favourable chlorophyll levels");
        if (prod.factors.sst.score > 50) factors.push("optimal sea surface temperatures");
        
        let factorsText = "";
        if (factors.length > 0) factorsText = ` This is driven by ${factors.join(" and ")}.`;
        
        return `The best nearby marine option is **${topMarine.facilityName}** with a Fishing Potential of **${prod.productivityScore}/100** (${prod.productivityBand}).${factorsText}`;
      }
      if (topMarine) {
        return `The best nearby marine option is **${topMarine.facilityName}**. Productivity data is currently unavailable.`;
      }
      return "No suitable marine fishing zones could be found based on your current location and safety conditions.";
    } else {
      // Inland
      let response = "Marine Potential Fishing Zone (PFZ) and productivity data is not applicable for inland locations.";
      if (hasInlandRecs) {
        response += " However, here are the safest inland fishing options nearby.";
      } else {
        response += " Additionally, no suitable inland fishing zones could be found based on your current location and safety conditions.";
      }
      return response;
    }
  }

  // Handle specific Environmental / Risk Intents
  switch (intent) {
    case 'SAFETY_TOMORROW':
    case 'WEEKEND_FISHING':
      return `Based on TARANG's available seasonal data for the selected date, conditions at ${context.locationName} are typically ${decision.riskBand}. ${decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).join(' ')}`;

    case 'WAVE_HEIGHT':
      if (env) {
        const waveHeight = env.significantWaveHeightM ?? 'unknown';
        const waveAlert = env.highWaveAlert ? " A high wave alert is active in the historical data." : "";
        return `Based on TARANG's dataset, the typical significant wave height around ${context.locationName} for this time of year is ${waveHeight} meters.${waveAlert}`;
      }
      break;

    case 'CYCLONE_ALERT':
      if (env) {
        const status = env.cycloneStatus || 'normal';
        let alertStr = `Historical cyclone risk for this period is ${status}.`;
        if (status === 'elevated' || status === 'warning') {
          alertStr += " Please exercise extreme caution and check local authorities for live tracking.";
        }
        return alertStr;
      }
      break;

    case 'MULTI_DAY_TRIP':
      return `TARANG currently evaluates single-day baselines. Based on the selected date's seasonal data, conditions are ${decision.riskBand}. True multi-day forecasts are not currently available in the dataset.`;

    case 'SAFE_ROUTE':
      if (topMarine) {
        return `TARANG can identify a safer nearby destination from the available facilities, but it does not calculate a navigable sea route. The recommended destination is **${topMarine.facilityName}** at a distance of ${topMarine.distanceKm.toFixed(1)} km.`;
      }
      return "TARANG does not calculate navigable sea routes, and no safe nearby destinations were found.";

    case 'AVOID_ZONE':
      // The decision engine explicitly marks 'AVOID' when evaluating facilities.
      if (decision.riskBand === 'AVOID') {
        return `You should avoid fishing at ${context.locationName} due to severe risks. ${decision.reasons[0]}`;
      }
      return `Based on TARANG's dataset, ${context.locationName} is not currently marked as an Avoid zone. Conditions are ${decision.riskBand}.`;

    case 'WIND_FORECAST':
      if (env) {
        const speed = env.windSpeedKmph ?? 'unknown';
        const dir = env.windDirectionDeg !== null ? `${env.windDirectionDeg}°` : 'an unknown direction';
        return `Based on TARANG's available seasonal data, typical wind speeds for this time are ${speed} km/h coming from ${dir}.`;
      }
      break;

    case 'BOAT_SAFETY':
      return `For a ${context.boatType}, current seasonal conditions are rated ${decision.riskBand}. ${decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).join(' ')}`;

    case 'WHY_NOT_RECOMMENDED':
      const coreReasons = decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).slice(0, 3);
      if (coreReasons.length > 0) {
        return `The location was evaluated based on the following factors:\n${coreReasons.map(r => `• ${r}`).join('\n')}`;
      }
      return "The decision engine evaluated standard risk and distance factors for this location.";

    case 'SAFEST_TIME':
      return `TARANG's current dataset provides monthly seasonal aggregations and does not have hourly or diurnal data. Generally, conditions for this month are rated ${decision.riskBand}.`;

    case 'RESTRICTED_ZONE':
      // Basic fallback since we don't have military polygons in env
      return `TARANG's dataset does not indicate specific spatial restrictions here, but environmental risk is ${decision.riskBand}. Always consult local harbor masters for temporary restrictions.`;

    case 'CURRENT_COASTAL_CONDITIONS':
      if (env) {
        const wind = env.windSpeedKmph ?? 'unknown';
        const wave = env.significantWaveHeightM ?? 'unknown';
        const temp = env.airTemperatureC ?? 'unknown';
        return `Based on seasonal baselines for this date: Wind is typically ${wind} km/h, waves are around ${wave} meters, and air temperature averages ${temp}°C.`;
      }
      break;

    case 'NIGHT_VISIBILITY':
      if (env) {
        const vis = env.visibilityKm ?? 'unknown';
        return `TARANG provides general visibility data rather than nighttime-specific measurements. Expected baseline visibility is ${vis} km.`;
      }
      break;

    case 'UNKNOWN':
    default:
      // Fallback
      break;
  }

  // Absolute fallback if intent matched but env was null or fell through
  const filteredReasons = decision.reasons.filter(r => !r.startsWith('- **') && !r.startsWith('Top '));
  return `Risk Assessment: ${decision.riskBand}\n\n${filteredReasons.map(r => `• ${r}`).join('\n')}`;
}
