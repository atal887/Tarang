import type { IntentCategory } from '../data/questionBank';
import type { DecisionResult } from './decisionEngine';
import type { ResolvedContext } from './contextResolver';
import { getLocationEnvironment } from '../data/environmentResolver';

// Chart Data Payloads
export interface ProductivityRadarChart {
  type: 'PRODUCTIVITY_RADAR';
  data: {
    subject: string;
    A: number; // Factor Score
    fullMark: 100;
  }[];
}

export interface CandidateComparisonChart {
  type: 'CANDIDATE_COMPARISON';
  data: {
    name: string;
    productivityScore: number;
    riskScore: number;
  }[];
}

export interface SafetyStressChart {
  type: 'SAFETY_STRESS';
  data: {
    metric: string;
    actual: number;
    limit: number;
  }[];
}

export type ResearchChartPayload = ProductivityRadarChart | CandidateComparisonChart | SafetyStressChart;

// Structured Research Response
export interface ResearchResponse {
  intent: string;
  summary: string;
  
  productivityAnalysis?: {
    productivityScore: number;
    productivityBand: string;
    factors: {
      pfz: { score: number; explanation: string };
      chlorophyll: { score: number; explanation: string };
      sst: { score: number; explanation: string };
      currentSpeed: { score: number; explanation: string };
      mixedLayer: { score: number; explanation: string };
      d20Depth: { score: number; explanation: string };
    };
    insights: string;
  };
  
  safetyAnalysis?: {
    riskScore: number | null;
    riskBand: string;
    reasons: string[];
    vesselType: string;
    windSpeedKmph: number | null;
    significantWaveHeightM: number | null;
    cycloneStatus?: string | null;
    highWaveAlert?: boolean;
    marineWarning?: string | null;
    vesselLimits: {
      windLimitKmph: number;
      waveLimitM: number;
    };
  };

  candidateComparison?: {
    facilityName: string;
    distanceKm: number;
    productivityScore: number | null;
    productivityBand: string | null;
    riskScore: number | null;
    riskBand: string | null;
    environmentalProfile?: any;
  }[];

  methodology?: {
    productivity?: string[];
    safety?: string[];
  };

  charts?: ResearchChartPayload[];
}

