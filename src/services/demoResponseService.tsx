import { type IntentCategory } from "../data/questionBank";
import { getAnswerForLanguageAndLocation } from "./multilingualHelper";
import type { SupportedLanguage } from "./languageService";

export interface ChatResponse {
  text: string;
  action: "NONE" | "VIEW_MAP_FISHING" | "VIEW_MAP_RISK" | "VIEW_MAP_RESTRICTED" | "VIEW_ROUTE" | "DEMO_CONFIRM";
  intent: string | null;
}

export function generateResponse(intent: IntentCategory, location: string, language: SupportedLanguage): ChatResponse {
  if (intent === "UNKNOWN") {
    // English fallback
    let text = "I can help with sea safety, fishing zones, weather conditions, trip planning and safer routes. Try asking me about one of these.";
    // Generic translated fallbacks
    if (language === "Hindi") text = "मैं समुद्र की सुरक्षा, मछली पकड़ने के क्षेत्रों, मौसम की स्थिति और सुरक्षित मार्गों में मदद कर सकता हूँ। इनमें से किसी के बारे में पूछने का प्रयास करें।";
    else if (language === "Malayalam") text = "കടൽ സുരക്ഷ, മത്സ്യബന്ധന മേഖലകൾ, കാലാവസ്ഥ എന്നിവയിൽ എനിക്ക് സഹായിക്കാനാകും. ഇതിൽ എന്തെങ്കിലും ചോദിക്കാൻ ശ്രമിക്കുക.";
    else if (language === "Gujarati") text = "હું સમુદ્ર સુરક્ષા, માછીમારી વિસ્તારો અને હવામાનની સ્થિતિમાં મદદ કરી શકું છું. આમાંથી કોઈ વિશે પૂછવાનો પ્રયાસ કરો.";
    else if (language === "Tamil") text = "கடல் பாதுகாப்பு, மீன்பிடி பகுதிகள், வானிலை நிலைமைகள் குறித்து நான் உதவ முடியும். இவற்றில் ஒன்றைக் கேட்க முயற்சிக்கவும்.";
    else if (language === "Telugu") text = "సముద్ర భద్రత, చేపలు పట్టే ప్రాంతాలు, వాతావరణం గురించి నేను సహాయం చేయగలను. వీటి గురించి అడగడానికి ప్రయత్నించండి.";
    else if (language === "Kannada") text = "ಸಮುದ್ರ ಸುರಕ್ಷತೆ, ಮೀನುಗಾರಿಕೆ ವಲಯಗಳು, ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇವುಗಳಲ್ಲಿ ಯಾವುದಾದರೂ ಬಗ್ಗೆ ಕೇಳಲು ಪ್ರಯತ್ನಿಸಿ.";
    else if (language === "Bengali") text = "আমি সমুদ্র নিরাপত্তা, মাছ ধরার অঞ্চল এবং আবহাওয়া পরিস্থিতি সম্পর্কে সাহায্য করতে পারি। এগুলোর কোনোটি সম্পর্কে জিজ্ঞাসা করার চেষ্টা করুন।";

     return {
       text,
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

  const answer = getAnswerForLanguageAndLocation(intent, location, language);
  
  if (!answer) {
    return { 
      text: "I couldn't find information for that request. Please try rephrasing your question.", 
      action: "NONE",
      intent
    };
  }

  let action: ChatResponse["action"] = "NONE";
  if (intent === "NEAREST_PFZ" || intent === "BEST_FISHING_ZONE" || intent === "CHLOROPHYLL_ZONE") action = "VIEW_MAP_FISHING";
  else if (intent === "AVOID_ZONE") action = "VIEW_MAP_RISK";
  else if (intent === "RESTRICTED_ZONE") action = "VIEW_MAP_RESTRICTED";
  else if (intent === "SAFE_ROUTE") action = "VIEW_ROUTE";

  return { text: answer, action, intent };
}
