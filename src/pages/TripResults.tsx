import { useState } from "react";
import { ShieldAlert, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useNavigate } from "react-router-dom";
import { demoData } from "../data/demoData";

export function TripResults() {
  const navigate = useNavigate();
  const [showMapConfirm, setShowMapConfirm] = useState(false);
  const days = [demoData.tripAnalysis.day1, demoData.tripAnalysis.day2, demoData.tripAnalysis.day3];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      
      <header className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trip Analysis</h1>
           <p className="text-sm font-medium text-slate-500 mt-1">
             {demoData.user.location} &bull; {demoData.user.vesselType} &bull; 3 Days
           </p>
        </div>
      </header>

      {/* Visually Dominant Overall Recommendation */}
      <section>
        <div className="rounded-2xl bg-status-cautionBg border border-status-caution/30 p-6 md:p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
               <ShieldAlert className="w-5 h-5 text-status-caution" />
             </div>
             <h2 className="text-lg font-bold text-status-cautionText uppercase tracking-wider">Overall Recommendation</h2>
           </div>
           
           <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">{demoData.tripAnalysis.overall.recommendation}</h3>
           <p className="text-base text-slate-700 leading-relaxed mb-6 max-w-xl">
             {demoData.tripAnalysis.overall.explanation}
           </p>
           
           <div className="inline-flex items-center px-4 py-2.5 bg-white rounded-xl border border-status-caution/20 text-sm font-bold text-status-cautionText shadow-sm">
             Best plan: {demoData.tripAnalysis.overall.bestPlan}
           </div>
        </div>
      </section>

      {/* Compact 3-Day Breakdown */}
      <section className="bg-white rounded-2xl border border-slate-200 p-1 shadow-sm overflow-hidden">
         <div className="grid grid-cols-3 divide-x divide-slate-100">
            {days.map((day, idx) => (
              <div key={idx} className={`p-4 md:p-6 flex flex-col items-center text-center ${day.status === "CAUTION" ? "bg-status-cautionBg/50" : ""}`}>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Day {idx + 1}</span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${day.status === "SAFE" ? "bg-status-safeBg text-status-safe" : "bg-status-cautionBg text-status-caution"}`}>
                  {day.status === "SAFE" ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <span className={`text-sm font-bold ${day.status === "SAFE" ? "text-status-safeText" : "text-status-cautionText"}`}>{day.status}</span>
                <span className="text-xs text-slate-400 font-medium mt-1">Score: {day.score}</span>
              </div>
            ))}
         </div>
      </section>

      {/* Recommended Zone */}
      <section className="pt-2">
        <SectionHeader title="Recommended Fishing Zone" />
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-ocean-600" /> {demoData.recommendedZone.name}</h3>
                  <Badge variant="safe" className="px-2 py-0.5 text-[10px] uppercase"><ShieldCheck className="w-3 h-3 mr-1 inline" /> {demoData.recommendedZone.status}</Badge>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-4">{demoData.recommendedZone.distance} from {demoData.user.location} Harbour</p>
                <div className="space-y-2 mb-6 md:mb-0">
                  {demoData.recommendedZone.details.map((text, idx) => (
                    <p key={idx} className="text-sm text-slate-600 leading-relaxed">{text}</p>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                {!showMapConfirm ? (
                  <Button size="lg" className="w-full shadow-md shadow-ocean-600/10" onClick={() => setShowMapConfirm(true)}>
                    View Safe Route <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    <p className="text-xs font-semibold text-slate-700 mb-3 text-center leading-tight">
                      Show safest route from {demoData.user.location} to {demoData.recommendedZone.name}?
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => navigate("/map")} className="w-full h-10 text-sm">
                        Yes, Show Route
                      </Button>
                      <Button variant="ghost" onClick={() => setShowMapConfirm(false)} className="w-full h-10 text-sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
