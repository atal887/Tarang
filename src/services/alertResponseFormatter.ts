import type { ResolvedContext } from "./contextResolver";
import type { DecisionResult } from "./decisionEngine";

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
