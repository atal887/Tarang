import { questionBank, type IntentCategory } from "../data/questionBank";

export function detectIntent(query: string): IntentCategory {
  const q = query.toLowerCase().trim();
  
  for (const item of questionBank) {
    if (item.english.q.toLowerCase() === q || item.hindi.q.toLowerCase() === q || item.regional.q.toLowerCase() === q) {
      return item.intent as IntentCategory;
    }
  }

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
  
  const queryWords = q.split(/\W+/).filter(w => w.length > 2);
  let bestMatch = "UNKNOWN";
  let maxScore = 0;
  
  for (const item of questionBank) {
    const bankWords = item.english.q.toLowerCase().split(/\W+/);
    let score = 0;
    for (const w of queryWords) {
      if (bankWords.includes(w)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item.intent;
    }
  }
  
  return maxScore >= 2 ? (bestMatch as IntentCategory) : "UNKNOWN";
}