export function formatResearchResponse(
  intents: IntentCategory[],
  context: ResolvedContext,
  decision: DecisionResult
): ResearchResponse {
  const currentMonth = context.dateTime.getMonth();
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  const env = getLocationEnvironment(context.locationId, evalMonth);

  const isMarine = env?.waveApplicability !== 'not_applicable_inland' && env?.fisheriesType !== 'inland';
  const hasMarineRecs = decision.marineRecommendations && decision.marineRecommendations.length > 0;
  
  const topMarine = hasMarineRecs ? decision.marineRecommendations![0] : null;

  const response: ResearchResponse = {
    intent: intents[0] as string || 'UNKNOWN',
    summary: '',
    charts: []
  };

  // 1. Resolve Safety Vessel Limits (mimicking logic without modifying marineRiskResolver)
  const vType = context.boatType.toLowerCase();
  let windLimit = 40;
  let waveLimit = 1.4;
  if (vType.includes('non_motorized') || vType.includes('non-motorized')) {
    windLimit = 25; waveLimit = 0.6;
  } else if (vType.includes('mechanized')) {
    windLimit = 55; waveLimit = 2.4;
  }

  // 2. Populate Safety Analysis
  response.safetyAnalysis = {
    riskScore: topMarine?.riskScore ?? null,
    riskBand: decision.riskBand,
    reasons: decision.reasons,
    vesselType: context.boatType,
    windSpeedKmph: env?.windSpeedKmph ?? null,
    significantWaveHeightM: env?.significantWaveHeightM ?? null,
    cycloneStatus: env?.cycloneStatus,
    highWaveAlert: env?.highWaveAlert,
    marineWarning: env?.marineWarning,
    vesselLimits: {
      windLimitKmph: windLimit,
      waveLimitM: waveLimit
    }
  };

  // Add Safety Chart
  if (env && env.windSpeedKmph !== null && env.significantWaveHeightM !== null) {
    response.charts!.push({
      type: 'SAFETY_STRESS',
      data: [
        { metric: 'Wind (km/h)', actual: env.windSpeedKmph, limit: windLimit },
        { metric: 'Wave (m)', actual: env.significantWaveHeightM, limit: waveLimit }
      ]
    });
  }

  // 3. Populate Productivity Analysis
  if (isMarine && topMarine?.productivityEvaluation) {
    const prod = topMarine.productivityEvaluation;
    
    // Insights synthesis
    const strongFactors: string[] = [];
    const weakFactors: string[] = [];
    Object.entries(prod.factors).forEach(([key, factor]) => {
      if (factor.score > 60) strongFactors.push(key);
      else if (factor.score < 40) weakFactors.push(key);
    });
    
    let insights = `Based on the TARANG dataset, the primary positive drivers for this location are ${strongFactors.join(', ')}.`;
    if (weakFactors.length > 0) insights += ` Conversely, ${weakFactors.join(', ')} currently limit the overall potential.`;

    response.productivityAnalysis = {
      productivityScore: prod.productivityScore,
      productivityBand: prod.productivityBand,
      factors: {
        pfz: { score: prod.factors.pfz.score, explanation: prod.factors.pfz.explanation },
        chlorophyll: { score: prod.factors.chlorophyll.score, explanation: prod.factors.chlorophyll.explanation },
        sst: { score: prod.factors.sst.score, explanation: prod.factors.sst.explanation },
        currentSpeed: { score: prod.factors.currentSpeed.score, explanation: prod.factors.currentSpeed.explanation },
        mixedLayer: { score: prod.factors.mixedLayer.score, explanation: prod.factors.mixedLayer.explanation },
        d20Depth: { score: prod.factors.d20Depth.score, explanation: prod.factors.d20Depth.explanation }
      },
      insights
    };

    response.charts!.push({
      type: 'PRODUCTIVITY_RADAR',
      data: [
        { subject: 'PFZ', A: prod.factors.pfz.score, fullMark: 100 },
        { subject: 'Chlorophyll', A: prod.factors.chlorophyll.score, fullMark: 100 },
        { subject: 'SST', A: prod.factors.sst.score, fullMark: 100 },
        { subject: 'Current', A: prod.factors.currentSpeed.score, fullMark: 100 },
        { subject: 'MLD', A: prod.factors.mixedLayer.score, fullMark: 100 },
        { subject: 'D20', A: prod.factors.d20Depth.score, fullMark: 100 }
      ]
    });
  }

  // 4. Populate Candidate Comparison
  if (isMarine && hasMarineRecs) {
    response.candidateComparison = decision.marineRecommendations!.map(rec => ({
      facilityName: rec.facilityName,
      distanceKm: rec.distanceKm,
      productivityScore: rec.productivityEvaluation?.productivityScore ?? null,
      productivityBand: rec.productivityEvaluation?.productivityBand ?? null,
      riskScore: rec.riskScore,
      riskBand: rec.riskBand,
      environmentalProfile: rec.productivityProfile
    }));

    if (decision.marineRecommendations!.length > 1) {
      response.charts!.push({
        type: 'CANDIDATE_COMPARISON',
        data: decision.marineRecommendations!.slice(0, 3).map(rec => ({
          name: rec.facilityName,
          productivityScore: rec.productivityEvaluation?.productivityScore ?? 0,
          riskScore: rec.riskScore ?? 0
        }))
      });
    }
  }

  // 5. Populate Methodology
  response.methodology = {
    productivity: [
      "The Productivity Engine aggregates 6 static seasonal factors: PFZ Potential (40%), Chlorophyll (30%), SST (10%), Current Speed (10%), Mixed Layer Depth (5%), and D20 Depth (5%).",
      "Each factor is min-max normalized to a 0-100 score based on documented historical environmental ranges (e.g. Chlorophyll 0.2 to 1.5 mg/m³).",
      "Final Banding: High (≥70), Moderate (45-69), Low (<45).",
      "Values are historical seasonal baselines from the TARANG dataset, not live satellite feeds."
    ],
    safety: [
      "The Safety Engine computes a stress multiplier (0-100) based on wind (30%) and wave (40%) ratios against dynamic vessel limits.",
      `Current limits for ${context.boatType}: Wind ${windLimit} km/h, Wave ${waveLimit} m.`,
      "Hard Safety Gates: Elevated cyclone status, high wave alerts, or severe marine warnings force an immediate AVOID rating (Score: 100).",
      "Final Banding: SAFE (0-40), CAUTION (41-70), AVOID (≥71)."
    ]
  };

  // 6. Summary generation based on intent
  if (intents.includes('UNKNOWN')) {
    response.summary = "Could you please elaborate your question a little more? TARANG is designed to help with marine conditions, fishing zones, and safety. What would you like to know about your fishing trip?";
    return response;
  }

  const isSafe = decision.riskBand === 'SAFE';
  const vesselType = context.boatType.replace('_', ' ');
  const timeContext = intents.includes('SAFETY_TOMORROW') ? "tomorrow" : "under current conditions";
  
  let directAnswer = "";
  
  // Direct Answer & Prioritization
  if (!isSafe && intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i))) {
    directAnswer = `**The fishing potential here is favorable, but I would advise against going ${timeContext}.** The environmental risk exceeds the safe operating limits for your ${vesselType}.`;
  } else if (intents.some(i => ['SAFETY_TOMORROW', 'BOAT_SAFETY', 'AVOID_ZONE', 'SAFETY_ANALYSIS'].includes(i))) {
    directAnswer = isSafe 
      ? `**Yes, based on the forecast, this zone is safe for your ${vesselType} ${timeContext}.**` 
      : `**I would advise caution for your ${vesselType} in this zone ${timeContext}.**`;
  } else if (intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE'].includes(i))) {
    if (isMarine && topMarine) directAnswer = `**Based on the latest conditions, ${topMarine.facilityName} shows the strongest fishing potential for your trip.**`;
    else if (!isMarine) directAnswer = `**Marine productivity metrics are inapplicable since ${context.locationName} is an inland location.**`;
    else directAnswer = `**I cannot determine the fishing potential because productivity data is currently unavailable in the baseline dataset.**`;
  } else if (intents.includes('COMPARE_ZONES') && decision.marineRecommendations && decision.marineRecommendations.length > 1) {
    const top = decision.marineRecommendations[0];
    const second = decision.marineRecommendations[1];
    directAnswer = `**Comparing the primary zone (${top.facilityName}) with the alternative (${second.facilityName}):** ${top.facilityName} offers stronger fishing potential.`;
  } else {
    directAnswer = `**Overall Environmental Risk: ${decision.riskBand}.**`;
  }

  // Integrated Analysis
  const metrics: string[] = [];
  const hasWind = env && env.windSpeedKmph !== null;
  const hasWave = env && env.significantWaveHeightM !== null;

  if (intents.some(i => ['WIND_FORECAST', 'WAVE_HEIGHT', 'SAFETY_TOMORROW', 'BOAT_SAFETY', 'SAFETY_ANALYSIS', 'COMPARE_ZONES'].includes(i))) {
    if (hasWind && hasWave) {
      metrics.push(`The significant wave height (${env.significantWaveHeightM}m) and wind speeds (${env.windSpeedKmph} km/h) remain ${isSafe ? 'comfortably below' : 'concerningly close to or above'} the ${waveLimit}m and ${windLimit} km/h thresholds for ${vesselType} boats.`);
    } else if (hasWind) {
      metrics.push(`The wind speed is ${env.windSpeedKmph} km/h (Limit: ${windLimit} km/h).`);
    } else if (hasWave) {
      metrics.push(`The wave height is ${env.significantWaveHeightM} m (Limit: ${waveLimit} m).`);
    }
  }

  if (intents.includes('CURRENT_COASTAL_CONDITIONS')) {
    if (!isMarine) metrics.push(`Marine metrics like ocean currents are inapplicable to ${context.locationName} because it's inland.`);
    else metrics.push(env?.surfaceCurrentSpeedMs !== null ? `Ocean surface currents are moving at ${env.surfaceCurrentSpeedMs} m/s toward ${env.surfaceCurrentDirectionDeg}°, which plays a key role in nutrient transport.` : `Current data is not available for this location.`);
  }

  if (intents.includes('SST_CONDITIONS')) {
    if (!isMarine) metrics.push(`Marine metrics like sea surface temperature (SST) are inapplicable to ${context.locationName} because it's inland.`);
    else metrics.push(env?.seaSurfaceTemperatureC !== null ? `The sea surface temperature (SST) here is ${env.seaSurfaceTemperatureC} °C.` : `SST data is not available for this location.`);
  }

  if (intents.includes('MLD_CONDITIONS')) {
    if (!isMarine) metrics.push(`Marine metrics like mixed layer depth are inapplicable to ${context.locationName} because it's inland.`);
    else metrics.push(env?.mixedLayerDepthM !== null ? `The mixed layer depth (MLD) is ${env.mixedLayerDepthM} meters.` : `MLD data is not available for this location.`);
  }

  if (intents.includes('D20_CONDITIONS')) {
    if (!isMarine) metrics.push(`Marine metrics like D20 depth are inapplicable to ${context.locationName} because it's inland.`);
    else metrics.push(env?.d20DepthM !== null ? `The D20 isotherm depth is ${env.d20DepthM} meters.` : `D20 depth data is not available for this location.`);
  }

  if (intents.includes('DISTANCE_ANALYSIS') && topMarine) {
    metrics.push(`This location is approximately ${topMarine.distanceKm.toFixed(1)} km away.`);
  }

  // Methodology and Context
  const contextLines: string[] = [];
  if (intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE', 'PRODUCTIVITY_ANALYSIS', 'COMPARE_ZONES'].includes(i))) {
    if (isMarine && topMarine && topMarine.productivityEvaluation) {
      const prod = topMarine.productivityEvaluation;
      const factors = [];
      if (prod.factors.pfz?.score > 50) factors.push("strong historical PFZ");
      if (prod.factors.chlorophyll?.score > 50) factors.push("favorable chlorophyll");
      if (prod.factors.sst?.score > 50) factors.push("optimal SST");
      
      const reasons = factors.length > 0 ? ` This score is heavily weighted by its ${factors.join(" and ")}, which historically indicate strong pelagic aggregation.` : "";
      contextLines.push(`From a productivity standpoint, this zone scores ${prod.productivityScore}/100.${reasons}`);
    }
  }
  
  if (intents.includes('FACTOR_EXPLANATION')) {
    contextLines.push(`This factor is normalized against historical ranges and weighted alongside other metrics in the scoring model.`);
  }
  
  if (intents.includes('DATA_SOURCE')) {
    contextLines.push(`This analysis relies on the TARANG historical seasonal dataset, rather than live satellite feeds.`);
  }

  let finalSummary = directAnswer;
  if (metrics.length > 0) finalSummary += " " + metrics.join(" ");
  if (contextLines.length > 0) finalSummary += "\n\n" + contextLines.join(" ");

  response.summary = finalSummary.trim();

  return response;
}
