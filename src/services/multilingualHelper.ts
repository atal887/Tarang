import { questionBank, type IntentCategory } from "../data/questionBank";
import type { SupportedLanguage } from "./languageService";

const CITY_MAPPING = {
  Kochi: { en: "Kochi", hi: "कोच्चि", ml: "കൊച്ചി" },
  Mangalore: { en: "Mangalore", hi: "मैंगलोर", kn: "ಮಂಗಳೂರು" },
  Veraval: { en: "Veraval", hi: "वेरावल", gu: "વેરાવળ" },
  Chennai: { en: "Chennai", hi: "चेन्नई", ta: "சென்னை" },
  Visakhapatnam: { en: "Visakhapatnam", hi: "विशाखापत्तनम", te: "విశాఖపట్నం" },
  Digha: { en: "Digha", hi: "दीघा", bn: "দীঘা" }
};

export const LANGUAGE_CITY_MAP: Record<string, string> = {
  Malayalam: "Kochi",
  Kannada: "Mangalore",
  Gujarati: "Veraval",
  Tamil: "Chennai",
  Telugu: "Visakhapatnam",
  Bengali: "Digha"
};

export function getAnswerForLanguageAndLocation(intent: IntentCategory, location: string, language: SupportedLanguage): string {
  // 1. Get the source item that has the translation for the requested language
  let sourceItem;
  if (language === "English" || language === "Hindi") {
    // Both English and Hindi are available in all items, just use the item for the requested location if it exists
    sourceItem = questionBank.find(q => q.intent === intent && q.city.toLowerCase() === location.toLowerCase()) 
                 || questionBank.find(q => q.intent === intent);
  } else {
    // For regional languages, we MUST use the item from the city that defines that language
    const sourceCity = LANGUAGE_CITY_MAP[language];
    sourceItem = questionBank.find(q => q.intent === intent && q.city === sourceCity);
  }

  if (!sourceItem) return "";

  // 2. Extract the raw answer text
  let rawText = sourceItem.english.a;
  if (language === "Hindi") rawText = sourceItem.hindi.a;
  else if (language !== "English") rawText = sourceItem.regional.a;

  // 3. If the language was regional, the text might mention the source city. Replace it with the target location.
  if (language !== "English" && language !== "Hindi") {
    const sourceCity = sourceItem.city;
    if (sourceCity.toLowerCase() !== location.toLowerCase()) {
      // Replace English name
      rawText = rawText.replace(new RegExp(sourceCity, "gi"), location);
      
      // We don't have a robust reverse mapping for every regional spelling of every city,
      // but TARANG mostly uses English names in the regional translations (e.g., "Kochi-ന്", "Veraval નજીક")
    }
  } else if (language === "Hindi") {
     const sourceCity = sourceItem.city;
     if (sourceCity.toLowerCase() !== location.toLowerCase()) {
       rawText = rawText.replace(new RegExp(sourceCity, "gi"), location);
       // Replace Hindi name if it's there
       const sourceCityData = Object.values(CITY_MAPPING).find(c => c.en === sourceCity);
       const targetCityData = Object.values(CITY_MAPPING).find(c => c.en.toLowerCase() === location.toLowerCase());
       if (sourceCityData && targetCityData && sourceCityData.hi) {
         rawText = rawText.replace(new RegExp(sourceCityData.hi, "gi"), targetCityData.hi || location);
       }
     }
  }

  return rawText;
}

export function detectLocationInQuery(query: string, defaultLocation: string): string {
  const qLower = query.toLowerCase();
  
  if (qLower.includes("kochi") || qLower.includes("കൊച്ചി") || qLower.includes("कोच्चि")) return "Kochi";
  if (qLower.includes("mangalore") || qLower.includes("ಮಂಗಳೂರು") || qLower.includes("मैंगलोर")) return "Mangalore";
  if (qLower.includes("veraval") || qLower.includes("વેરાવળ") || qLower.includes("वेरावल")) return "Veraval";
  if (qLower.includes("chennai") || qLower.includes("சென்னை") || qLower.includes("चेन्नई")) return "Chennai";
  if (qLower.includes("visakhapatnam") || qLower.includes("vizag") || qLower.includes("విశాఖపట్నం") || qLower.includes("विशाखापत्तनम")) return "Visakhapatnam";
  if (qLower.includes("digha") || qLower.includes("দীঘা") || qLower.includes("दीघा")) return "Digha";

  return defaultLocation;
}
