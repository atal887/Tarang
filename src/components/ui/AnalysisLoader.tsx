import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export type AnalysisType = "route" | "safety" | "pfz" | "weather" | "trip" | "general";

interface AnalysisLoaderProps {
  type: AnalysisType;
  duration: number;
}

export function AnalysisLoader({ type, duration }: AnalysisLoaderProps) {
  const [step, setStep] = useState(0);
  
  const messages = {
    safety: [
      "Fetching sea conditions...",
      "Checking wind and wave conditions...",
      "Evaluating safety limits...",
      "Calculating your risk score...",
      "Preparing your recommendation..."
    ],
    pfz: [
      "Checking nearby fishing zones...",
      "Analysing ocean conditions...",
      "Evaluating fishing potential...",
      "Comparing safety conditions...",
      "Selecting the best zone..."
    ],
    weather: [
      "Fetching weather conditions...",
      "Checking wind forecast...",
      "Checking sea state...",
      "Evaluating fishing conditions..."
    ],
    route: [
      "Understanding your destination...",
      "Fetching sea and weather conditions...",
      "Mapping nearby risk zones...",
      "Evaluating possible routes...",
      "Comparing route safety...",
      "Optimising the safest path...",
      "Checking the final route...",
      "Preparing your route..."
    ],
    trip: [
      "Preparing your trip analysis...",
      "Analysing Day 1 conditions...",
      "Checking Day 2 conditions...",
      "Checking Day 3 conditions...",
      "Evaluating fishing potential...",
      "Comparing daily risk...",
      "Calculating the overall trip recommendation...",
      "Preparing the safest plan..."
    ],
    general: [
      "Fetching the latest conditions...",
      "Making sure you get the best answer..."
    ]
  };

  const steps = messages[type] || messages.general;
  
  useEffect(() => {
    // Determine interval time to evenly distribute messages over the duration.
    // Subtract a tiny bit so we hit the last message before the duration ends.
    const intervalTime = (duration - 500) / steps.length;
    
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [duration, steps.length]);

  return (
    <div className="w-full max-w-3xl mx-auto flex justify-start animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white border border-slate-200 py-3 px-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-ocean-600 animate-spin" />
        <span className="text-sm text-slate-700 font-medium animate-in fade-in zoom-in-95 duration-300" key={step}>{steps[step]}</span>
      </div>
    </div>
  );
}
