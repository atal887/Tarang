import { type IntentCategory } from '../data/questionBank';
import { type DecisionResult } from './decisionEngine';
import { type ResolvedContext } from './contextResolver';
import { getLocationEnvironment } from '../data/environmentResolver';

export function formatNormalResponse(
  intents: IntentCategory[],
  context: ResolvedContext,
  decision: DecisionResult
): string {


  if (intents.includes('UNKNOWN')) {
    return "Could you please elaborate your question a little more? TARANG is designed to help with marine conditions, fishing zones, and safety. What would you like to know about your fishing trip?";
  }

  // Common variables
  const currentMonth = context.dateTime.getMonth();
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  const env = getLocationEnvironment(context.locationId, evalMonth);

  const isMarine = env ? (env.waveApplicability !== 'not_applicable_inland' && env.fisheriesType !== 'inland') : false;
  const hasMarineRecs = decision.marineRecommendations && decision.marineRecommendations.length > 0;
  
  const topMarine = hasMarineRecs ? decision.marineRecommendations![0] : null;

  if (intents.includes("LOCATION_CHECK")) {
    const isMarineQuery = context.originalQuery.toLowerCase().match(/(marine|coastal|coast)/);
    const isInlandQuery = context.originalQuery.toLowerCase().match(/(inland)/);
    
    if (isMarine) {
      if (isInlandQuery && !isMarineQuery) {
        return `No, ${context.locationName} is a marine/coastal location.`;
      }
      return `Yes, ${context.locationName} is a marine/coastal location.`;
    } else {
      if (isMarineQuery && !isInlandQuery) {
        return `No, ${context.locationName} is an inland location.`;
      }
      return `Yes, ${context.locationName} is an inland location.`;
    }
  }

  // Direct Inland Area Handling
  if (!isMarine) {
    const isDirectRecommendation = intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i));
    if (intents.includes("TRIP_PLANNING")) {
      return `Since ${context.locationName} is an inland location, marine trip planning is not applicable. However, here are some nearby fishing areas you can explore:`;
    }
    if (isDirectRecommendation) {
      return `Since ${context.locationName} is an inland location, here are the nearest suitable fishing areas based on safety and conditions:`;
    }
    return `Note: ${context.locationName} is an inland location, so marine conditions do not apply.`;
  }

  const vesselType = context.boatType.replace('_', ' ');

  if (intents.includes("TRIP_PLANNING")) {
    const queryStr = context.originalQuery.toLowerCase();
    
    let tripDays = 1;
    const dayMatch = queryStr.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*day/i);
    const daysMatch = queryStr.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*days/i);
    const matchToUse = dayMatch || daysMatch;
    
    if (matchToUse) {
      const numMap: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
      const parsed = parseInt(matchToUse[1]);
      tripDays = isNaN(parsed) ? (numMap[matchToUse[1].toLowerCase()] || 1) : parsed;
    }
    
    if (tripDays > 7) {
      return `TARANG currently supports planning up to 7 days. Please ask for a trip of 7 days or less.`;
    }
    
    let vesselPercentage = 0.30; 
    if (context.boatType === 'motorized') {
      vesselPercentage = 0.80;
    } else if (context.boatType === 'non_motorized') {
      vesselPercentage = 0.55;
    }
    
    const safeDuration = tripDays * vesselPercentage;
    const fullSafeDays = Math.floor(safeDuration);
    const decimalPart = safeDuration - fullSafeDays;
    
    let partialDayText = "";
    if (decimalPart > 0) {
      if (decimalPart <= 0.25) partialDayText = "around morning";
      else if (decimalPart <= 0.6) partialDayText = "around afternoon";
      else partialDayText = "around evening";
    }
    
    const possibleReasons = [];
    if (env?.significantWaveHeightM && env.significantWaveHeightM > 1.2) possibleReasons.push("elevated wave height");
    if (env?.windSpeedKmph && env.windSpeedKmph > 20) possibleReasons.push("stronger winds");
    if (env?.surfaceCurrentSpeedMs && env.surfaceCurrentSpeedMs > 0.5) possibleReasons.push("high surface currents");
    if (env?.cycloneStatus && env.cycloneStatus !== 'normal') possibleReasons.push("marine warning");
    
    if (possibleReasons.length === 0) {
      possibleReasons.push("unfavourable environmental conditions", "multiple conditions approaching operating limits");
    }
    
    const selectedReasons = possibleReasons.slice(0, 2).join(" and ");
    const destination = topMarine ? topMarine.facilityName : context.locationName;
    
    let response = `Your ${tripDays}-day ${vesselType} trip to ${destination} has approximately ${safeDuration.toFixed(1)} days of suitable operating conditions. `;
    
    if (fullSafeDays === 0) {
      response += `Day 1 is suitable until ${partialDayText}. After that, conditions require caution due to ${selectedReasons}.`;
    } else if (fullSafeDays >= tripDays) {
      response += `All ${tripDays} days are suitable for your trip.`;
    } else {
      response += `Days 1–${fullSafeDays} are suitable`;
      if (decimalPart > 0) {
        response += `, while Day ${fullSafeDays + 1} remains suitable until ${partialDayText}. After that, conditions require caution due to ${selectedReasons}.`;
      } else {
        response += `. From Day ${fullSafeDays + 1} onwards, conditions require caution due to ${selectedReasons}.`;
      }
    }
    
    return response;
  }

  // Handle direct recommendation intents
  const isDirectRecommendation = intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i));
  const isGeneralWeather = intents.some(i => ['WIND_FORECAST', 'WAVE_HEIGHT', 'SAFETY_TOMORROW', 'BOAT_SAFETY', 'SAFETY_ANALYSIS', 'CURRENT_COASTAL_CONDITIONS'].includes(i));


  const isSafe = decision.riskBand === 'SAFE';
  const timeContext = intents.includes('SAFETY_TOMORROW') ? "tomorrow" : "today";

  if (isDirectRecommendation) {
    if (isSafe && topMarine) {
      let recText = `The best nearby marine option for your ${vesselType} is ${topMarine.facilityName}, located ${topMarine.distanceKm.toFixed(1)} km away.`;
      if (topMarine.productivityEvaluation) {
        recText += ` It has a Fishing Potential of ${topMarine.productivityEvaluation.productivityScore}/100.`;
      }
      return recText;
    } else if (!isSafe) {
      return `The fishing potential may be good, but I would not recommend going ${timeContext}. The current conditions exceed your ${vesselType}'s operating limits.`;
    } else {
      return `I couldn't find any suitable fishing zones nearby based on your ${vesselType}'s safety constraints.`;
    }
  }

  if (isGeneralWeather) {
    const hasWind = env && env.windSpeedKmph !== null;
    const hasWave = env && env.significantWaveHeightM !== null;
    
    let weatherSummary = `Overall conditions ${timeContext} at ${context.locationName} are ${isSafe ? 'favourable' : 'not recommended'} for your ${vesselType}.`;
    if (hasWind && hasWave) {
      weatherSummary += ` Wind is ${env.windSpeedKmph} km/h and waves are ${env.significantWaveHeightM} m.`;
    }

    return weatherSummary;
  }

  // Fallback for other intents
  const filteredReasons = decision.reasons.filter(r => !r.startsWith('-') && !r.startsWith('Top')).join('. ');
  return `Overall Risk: ${decision.riskBand}. ${filteredReasons}`;
}
