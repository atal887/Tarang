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
  
  const topMarine = hasMarineRecs ? decision.marineRecommendations![0] : null;

  // Direct Inland Area Handling
  if (!isMarine) {
    return `Yes, ${context.locationName} is an inland area. Marine conditions and fishing zones are not applicable here.`;
  }

  // Handle direct recommendation intents
  const isDirectRecommendation = intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i));
  const isGeneralWeather = intents.some(i => ['WIND_FORECAST', 'WAVE_HEIGHT', 'SAFETY_TOMORROW', 'BOAT_SAFETY', 'SAFETY_ANALYSIS', 'CURRENT_COASTAL_CONDITIONS'].includes(i));

  const isSafe = decision.riskBand === 'SAFE';
  const timeContext = intents.includes('SAFETY_TOMORROW') ? "tomorrow" : "today";

  if (isDirectRecommendation) {
    if (isSafe && topMarine) {
      let recText = `The best nearby marine option is ${topMarine.facilityName}, located ${topMarine.distanceKm.toFixed(1)} km away.`;
      if (topMarine.productivityEvaluation) {
        recText += ` It has a Fishing Potential of ${topMarine.productivityEvaluation.productivityScore}/100.`;
      }
      return recText;
    } else if (!isSafe) {
      return `The fishing potential may be good, but I would not recommend going ${timeContext}. The current safety conditions exceed your vessel's operating limits.`;
    } else {
      return `I couldn't find any suitable fishing zones nearby based on your safety conditions.`;
    }
  }

  if (isGeneralWeather) {
    const hasWind = env && env.windSpeedKmph !== null;
    const hasWave = env && env.significantWaveHeightM !== null;
    
    let weatherSummary = `Overall conditions ${timeContext} at ${context.locationName} are ${isSafe ? 'favourable' : 'not recommended'}.`;
    if (hasWind && hasWave) {
      weatherSummary += ` Wind is ${env.windSpeedKmph} km/h and waves are ${env.significantWaveHeightM} m.`;
    }

    if (decision.marineRecommendations && decision.marineRecommendations.length > 0) {
      weatherSummary += `\n\nWould you like to know the specific weather conditions for some major ports or fishing areas nearby? Here are the top recommendations:\n`;
      decision.marineRecommendations.slice(0, 3).forEach((rec, i) => {
        weatherSummary += `${i + 1}. ${rec.facilityName} (${rec.distanceKm.toFixed(1)} km away) - Risk: ${rec.riskScore}/100\n`;
      });
    }

    return weatherSummary;
  }

  // Fallback for other intents
  const filteredReasons = decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).join('. ');
  return `Overall Risk: ${decision.riskBand}. ${filteredReasons}`;
}
