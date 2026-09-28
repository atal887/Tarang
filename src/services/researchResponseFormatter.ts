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
  const summaries: string[] = [];
  if (!intents || intents.length === 0) intents = ['BOAT_SAFETY'];

  if (intents.some(i => ['NEAREST_PFZ', 'BEST_FISHING_ZONE', 'CHLOROPHYLL_ZONE'].includes(i))) {
    if (!isMarine) {
      summaries.push(`For ${context.locationName}, marine productivity metrics like PFZ and Chlorophyll are inapplicable since it's an inland location. However, I can still help you evaluate general weather safety.`);
    } else if (response.productivityAnalysis) {
      summaries.push(`Based on the latest conditions, **${topMarine?.facilityName}** shows the strongest fishing potential for your trip.\n\nIts productivity score is highly favorable at **${response.productivityAnalysis.productivityScore}/100**. ${response.productivityAnalysis.insights}`);
    } else {
      summaries.push(`I cannot determine the fishing potential for this location because productivity data is currently unavailable in the baseline dataset.`);
    }
  }

  if (intents.some(i => ['SAFETY_TOMORROW', 'BOAT_SAFETY', 'WHY_NOT_RECOMMENDED', 'SAFETY_ANALYSIS'].includes(i))) {
    const isSafe = decision.riskBand === 'SAFE';
    const timeContext = intents.includes('SAFETY_TOMORROW') ? ' forecasted for tomorrow' : ' current';
    const intro = isSafe 
      ? `Yes, based on the${timeContext} conditions, this zone is suitable for your ${context.boatType}.` 
      : `I would advise caution for your ${context.boatType} in this zone based on the${timeContext} conditions.`;
    const windWave = env?.windSpeedKmph && env?.significantWaveHeightM 
      ? ` Predicted wind speeds are ${env.windSpeedKmph} km/h and waves are ${env.significantWaveHeightM} m.` : '';
    summaries.push(`${intro}\n\nThe overall environmental risk is classified as **${decision.riskBand}**. ${decision.reasons.join('. ')}${windWave}`);
  }

  if (intents.includes('WIND_FORECAST')) {
    summaries.push(env?.windSpeedKmph !== null 
      ? `The forecasted wind speed is **${env?.windSpeedKmph} km/h**.\n\nThis is evaluated against your vessel's upper limit of ${windLimit} km/h, resulting in a safety band of **${decision.riskBand}**.`
      : `Wind forecast data is not available in the baseline dataset.`);
  }

  if (intents.includes('WAVE_HEIGHT')) {
    if (!isMarine) {
      summaries.push(`Marine metrics like wave height are inapplicable to ${context.locationName} because it's inland.\n\nHowever, the overall weather risk is currently classified as **${decision.riskBand}**.`);
    } else {
      summaries.push(env?.significantWaveHeightM !== null 
        ? `The significant wave height is forecasted at **${env?.significantWaveHeightM} meters**.\n\nThis is evaluated against your vessel's upper limit of ${waveLimit} meters, resulting in a safety band of **${decision.riskBand}**.`
        : `Wave height data is not available in the baseline dataset.`);
    }
  }

  if (intents.includes('CURRENT_COASTAL_CONDITIONS')) {
    if (!isMarine) summaries.push(`Marine metrics like ocean currents are inapplicable to ${context.locationName} because it's inland.`);
    else summaries.push(env?.surfaceCurrentSpeedMs !== null ? `The ocean surface current is moving at **${env?.surfaceCurrentSpeedMs} m/s** toward **${env?.surfaceCurrentDirectionDeg}°**.\n\nCurrents play a key role in nutrient transport and are scored as part of the overall productivity model.` : `Current data is not available for this location.`);
  }

  if (intents.includes('SST_CONDITIONS')) {
    if (!isMarine) summaries.push(`Marine metrics like sea surface temperature (SST) are inapplicable to ${context.locationName} because it's inland.`);
    else summaries.push(env?.seaSurfaceTemperatureC !== null ? `The sea surface temperature (SST) here is **${env?.seaSurfaceTemperatureC} °C**.\n\nOptimal SST (typically 27-31°C) is crucial for the aggregation of commercially important pelagic species.` : `SST data is not available for this location.`);
  }

  if (intents.includes('MLD_CONDITIONS')) {
    if (!isMarine) summaries.push(`Marine metrics like mixed layer depth are inapplicable to ${context.locationName} because it's inland.`);
    else summaries.push(env?.mixedLayerDepthM !== null ? `The mixed layer depth (MLD) here is **${env?.mixedLayerDepthM} meters**.\n\nA shallower MLD tends to concentrate nutrients and fish in the upper water column, making them more accessible.` : `MLD data is not available for this location.`);
  }

  if (intents.includes('D20_CONDITIONS')) {
    if (!isMarine) summaries.push(`Marine metrics like D20 depth are inapplicable to ${context.locationName} because it's inland.`);
    else summaries.push(env?.d20DepthM !== null ? `The D20 isotherm (20°C boundary) depth here is **${env?.d20DepthM} meters**.\n\nThis thermocline depth influences the vertical distribution of both prey and predatory fish species.` : `D20 depth data is not available for this location.`);
  }

  if (intents.includes('COMPARE_ZONES')) {
    if (decision.marineRecommendations && decision.marineRecommendations.length > 1) {
      const top = decision.marineRecommendations[0];
      const second = decision.marineRecommendations[1];
      summaries.push(`**${top.facilityName}** has stronger fishing potential (Score: ${top.productivityEvaluation?.productivityScore}/100) compared to **${second.facilityName}**.\n\nBoth locations have been evaluated for your ${context.boatType}'s safety limits.`);
    } else {
      summaries.push(`I only have sufficient data to analyze one primary zone for this request.`);
    }
  }

  if (summaries.length === 0) {
    if (intents.includes('FACTOR_EXPLANATION')) summaries.push(`This factor is a key environmental indicator used by TARANG to estimate fishing productivity. \n\nIt is normalized against historical ranges and weighted alongside other factors like SST and Chlorophyll. Please note, this shows how the factor is used mathematically in the scoring model, rather than claiming a direct biological guarantee.`);
    else if (intents.some(i => ['SCORE_BREAKDOWN', 'PRODUCTIVITY_METHODOLOGY'].includes(i))) summaries.push(`The total productivity score for this zone is **${response.productivityAnalysis?.productivityScore ?? 0}/100**.\n\nThis is a composite score calculated deterministically from six static environmental factors: PFZ potential (40%), Chlorophyll (30%), SST (10%), Surface current (10%), Mixed Layer Depth (5%), and D20 depth (5%).`);
    else if (intents.includes('SAFETY_METHODOLOGY')) summaries.push(`Safety is evaluated by comparing the historical wind and wave conditions against the specific operating limits of your vessel (${context.boatType}).\n\n${response.methodology?.safety?.join(' ') ?? ''}`);
    else if (intents.some(i => ['DATA_SOURCE', 'DATA_AVAILABILITY'].includes(i))) summaries.push(`The analysis you are seeing is powered by the TARANG historical seasonal dataset. \n\nIt provides reliable baseline climatology and modeled environmental conditions, though it does not use live satellite imagery or real-time buoy feeds.`);
    else if (intents.includes('PRODUCTIVITY_ANALYSIS')) summaries.push(response.productivityAnalysis?.insights ? `This zone is highly productive primarily due to its strong underlying environmental factors. \n\n${response.productivityAnalysis.insights}` : 'Detailed productivity insights are not available in the baseline dataset for this specific location.');
    else if (intents.includes('WHY_RECOMMENDED')) summaries.push(`I recommended this location because it offers the best available trade-off for you right now.\n\nIt has a strong fishing productivity potential (${response.productivityAnalysis?.productivityScore ?? 'N/A'}/100) while keeping wind and wave conditions safely within the operating limits of your ${context.boatType}.`);
    else if (intents.includes('DISTANCE_ANALYSIS')) summaries.push(`The primary recommended location, ${topMarine?.facilityName}, is approximately ${topMarine?.distanceKm ?? 'N/A'} km away.\n\nThis distance is calculated using the static registry coordinates for the facility.`);
    else {
      if (!isMarine) summaries.push(`This inland location has a general weather risk band of **${decision.riskBand}**. Marine metrics are inapplicable here.`);
      else summaries.push(`Based on the latest analysis, the overall risk for this location is **${decision.riskBand}**.`);
    }
  }

  response.summary = summaries.join('\n\n---\n\n');

  return response;
}
