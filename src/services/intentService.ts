import { questionBank, type IntentCategory } from "../data/questionBank";
import { type SupportedLanguage } from "./languageService";
import { LANGUAGE_CITY_MAP } from "./multilingualHelper";

export function detectIntent(query: string, language: SupportedLanguage): IntentCategory {
  const q = query.toLowerCase().trim();
  
  // 1. Exact match across all items and all 3 strings (english, hindi, regional)
  for (const item of questionBank) {
    if (item.english.q.toLowerCase() === q || item.hindi.q.toLowerCase() === q || item.regional.q.toLowerCase() === q) {
      return item.intent as IntentCategory;
    }
  }

  // 2. English hardcoded fallback rules (these are safe to keep for English queries)
  if (language === "English") {
    if (q.includes("tomorrow") && q.includes("safe") && !q.includes("3-day") && !q.includes("three")) return "SAFETY_TOMORROW";
    if (q.includes("pfz") || q.includes("potential fishing zone") || q.includes("nearest")) return "NEAREST_PFZ";
    if (q.includes("wave")) return "WAVE_HEIGHT";
    if (q.includes("cyclone")) return "CYCLONE_ALERT";
    if (q.includes("3-day") || q.includes("trip") || q.includes("three day")) return "MULTI_DAY_TRIP";
    if (q.includes("route")) return "SAFE_ROUTE";
    if (q.includes("chlorophyll")) return "CHLOROPHYLL_ZONE";
    if (q.includes("avoid")) return "AVOID_ZONE";
    if (q.includes("wind")) return "WIND_FORECAST";
    if (q.includes("motorized") || q.includes("boat safe") || q.includes("my boat")) return "BOAT_SAFETY";
    if (q.includes("not recommended") || q.includes("why")) return "WHY_NOT_RECOMMENDED";
    if (q.includes("safest time") || q.includes("what time")) return "SAFEST_TIME";
    if (q.includes("restricted")) return "RESTRICTED_ZONE";
    if (q.includes("current")) return "CURRENT_COASTAL_CONDITIONS";
    if (q.includes("visibility") || q.includes("night")) return "NIGHT_VISIBILITY";
    if (q.includes("weekend")) return "WEEKEND_FISHING";
    if (q.includes("best fishing zone") || q.includes("best zone")) return "BEST_FISHING_ZONE";
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
    
    // Use raw score for thresholding, normalized score for tie breaking
    const combinedScore = score + normalizedScore;
    
    if (combinedScore > maxScore) {
      maxScore = combinedScore;
      bestMatch = item.intent;
    }
  }
  
  // Need at least 1 strong word match (so raw score >= 1) to avoid random matching
  return Math.floor(maxScore) >= 1 ? (bestMatch as IntentCategory) : "UNKNOWN";
}
