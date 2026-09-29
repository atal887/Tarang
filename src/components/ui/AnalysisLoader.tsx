import { useState, useEffect } from "react";
import { Sparkles, Compass, ShieldAlert, Cpu, BarChart3 } from "lucide-react";

export type AnalysisType = "route" | "safety" | "pfz" | "weather" | "trip" | "research" | "digital_twin" | "alert" | "general";

interface AnalysisLoaderProps {
  type: AnalysisType;
  duration?: number;
}

export function AnalysisLoader({ type, duration = 2400 }: AnalysisLoaderProps) {
  const [step, setStep] = useState(0);

  const messages: Record<AnalysisType, string[]> = {
    safety: [
      "Checking weather and wave conditions…",
      "Calculating risk score…",
      "Preparing safety assessment…"
    ],
    pfz: [
      "Analyzing marine indicators…",
      "Checking fishing potential…",
      "Finding suitable zones…"
    ],
    route: [
      "Analyzing route conditions…",
      "Calculating risk along the route…",
      "Preparing safest route…"
    ],
    research: [
      "Comparing marine conditions…",
      "Analyzing the differences…",
      "Preparing visualization…"
    ],
    digital_twin: [
      "Applying simulated changes…",
      "Recalculating impacts…",
      "Preparing scenario result…"
    ],
    alert: [
      "Scanning for hazards…",
      "Checking safety thresholds…",
      "Preparing warning…"
    ],
    weather: [
      "Checking weather and wave conditions…",
      "Calculating risk score…",
      "Preparing safety assessment…"
    ],
    trip: [
      "Analyzing route conditions…",
      "Calculating risk along the route…",
      "Preparing safest route…"
    ],
    general: [
      "Analyzing marine conditions…",
      "Finding the most suitable option…",
      "Preparing the best answer…"
    ]
  };

  const steps = messages[type] || messages.general;

  useEffect(() => {
    setStep(0);
    const stepDuration = Math.max(600, Math.floor(duration / steps.length));
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, stepDuration);

    return () => clearInterval(interval);
  }, [duration, steps.length, type]);

  const progressPercent = Math.min(100, Math.round(((step + 1) / steps.length) * 100));

  const getIcon = () => {
    switch (type) {
      case "research":
        return <BarChart3 className="w-4 h-4 text-ocean-600 animate-pulse" />;
      case "digital_twin":
        return <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" />;
      case "alert":
        return <ShieldAlert className="w-4 h-4 text-amber-600 animate-pulse" />;
      case "route":
      case "trip":
        return <Compass className="w-4 h-4 text-ocean-600 animate-spin" style={{ animationDuration: '4s' }} />;
      default:
        return <Sparkles className="w-4 h-4 text-ocean-600 animate-pulse" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex justify-start animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm min-w-[280px] max-w-md relative overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Subtle animated ocean pulse dot */}
          <div className="relative flex items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-ocean-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ocean-600"></span>
          </div>

          <div className="flex-1 min-w-0">
            <span
              key={step}
              className="text-xs font-semibold text-slate-700 block truncate animate-in fade-in slide-in-from-bottom-1 duration-200"
            >
              {steps[step]}
            </span>
          </div>

          <div className="shrink-0 text-slate-400">
            {getIcon()}
          </div>
        </div>

        {/* Subtle bottom progress bar line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-100">
          <div
            className="h-full bg-ocean-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
