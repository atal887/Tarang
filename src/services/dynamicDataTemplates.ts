import type { SupportedLanguage } from "./languageService";
import { locationData } from "../data/demoData";

export function getDynamicContextSuffix(location: string, boatType: string, language: SupportedLanguage, intent: string): string {
  const data = locationData[location.toLowerCase()];
  if (!data) return "";

  // Only append dynamic data for weather/safety/fishing intents
  const relevantIntents = [
    "SAFETY_TOMORROW", "WAVE_HEIGHT", "WIND_FORECAST", "BOAT_SAFETY", 
    "CURRENT_COASTAL_CONDITIONS", "BEST_FISHING_ZONE", "NEAREST_PFZ"
  ];

  if (!relevantIntents.includes(intent)) return "";

  const { wind, windDesc, waves, safetyStatus } = data;

  switch (language) {
    case "Hindi":
      return `\n\n${location} के लिए वर्तमान डेटा: हवा ${wind} (${windDesc}) है, लहरें ${waves} हैं। ${boatType} के लिए, यह ${safetyStatus} है।`;
    case "Gujarati":
      return `\n\n${location} માટે વર્તમાન ડેટા: પવન ${wind} (${windDesc}) છે, મોજા ${waves} છે. ${boatType} માટે, તે ${safetyStatus} છે.`;
    case "Tamil":
      return `\n\n${location} க்கான தற்போதைய தரவு: காற்று ${wind} (${windDesc}), அலைகள் ${waves}. ${boatType} க்கு, இது ${safetyStatus}.`;
    case "Bengali":
      return `\n\n${location} এর বর্তমান ডেটা: বাতাস ${wind} (${windDesc}), ঢেউ ${waves}। ${boatType} এর জন্য, এটি ${safetyStatus}।`;
    case "Telugu":
      return `\n\n${location} కోసం ప్రస్తుత డేటా: గాలి ${wind} (${windDesc}), అలలు ${waves}. ${boatType} కోసం, ఇది ${safetyStatus}.`;
    case "Kannada":
      return `\n\n${location} ಗಾಗಿ ಪ್ರಸ್ತುತ ಡೇಟಾ: ಗಾಳಿ ${wind} (${windDesc}), ಅಲೆಗಳು ${waves}. ${boatType} ಗಾಗಿ, ಇದು ${safetyStatus}.`;
    case "Malayalam":
      return `\n\n${location} ലെ നിലവിലെ വിവരങ്ങൾ: കാറ്റ് ${wind} (${windDesc}), തിരമാലകൾ ${waves}. നിങ്ങളുടെ ${boatType}-ന്, ഇത് ${safetyStatus}.`;
    case "English":
    default:
      return `\n\nCurrent data for ${location}: Wind is ${wind} (${windDesc}), Waves are ${waves}. For your ${boatType}, conditions are ${safetyStatus}.`;
  }
}
