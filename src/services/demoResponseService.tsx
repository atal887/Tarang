import { questionBank, type IntentCategory } from "../data/questionBank";

export type Language = "English" | "Hindi" | "Malayalam" | "Kannada" | "Gujarati" | "Tamil" | "Telugu" | "Bengali";

export interface DemoResponse {
  answerComponent: React.ReactNode;
  audioText: string;
  action: "NONE" | "VIEW_MAP_FISHING" | "VIEW_MAP_RISK" | "VIEW_MAP_RESTRICTED" | "VIEW_ROUTE" | "DEMO_CONFIRM";
}

export function generateResponse(intent: IntentCategory, location: string, language: string): DemoResponse {
  if (intent === "UNKNOWN") {
     return {
       answerComponent: "I can help with sea safety, fishing zones, weather conditions, trip planning and safer routes. Try asking me about one of these.",
       audioText: "I can help with sea safety, fishing zones, weather conditions, trip planning and safer routes. Try asking me about one of these.",
       action: "NONE"
     };
  }

  if (intent === "MULTI_DAY_TRIP") {
     return {
       answerComponent: "",
       audioText: "",
       action: "DEMO_CONFIRM"
     };
  }

  let locationItems = questionBank.filter(q => q.city.toLowerCase() === location.toLowerCase());
  if (locationItems.length === 0) {
    locationItems = questionBank.filter(q => q.city === "Kochi");
  }

  const match = locationItems.find(q => q.intent === intent);
  if (!match) {
    return { 
      answerComponent: "I couldn't find data for that specific request in this demo location.", 
      audioText: "I couldn't find data for that specific request in this demo location.",
      action: "NONE" 
    };
  }

  let rawText = match.english.a;
  if (language === "Hindi") rawText = match.hindi.a;
  else if (language !== "English") rawText = match.regional.a;

  // Generate clean text for audio
  let cleanText = rawText
    .replace(/in the demo scenario,?/gi, "")
    .replace(/demo forecast/gi, "forecast")
    .replace(/demo /gi, "")
    .replace(/Treat this as demonstration data, not a live observation\.?/gi, "")
    .replace(/for the selected demo period/gi, "for the selected period")
    .trim();
    
  // Capitalize first letter if it got messed up
  const audioText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
  let answerComponent: React.ReactNode = rawText;

  // Create structured responses for key intents
  if (intent === "SAFE_ROUTE" && language === "English") {
     answerComponent = (
       <div className="space-y-4">
         <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 border-b border-ocean-100 pb-2">Safe Route Recommendation</h4>
         
         <div className="grid grid-cols-2 gap-4">
           <div>
             <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">From</span>
             <span className="font-semibold text-slate-800">{location} Harbour</span>
           </div>
           <div>
             <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">To</span>
             <span className="font-semibold text-slate-800">Recommended Fishing Zone</span>
           </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
           <div>
             <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Distance</span>
             <span className="font-semibold text-slate-800">18.4 km</span>
           </div>
           <div>
             <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Est. Travel Time</span>
             <span className="font-semibold text-slate-800">1h 12m</span>
           </div>
         </div>
         
         <div>
           <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Route Risk</span>
           <span className="inline-flex items-center text-sm font-bold text-status-safe">
             Low
           </span>
         </div>
         
         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
           <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Recommendation</span>
           <span className="text-sm text-slate-700">This route avoids the higher-risk areas identified along the surrounding sea grid and provides the lowest-risk path to the recommended fishing zone.</span>
         </div>
       </div>
     );
  } else if ((intent === "NEAREST_PFZ" || intent === "BEST_FISHING_ZONE") && language === "English") {
     answerComponent = (
       <div className="space-y-4">
         <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 border-b border-ocean-100 pb-2">Nearest Recommended Fishing Zone</h4>
         
         <div>
           <span className="font-semibold text-slate-800 text-lg">Zone A</span>
           <span className="block text-sm text-slate-500">Approximately 18 km from {location} Harbour</span>
         </div>
         
         <div>
           <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Risk Assessment</span>
           <span className="font-bold text-status-safe">28/100 · Low Risk</span>
         </div>
         
         <div>
           <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Conditions</span>
           <span className="text-sm text-slate-700">Sea conditions are relatively calm and wind is moderate. No major weather warning is affecting the recommended area.</span>
         </div>
         
         <div>
           <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Fishing Potential</span>
           <span className="text-sm font-bold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded">High</span>
         </div>
         
         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
           <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Why this zone?</span>
           <span className="text-sm text-slate-700">It provides a good balance between current safety conditions and fishing potential for your selected boat type.</span>
         </div>
       </div>
     );
  } else if (intent === "SAFETY_TOMORROW" && language === "English") {
     answerComponent = (
       <div className="space-y-4">
         <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 border-b border-ocean-100 pb-2">Safety Analysis</h4>
         
         <div className="grid grid-cols-2 gap-4">
           <div>
             <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Location</span>
             <span className="font-semibold text-slate-800">{location} Coast</span>
           </div>
           <div>
             <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Risk Score</span>
             <span className="font-bold text-status-safe">Low Risk</span>
           </div>
         </div>
         
         <div className="bg-status-safeBg border border-status-safe/20 p-3 rounded-lg">
           <span className="block text-xs font-bold text-status-safeText uppercase mb-1">Recommendation</span>
           <span className="text-sm text-slate-700">Current conditions are favourable for your boat type, with relatively calm sea conditions and moderate wind. It is safe to proceed.</span>
         </div>
       </div>
     );
  }

  let action: DemoResponse["action"] = "NONE";
  if (intent === "NEAREST_PFZ" || intent === "BEST_FISHING_ZONE" || intent === "CHLOROPHYLL_ZONE") action = "VIEW_MAP_FISHING";
  else if (intent === "AVOID_ZONE") action = "VIEW_MAP_RISK";
  else if (intent === "RESTRICTED_ZONE") action = "VIEW_MAP_RESTRICTED";
  else if (intent === "SAFE_ROUTE") action = "VIEW_ROUTE";

  return { answerComponent, audioText, action };
}
