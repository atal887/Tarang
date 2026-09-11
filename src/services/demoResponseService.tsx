import { questionBank, type IntentCategory } from "../data/questionBank";

export type Language = "English" | "Hindi" | "Malayalam" | "Kannada" | "Gujarati" | "Tamil" | "Telugu" | "Bengali";

export interface ChatResponse {
  text: string;
  action: "NONE" | "VIEW_MAP_FISHING" | "VIEW_MAP_RISK" | "VIEW_MAP_RESTRICTED" | "VIEW_ROUTE" | "DEMO_CONFIRM";
  intent: string | null;
}

export function generateResponse(intent: IntentCategory, location: string, language: string): ChatResponse {
  if (intent === "UNKNOWN") {
     return {
       text: "I can help with sea safety, fishing zones, weather conditions, trip planning and safer routes. Try asking me about one of these.",
       action: "NONE",
       intent
     };
  }

  if (intent === "MULTI_DAY_TRIP") {
     return {
       text: "",
       action: "DEMO_CONFIRM",
       intent
     };
  }

  let locationItems = questionBank.filter(q => q.city.toLowerCase() === location.toLowerCase());
  if (locationItems.length === 0) {
    locationItems = questionBank.filter(q => q.city === "Kochi");
  }

  const match = locationItems.find(q => q.intent === intent);
  if (!match) {
    return { 
      text: "I couldn't find information for that request. Please try rephrasing your question.", 
      action: "NONE",
      intent
    };
  }

  let rawText = match.english.a;
  if (language === "Hindi") rawText = match.hindi.a;
  else if (language !== "English") rawText = match.regional.a;

  let action: ChatResponse["action"] = "NONE";
  if (intent === "NEAREST_PFZ" || intent === "BEST_FISHING_ZONE" || intent === "CHLOROPHYLL_ZONE") action = "VIEW_MAP_FISHING";
  else if (intent === "AVOID_ZONE") action = "VIEW_MAP_RISK";
  else if (intent === "RESTRICTED_ZONE") action = "VIEW_MAP_RESTRICTED";
  else if (intent === "SAFE_ROUTE") action = "VIEW_ROUTE";

  return { text: rawText, action, intent };
}
