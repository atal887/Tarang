import { questionBank, type IntentCategory } from "../data/questionBank";
import { type SupportedLanguage } from "./languageService";
import { LANGUAGE_CITY_MAP } from "./multilingualHelper";

export function detectIntent(query: string, language: SupportedLanguage): IntentCategory[] {
  const q = query.toLowerCase().trim();
  
  // 1. Exact match across all items and all 3 strings (english, hindi, regional)
  for (const item of questionBank) {
    if (item.english.q.toLowerCase() === q || item.hindi.q.toLowerCase() === q || item.regional.q.toLowerCase() === q) {
      return [item.intent as IntentCategory];
    }
  }

  // 2. English Regex-based intent rules (Order matters: most specific first)
  if (language === "English") {
    const rules: { regex: RegExp; intent: IntentCategory }[] = [
      // Explanations / Why
      { regex: /\bwhy\s+(is\s+this|did\s+you)\s+(zone\s+)?not\s+recommend(ed)?\b/i, intent: "WHY_NOT_RECOMMENDED" },
      { regex: /\bwhy\s+is\s+this\s+place\s+not\s+recommended\b/i, intent: "WHY_NOT_RECOMMENDED" },
      { regex: /\bwhy\s+(is\s+this|did\s+you)\s+(zone\s+)?recommend(ed)?\b/i, intent: "WHY_RECOMMENDED" },
      { regex: /\bwhat\s+makes\s+this\s+(zone|area)\s+better\b/i, intent: "WHY_RECOMMENDED" },
      { regex: /\bwhy\s+is\s+this\s+(area|zone|place)\s+safer\b/i, intent: "SAFETY_ANALYSIS" },
      { regex: /\bwhy\s+is\s+this\s+(zone|area)\s+(unsafe|dangerous)\b/i, intent: "SAFETY_ANALYSIS" },
      { regex: /\b(safest|safer|risks|risk)\b/i, intent: "SAFETY_ANALYSIS" },
      { regex: /\bwhy\s+is\s+this\s+(zone|area)\s+productive\b/i, intent: "PRODUCTIVITY_ANALYSIS" },
      
      // Methodology & Data
      { regex: /\bhow\s+is\s+(the\s+)?safety\s+calculated\b/i, intent: "SAFETY_METHODOLOGY" },
      { regex: /\bhow\s+is\s+(the\s+)?(productivity\s+score|productivity|score)\s+calculated\b/i, intent: "SCORE_BREAKDOWN" },
      { regex: /\b(break\s+down|score\s+breakdown)\b/i, intent: "SCORE_BREAKDOWN" },
      { regex: /\b(data|satellite\s+data|where\s+does\s+the\s+data\s+come\s+from)\b/i, intent: "DATA_SOURCE" },
      { regex: /\b(how|why)\s+does\s+.*affect\b/i, intent: "FACTOR_EXPLANATION" },

      // Temporal Planning (Specific)
      { regex: /\b(3|three)[\s-]*day\b/i, intent: "MULTI_DAY_TRIP" },
      { regex: /\bweekend\b/i, intent: "WEEKEND_FISHING" },
      { regex: /\bnight(time)?\b/i, intent: "NIGHT_VISIBILITY" },
      { regex: /\b(safest|best)\s+time\b/i, intent: "SAFEST_TIME" },

      // Safety & Planning (General - Temporal gets priority over specific conditions)
      { regex: /(?=.*\btomorrow\b)(?=.*\b(safe|okay|go|go\s+out|rough|fish|fishing)\b)/i, intent: "SAFETY_TOMORROW" },

      // Weather / Conditions Parameters (Specific)
      { regex: /\b(sst|sea\s+surface\s+temperature|water\s+temperature|temperature)\b/i, intent: "SST_CONDITIONS" },
      { regex: /(?=.*\b(deep|depth)\b)(?=.*\b(warm\s+water)\b)/i, intent: "MLD_CONDITIONS" },
      { regex: /(?=.*\b(warm|cold)\b)(?=.*\b(water|sea)\b)/i, intent: "SST_CONDITIONS" },
      { regex: /\b(mld|mixed\s+layer|mixed\s+layer\s+depth|thermocline)\b/i, intent: "MLD_CONDITIONS" },
      { regex: /\b(d20|d-20|d\s+20)\b/i, intent: "D20_CONDITIONS" },
      { regex: /\b(wave|waves)\b/i, intent: "WAVE_HEIGHT" },
      { regex: /(?=.*\b(rough|calm)\b)(?=.*\b(sea|water)\b)/i, intent: "WAVE_HEIGHT" },
      { regex: /\b(wind|windy|winds)\b/i, intent: "WIND_FORECAST" },
      { regex: /\bcyclone\b/i, intent: "CYCLONE_ALERT" },
      
      // Disambiguate 'current'
      { regex: /\b(current\s+conditions|current\s+situation|current\s+weather)\b/i, intent: "BOAT_SAFETY" },
      { regex: /\b(ocean|surface)\s+current(s)?\b/i, intent: "CURRENT_COASTAL_CONDITIONS" },
      { regex: /(?=.*\bcurrent(s)?\b)(?=.*\b(speed|strong|flow|direction|moving|water|sea|ocean)\b)/i, intent: "CURRENT_COASTAL_CONDITIONS" },
      
      { regex: /\b(chlorophyll|plankton|food\s+for\s+fish|water\s+green)\b/i, intent: "CHLOROPHYLL_ZONE" },

      // Fishing / Productivity (General) - Put this before Safety so 'best conditions for fishing' isn't hijacked by 'conditions'
      { regex: /(?=.*\b(nearest|closest)\b)(?=.*\b(pfz|fishing\s+zone)\b)/i, intent: "NEAREST_PFZ" },
      { regex: /(?=.*\b(best|good)\b)(?=.*\b(fishing|zone|area|place)\b)/i, intent: "BEST_FISHING_ZONE" },
      { regex: /\bwhere\s+(should\s+i|can\s+i|am\s+i\s+likely\s+to)\s+(fish|go\s+for\s+fishing|get\s+better\s+fishing)\b/i, intent: "BEST_FISHING_ZONE" },
      { regex: /\b(better|more)\s+(fishing\s+potential|productive)\b/i, intent: "BEST_FISHING_ZONE" },
      { regex: /\bpfz\b/i, intent: "NEAREST_PFZ" },

      // Safety & Planning (General)
      { regex: /\b(safe|dangerous|conditions)\b/i, intent: "BOAT_SAFETY" },
      { regex: /\b(my\s+boat|motorized|mechanized|non-motorized)\b/i, intent: "BOAT_SAFETY" },
      { regex: /\broute\b/i, intent: "SAFE_ROUTE" },
      { regex: /\b(avoid|restricted)\b/i, intent: "AVOID_ZONE" },
      { regex: /\bpfz\b/i, intent: "NEAREST_PFZ" },

      // Comparison / Distance
      { regex: /\bcompare\b/i, intent: "COMPARE_ZONES" },
      { regex: /\b(distance|how\s+far|closer)\b/i, intent: "DISTANCE_ANALYSIS" },
    ];

    const detectedIntents = new Set<IntentCategory>();
    let remaining = q;
    
    for (const rule of rules) {
      if (rule.regex.test(remaining)) {
        detectedIntents.add(rule.intent);
        remaining = remaining.replace(rule.regex, " ");
      }
    }
    
    if (detectedIntents.size > 0) {
      return Array.from(detectedIntents);
    }
  }
  
  // 3. Multilingual keyword/fuzzy matching
  const queryWords = q.split(/\s+/).filter(w => w.length > 2);
  let bestMatch = "UNKNOWN";
  let maxScore = 0;
  
  // Filter the question bank to only the items that have text for the detected language
  // English and Hindi are everywhere. Regional languages are only in their specific city's items.
  let targetItems = questionBank;
  if (language !== "English" && language !== "Hindi") {
    const targetCity = LANGUAGE_CITY_MAP[language];
    targetItems = questionBank.filter(item => item.city === targetCity);
  }

  for (const item of targetItems) {
    let targetString = item.english.q.toLowerCase();
    if (language === "Hindi") targetString = item.hindi.q.toLowerCase();
    else if (language !== "English") targetString = item.regional.q.toLowerCase();

    const bankWords = targetString.split(/\s+/);
    let score = 0;
    
    // Simple word intersection
    for (const w of queryWords) {
      if (bankWords.some(bw => bw.includes(w) || w.includes(bw))) {
        score++;
      }
    }
    
    // Weight the score based on the length of the query
    // If we matched 2 words out of a 4 word query, that's better than 2 out of 10.
    const normalizedScore = score / Math.max(queryWords.length, 1);
    
    // Also penalize if we match 1 word out of a 10 word question bank query
    const bankPenalty = score / Math.max(bankWords.length, 1);
    
    const combinedScore = score + normalizedScore + bankPenalty;
    
    // Strict threshold: to avoid "Why?" matching randomly, require strong match.
    // For single word queries, score must be 1.0 (exact match with a long word).
    // Let's set a higher bar to avoid false positives.
    if (combinedScore > maxScore && score >= 1) {
      // Don't let single-word ambiguous queries fuzzy match randomly
      if (queryWords.length === 1 && queryWords[0].replace(/[^a-z]/gi, '') === 'why') {
        continue;
      }
      
      maxScore = combinedScore;
      bestMatch = item.intent;
    }
  }
  
  // Need at least a raw score of 1 and normalized > 0 to match.
  // We'll enforce that maxScore must be > 1.2 to be confident, UNLESS it's an exact match handled earlier.
  return maxScore > 1.2 ? [bestMatch as IntentCategory] : ["UNKNOWN"];
}
