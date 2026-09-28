import { type IntentCategory } from '../data/questionBank';
import { type DecisionResult } from './decisionEngine';
import { type ResolvedContext } from './contextResolver';
import { getLocationEnvironment } from '../data/environmentResolver';

export function formatNormalResponse(
  intents: IntentCategory[],
  context: ResolvedContext,
  decision: DecisionResult
): string {
  // If the decision engine explicitly triggered a fallback consent prompt, return the reason immediately.
  if (decision.requiresFallbackConsent && decision.reasons.length > 0) {
    return decision.reasons[0];
  }

  if (intents.includes('UNKNOWN')) {
    return "Could you please elaborate your question a little more? TARANG is designed to help with marine conditions, fishing zones, and safety. What would you like to know about your fishing trip?";
  }

  // Common variables
  const currentMonth = context.dateTime.getMonth();
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  const env = getLocationEnvironment(context.locationId, evalMonth);

  const isMarine = env?.waveApplicability !== 'not_applicable_inland' && env?.fisheriesType !== 'inland';
  const hasMarineRecs = decision.marineRecommendations && decision.marineRecommendations.length > 0;
  const hasInlandRecs = decision.inlandRecommendations && decision.inlandRecommendations.length > 0;
  
  const topMarine = hasMarineRecs ? decision.marineRecommendations![0] : null;

  // 1. Direct Answer
  let directAnswer = "";
  const isSafe = decision.riskBand === 'SAFE';
  const vesselType = context.boatType.replace('_', ' ');
  const timeContext = intents.includes('SAFETY_TOMORROW') ? "tomorrow" : "under current conditions";

  // Safety takes priority
  if (!isSafe && intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i))) {
    directAnswer = `**The fishing potential may be good, but I would not recommend going ${timeContext}.** The current safety conditions exceed your ${vesselType}'s operating limits.`;
  } else if (intents.some(i => ['SAFETY_TOMORROW', 'BOAT_SAFETY', 'AVOID_ZONE', 'SAFETY_ANALYSIS'].includes(i))) {
    if (isSafe) {
      directAnswer = `**Yes, conditions are within your ${vesselType}'s limits ${timeContext}.**`;
    } else {
      directAnswer = `**I would advise caution for your ${vesselType} ${timeContext}.**`;
    }
  } else if (intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i))) {
    if (isMarine && topMarine) {
      directAnswer = `**The best nearby marine option is ${topMarine.facilityName}.**`;
    } else if (!isMarine && hasInlandRecs) {
      directAnswer = `**Marine zones aren't applicable here, but there are safe inland options nearby.**`;
    } else {
      directAnswer = `**I couldn't find any suitable fishing zones nearby based on your safety conditions.**`;
    }
  } else if (intents.includes('SAFE_ROUTE')) {
    directAnswer = topMarine ? `**The recommended destination is ${topMarine.facilityName}.** (Navigable sea routing is not currently supported).` : "**I couldn't find any safe nearby destinations.**";
  }

  // 2. Combined Key Metrics
  const metrics: string[] = [];
  
  // Vessel Limits
  const waveLimit = context.boatType === 'motorized' ? 1.4 : context.boatType === 'mechanized' ? 2.4 : 0.6;
  const windLimit = context.boatType === 'motorized' ? 40 : context.boatType === 'mechanized' ? 55 : 25;

  if (intents.some(i => ['WIND_FORECAST', 'WAVE_HEIGHT', 'SAFETY_TOMORROW', 'BOAT_SAFETY', 'SAFETY_ANALYSIS'].includes(i))) {
    const hasWind = env && env.windSpeedKmph !== null;
    const hasWave = env && env.significantWaveHeightM !== null;
    
    if (hasWind && hasWave) {
      metrics.push(`Wind is ${env.windSpeedKmph} km/h and waves are ${env.significantWaveHeightM} m, ${isSafe ? 'both below' : 'which may exceed'} your vessel's limits of ${windLimit} km/h and ${waveLimit} m.`);
    } else if (hasWind) {
      metrics.push(`Wind speed is ${env.windSpeedKmph} km/h (Limit: ${windLimit} km/h).`);
    } else if (hasWave) {
      metrics.push(`Wave height is ${env.significantWaveHeightM} m (Limit: ${waveLimit} m).`);
    }
  }

  if (intents.includes('CURRENT_COASTAL_CONDITIONS')) {
    if (env && env.surfaceCurrentSpeedMs !== null) {
      metrics.push(`Ocean currents are moving at ${env.surfaceCurrentSpeedMs} m/s.`);
    } else {
      metrics.push("I don't have ocean current data available for this location.");
    }
  }
  
  if (intents.includes('SST_CONDITIONS')) {
    if (env && env.seaSurfaceTemperatureC !== null) {
      metrics.push(`The sea surface temperature is ${env.seaSurfaceTemperatureC} °C.`);
    } else {
      metrics.push("I don't have sea surface temperature data available for this location.");
    }
  }

  if (intents.includes('MLD_CONDITIONS')) {
    if (env && env.mixedLayerDepthM !== null) {
      metrics.push(`The mixed layer depth is ${env.mixedLayerDepthM} m.`);
    } else {
      metrics.push("I don't have mixed layer depth data available for this location.");
    }
  }

  if (intents.includes('D20_CONDITIONS')) {
    if (env && env.d20DepthM !== null) {
      metrics.push(`The D20 isotherm depth is ${env.d20DepthM} m.`);
    } else {
      metrics.push("I don't have D20 depth data available for this location.");
    }
  }

  // 3. Reasoning / Context / Distance
  const contextLines: string[] = [];
  if (intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE', 'PRODUCTIVITY_ANALYSIS'].includes(i))) {
    if (isMarine && topMarine && topMarine.productivityEvaluation) {
      const prod = topMarine.productivityEvaluation;
      const factors = [];
      if (prod.factors.pfz?.score > 50) factors.push("strong historical PFZ patterns");
      if (prod.factors.chlorophyll?.score > 50) factors.push("favorable chlorophyll");
      if (prod.factors.sst?.score > 50) factors.push("optimal temperatures");
      const reasons = factors.length > 0 ? ` driven by ${factors.join(", ")}` : "";
      contextLines.push(`This zone has a Fishing Potential of ${prod.productivityScore}/100${reasons}.`);
    } else if (isMarine && topMarine) {
      contextLines.push("Specific productivity metrics are currently unavailable for this zone.");
    }
  }

  if (intents.includes('DISTANCE_ANALYSIS') || intents.includes('SAFE_ROUTE')) {
    if (topMarine) {
      contextLines.push(`It is approximately ${topMarine.distanceKm.toFixed(1)} km away.`);
    }
  }

  if (intents.includes('WHY_NOT_RECOMMENDED')) {
    const coreReasons = decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).slice(0, 2);
    if (coreReasons.length > 0) contextLines.push(`Reasoning: ${coreReasons.join('. ')}`);
  }

  if (intents.includes('RESTRICTED_ZONE')) {
    contextLines.push(`TARANG's dataset does not indicate specific spatial restrictions here, but always consult local harbor masters.`);
  }

  if (intents.includes('CYCLONE_ALERT') && env && env.cycloneStatus) {
    const status = env.cycloneStatus || 'normal';
    contextLines.push(`Historical cyclone risk for this period is ${status}.${status === 'elevated' || status === 'warning' ? " Please exercise extreme caution." : ""}`);
  }

  if (intents.includes('FACTOR_EXPLANATION') || intents.includes('SCORE_BREAKDOWN') || intents.includes('PRODUCTIVITY_METHODOLOGY') || intents.includes('SAFETY_METHODOLOGY') || intents.includes('DATA_SOURCE')) {
    contextLines.push("*(Note: TARANG uses a static historical dataset combining INCOIS baseline models and regional climatology for its metrics.)*");
  }

  // 4. Actionable Conclusion / Fallback
  if (!directAnswer && metrics.length === 0 && contextLines.length === 0) {
    const filteredReasons = decision.reasons.filter(r => !r.startsWith('- **') && !r.startsWith('Top ')).join('. ');
    return `**Overall Risk: ${decision.riskBand}**\n\n${filteredReasons}`;
  }

  // Combine components
  let finalResponse = directAnswer;
  if (metrics.length > 0) finalResponse += (finalResponse ? " " : "") + metrics.join(' ');
  if (contextLines.length > 0) finalResponse += "\n\n" + contextLines.join(' ');

  return finalResponse.trim();
}
