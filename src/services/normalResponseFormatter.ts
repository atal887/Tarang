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

  // If no intents detected, fallback to safety
  if (!intents || intents.length === 0) {
    intents = ['BOAT_SAFETY'];
  }

  // Common variables
  const currentMonth = context.dateTime.getMonth();
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  const env = getLocationEnvironment(context.locationId, evalMonth);

  const isMarine = env?.waveApplicability !== 'not_applicable_inland' && env?.fisheriesType !== 'inland';
  const hasMarineRecs = decision.marineRecommendations && decision.marineRecommendations.length > 0;
  const hasInlandRecs = decision.inlandRecommendations && decision.inlandRecommendations.length > 0;
  
  const topMarine = hasMarineRecs ? decision.marineRecommendations![0] : null;

  // Group intents
  const blocks: string[] = [];
  const texts: string[] = [];
  
  // We want to synthesize a cohesive response.
  // 1. If asking about productivity/fishing
  if (intents.some(i => ['NEAREST_PFZ', 'BEST_FISHING_ZONE', 'CHLOROPHYLL_ZONE'].includes(i))) {
    if (isMarine) {
      if (topMarine && topMarine.productivityEvaluation) {
        const prod = topMarine.productivityEvaluation;
        const factors = [];
        if (prod.factors.pfz.score > 50) factors.push("strong historical PFZ patterns");
        if (prod.factors.chlorophyll.score > 50) factors.push("favourable chlorophyll levels");
        if (prod.factors.sst.score > 50) factors.push("optimal sea surface temperatures");
        let factorsText = factors.length > 0 ? ` This is driven by ${factors.join(" and ")}.` : "";
        texts.push(`The best nearby marine option is **${topMarine.facilityName}** with a Fishing Potential of **${prod.productivityScore}/100** (${prod.productivityBand}).${factorsText}`);
      } else if (topMarine) {
        texts.push(`The best nearby marine option is **${topMarine.facilityName}**. Productivity data is currently unavailable.`);
      } else {
        texts.push("No suitable marine fishing zones could be found based on your current location and safety conditions.");
      }
    } else {
      let response = "Marine Potential Fishing Zone (PFZ) and productivity data is not applicable for inland locations.";
      if (hasInlandRecs) response += " However, here are the safest inland fishing options nearby.";
      texts.push(response);
    }
  }

  // 2. If asking about route/distance
  if (intents.includes('SAFE_ROUTE')) {
    if (topMarine) texts.push(`The recommended destination is **${topMarine.facilityName}** at a distance of ${topMarine.distanceKm.toFixed(1)} km. (Navigable sea routing is not currently supported).`);
    else texts.push("TARANG does not calculate navigable sea routes, and no safe nearby destinations were found.");
  } else if (intents.includes('DISTANCE_ANALYSIS')) {
    texts.push(`The primary recommended location is approximately ${topMarine?.distanceKm ?? 'unknown'} km away.`);
  }

  // 3. Environmental blockquotes
  if (intents.includes('WAVE_HEIGHT')) {
    if (env && env.significantWaveHeightM !== null) {
      const h = env.significantWaveHeightM;
      const limit = context.boatType === 'motorized' ? 1.4 : context.boatType === 'mechanized' ? 2.4 : 0.6;
      const status = h <= limit ? 'Safe' : 'Caution';
      blocks.push(`> Wave Height: **${h} m**\n> Your Vessel Limit: **${limit} m** (${context.boatType})\n> Status: **${status}**\n>\n> The waves here are ${status === 'Safe' ? 'within safe operating limits for your vessel' : 'nearing or exceeding your vessel\'s upper limit. Exercise caution'}.`);
    }
  }
  if (intents.includes('WIND_FORECAST')) {
    if (env && env.windSpeedKmph !== null) {
      const speed = env.windSpeedKmph;
      const limit = context.boatType === 'motorized' ? 40 : context.boatType === 'mechanized' ? 55 : 25;
      const status = speed <= limit ? 'Safe' : 'Caution';
      blocks.push(`> Wind Speed: **${speed} km/h**\n> Your Vessel Limit: **${limit} km/h** (${context.boatType})\n> Status: **${status}**\n>\n> The wind conditions are ${status === 'Safe' ? 'well within the safe operating limits for your boat' : 'strong and may pose a risk'}.`);
    }
  }
  if (intents.includes('CURRENT_COASTAL_CONDITIONS')) {
    if (env && env.surfaceCurrentSpeedMs !== null) {
      blocks.push(`> Current Speed: **${env.surfaceCurrentSpeedMs} m/s**\n> Direction: **${env.surfaceCurrentDirectionDeg}°**\n>\n> Ocean currents in this zone are currently moving at ${env.surfaceCurrentSpeedMs} m/s.`);
    }
  }
  if (intents.includes('SST_CONDITIONS')) {
    if (env && env.seaSurfaceTemperatureC !== null) {
      blocks.push(`> Sea Surface Temperature: **${env.seaSurfaceTemperatureC} °C**\n>\n> The surface water temperature here is typically around ${env.seaSurfaceTemperatureC} °C for this time of year.`);
    }
  }
  if (intents.includes('MLD_CONDITIONS')) {
    if (env && env.mixedLayerDepthM !== null) {
      blocks.push(`> Mixed Layer Depth: **${env.mixedLayerDepthM} m**\n>\n> The mixed layer depth is around ${env.mixedLayerDepthM} meters, which affects where fish aggregate.`);
    }
  }
  if (intents.includes('D20_CONDITIONS')) {
    if (env && env.d20DepthM !== null) {
      blocks.push(`> D20 Isotherm Depth: **${env.d20DepthM} m**\n>\n> The 20°C temperature boundary is located approximately ${env.d20DepthM} meters deep.`);
    }
  }

  // 4. Safety / Condition Summaries
  const needsSafetySummary = intents.some(i => ['SAFETY_TOMORROW', 'WEEKEND_FISHING', 'BOAT_SAFETY', 'AVOID_ZONE'].includes(i));
  if (needsSafetySummary) {
    if (intents.includes('AVOID_ZONE') && decision.riskBand === 'AVOID') {
      texts.push(`You should avoid fishing at ${context.locationName} due to severe risks. ${decision.reasons[0]}`);
    } else {
      const filteredReasons = decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).join(' ');
      texts.push(`Based on current seasonal conditions for a ${context.boatType}, the overall risk at ${context.locationName} is rated **${decision.riskBand}**. ${filteredReasons}`);
    }
  }

  // 5. Explanations / Methodology
  if (intents.includes('WHY_NOT_RECOMMENDED')) {
    const coreReasons = decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).slice(0, 3);
    texts.push(coreReasons.length > 0 ? `The location was evaluated based on the following factors:\n${coreReasons.map(r => `• ${r}`).join('\n')}` : "The decision engine evaluated standard risk and distance factors for this location.");
  }
  if (intents.includes('WHY_RECOMMENDED')) texts.push(`This zone is recommended because it offers the best available combination of high fishing productivity and safe operating conditions for your vessel.`);
  if (intents.includes('FACTOR_EXPLANATION')) texts.push("This is a key environmental factor used in the TARANG productivity engine. It is normalized and weighted alongside other factors like Chlorophyll and SST to determine the overall fishing potential.");
  if (intents.some(i => ['SCORE_BREAKDOWN', 'PRODUCTIVITY_METHODOLOGY'].includes(i))) texts.push("The productivity score (0-100) is calculated by combining historical data for PFZ potential (40%), Chlorophyll (30%), SST (10%), Current (10%), MLD (5%), and D20 (5%).");
  if (intents.includes('SAFETY_METHODOLOGY')) texts.push(`Safety is calculated by checking the historical wind and wave conditions against the safe operating limits of your vessel (${context.boatType}).`);
  if (intents.some(i => ['DATA_SOURCE', 'DATA_AVAILABILITY'].includes(i))) texts.push("TARANG uses a static historical dataset combining INCOIS baseline models and regional climatology. It does not provide live satellite feeds.");
  if (intents.includes('SAFEST_TIME')) texts.push(`TARANG's current dataset provides monthly seasonal aggregations and does not have hourly or diurnal data.`);
  if (intents.includes('RESTRICTED_ZONE')) texts.push(`TARANG's dataset does not indicate specific spatial restrictions here, but environmental risk is ${decision.riskBand}. Always consult local harbor masters for temporary restrictions.`);
  if (intents.includes('CYCLONE_ALERT') && env && env.cycloneStatus) {
    const status = env.cycloneStatus || 'normal';
    texts.push(`Historical cyclone risk for this period is ${status}.${status === 'elevated' || status === 'warning' ? " Please exercise extreme caution and check local authorities for live tracking." : ""}`);
  }

  if (blocks.length === 0 && texts.length === 0) {
    const filteredReasons = decision.reasons.filter(r => !r.startsWith('- **') && !r.startsWith('Top '));
    return `Risk Assessment: ${decision.riskBand}\n\n${filteredReasons.map(r => `• ${r}`).join('\n')}`;
  }

  return [...blocks, ...texts].join('\n\n').trim();
}
