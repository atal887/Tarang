import type { ResolvedContext } from "./contextResolver";
import type { DecisionResult } from "./decisionEngine";
import { getLocationEnvironment } from '../data/environmentResolver';

export function formatAlertResponse(
  intents: string[],
  context: ResolvedContext,
  decisionResult: DecisionResult,
  isSimulated: boolean = false
): string {
  const { riskBand, reasons } = decisionResult;
  
  if (intents.includes("DATA_SOURCE") || intents.includes("DATA_AVAILABILITY")) {
    return "TARANG uses data from INCOIS, IMD, and other meteorological sources to determine marine alerts, including high wave alerts, cyclone warnings, and severe weather advisories.";
  }
  
  if (intents.includes("SAFETY_METHODOLOGY") || intents.includes("FACTOR_EXPLANATION") || intents.includes("WHY_NOT_RECOMMENDED") || intents.includes("WHY_RECOMMENDED") || intents.includes("SAFETY_ANALYSIS")) {
    if (riskBand === 'SAFE') {
      return "There are no active alerts because forecast conditions (wind, waves, weather) remain within safe operating limits for your vessel, and there are no active hazard warnings in this area.";
    }
    const explanation = reasons.length > 0 ? reasons.join(" ") : "The warning is driven by forecast wind and wave conditions relative to your vessel's operational limits.";
    return `The alert is based on the following factors: ${explanation}`;
  }

  // Determine alert status
  const hasAlert = riskBand === 'AVOID' || riskBand === 'CAUTION';
  
  if (intents.includes("TRIP_PLANNING")) {
    const currentMonth = context.dateTime.getMonth();
    const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
    const env = getLocationEnvironment(context.locationId, evalMonth);

    const queryStr = context.originalQuery.toLowerCase();
    let tripDays = 1;
    const matchToUse = queryStr.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*day/i) || queryStr.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*days/i);
    
    if (matchToUse) {
      const numMap: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
      const parsed = parseInt(matchToUse[1]);
      tripDays = isNaN(parsed) ? (numMap[matchToUse[1].toLowerCase()] || 1) : parsed;
    }
    
    if (tripDays > 7) {
      return `TARANG currently supports planning up to 7 days. Please ask for a trip of 7 days or less.`;
    }
    
    let vesselPercentage = 0.30; 
    if (context.boatType === 'motorized') vesselPercentage = 0.80;
    else if (context.boatType === 'non_motorized') vesselPercentage = 0.55;
    
    const safeDuration = tripDays * vesselPercentage;
    const fullSafeDays = Math.floor(safeDuration);
    const decimalPart = safeDuration - fullSafeDays;
    
    if (fullSafeDays >= tripDays) {
      return `🟢 **No Trip Alerts**\n\nYour ${tripDays}-day trip remains within safe operating limits for your ${context.boatType.replace('_', ' ')}.`;
    }
    
    let partialDayText = "";
    if (decimalPart > 0) {
      if (decimalPart <= 0.25) partialDayText = "around morning";
      else if (decimalPart <= 0.6) partialDayText = "around afternoon";
      else partialDayText = "around evening";
    }

    const possibleReasons = [];
    if (env?.significantWaveHeightM && env.significantWaveHeightM > 1.2) possibleReasons.push(`Waves reaching ${env.significantWaveHeightM}m`);
    if (env?.windSpeedKmph && env.windSpeedKmph > 20) possibleReasons.push(`Winds up to ${env.windSpeedKmph} km/h`);
    if (env?.surfaceCurrentSpeedMs && env.surfaceCurrentSpeedMs > 0.5) possibleReasons.push("High surface currents");
    if (env?.cycloneStatus && env.cycloneStatus !== 'normal') possibleReasons.push("Marine warning active");
    
    if (possibleReasons.length === 0) {
      possibleReasons.push("Deteriorating conditions exceeding operating limits");
    }
    
    const selectedReasons = possibleReasons.slice(0, 2).join(" & ");

    const warningDay = fullSafeDays + 1;
    const warningTime = decimalPart > 0 ? `After ${partialDayText} on Day ${warningDay}` : `Starting Day ${warningDay}`;

    let response = `🚨 **TRIP WARNING**\n\n`;
    response += `**Affected Time:** ${warningTime}\n`;
    response += `**Severity:** HIGH RISK\n`;
    response += `**Main Warning:** ${selectedReasons}\n\n`;
    response += `**Vessel Impact:** The conditions will severely exceed the operational limits of your ${context.boatType.replace('_', ' ')}.\n`;
    response += `**Recommended Action:** Conclude your trip before ${warningTime} or seek shelter immediately.`;

    return response;
  }
  const severity = riskBand === 'AVOID' ? 'SEVERE' : 'WARNING';
  
  const locationName = context.locationName || "this location";
  
  let simulatedPrefix = "";
  if (isSimulated) {
    simulatedPrefix = "> 🚨 **Scenario Alert**\n> Under your simulated scenario, the conditions move into a higher-risk range. This is a simulation and should not be interpreted as an official marine warning.\n\n";
  }

  // Handle trip logic
  const validPeriod = `Date: ${context.dateTime.toLocaleDateString()}`;

  if (!hasAlert) {
    let msg = `🟢 **No Active Marine Alert**\n\nI don't currently have an active marine warning for **${locationName}** in the available TARANG data for the requested period.`;
    msg += `\n\nNormal environmental conditions should still be checked before departure.`;
    if (isSimulated) {
      msg = `🟢 **No Simulated Marine Alert**\n\nBased on your simulated conditions, there is no severe warning triggered for **${locationName}**.`;
    }
    return msg;
  }

  // We have an alert
  let response = `${simulatedPrefix}🚨 **Marine Alert**\n\n**Location:** ${locationName}\n**Status:** ${severity}\n**Valid:** ${validPeriod}\n\n`;
  
  response += `**What is happening?**\n`;
  if (reasons.length > 0) {
    response += `${reasons.join(" ")}\n\n`;
  } else {
    response += `Conditions are expected to deteriorate.\n\n`;
  }
  
  response += `**What it means for your vessel**\n`;
  if (severity === 'SEVERE') {
    response += `The forecast conditions severely exceed the safe operating range for your ${context.boatType.replace('_', ' ')} vessel.\n\n`;
  } else {
    response += `The forecast conditions are approaching or occasionally exceeding the safe operating limits for your ${context.boatType.replace('_', ' ')} vessel.\n\n`;
  }

  response += `**Recommended action**\n`;
  if (severity === 'SEVERE') {
    response += `Safety conditions take priority. Reassess the trip and avoid operating during the affected period.\n`;
  } else {
    response += `Exercise caution and monitor local updates before heading out.\n`;
  }

  return response;
}
