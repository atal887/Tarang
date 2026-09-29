import React, { useState } from 'react';
import type { DemoAlertScenario } from '../../data/demoAlertDataset';
import { ShieldAlert, AlertTriangle, ShieldCheck, MapIcon, Wind, Waves, Sun, Info, Anchor } from 'lucide-react';
import { Button } from './Button';
import { MapComponent } from '../map/MapComponent';

interface Props {
  scenario: DemoAlertScenario;
}

export const AlertVisualizations: React.FC<Props> = ({ scenario }) => {
  const [showMap, setShowMap] = useState(false);

  const isSafe = scenario.alertLevel === 'SAFE';
  const isCaution = scenario.alertLevel === 'CAUTION';

  const bgColor = isSafe ? 'bg-emerald-50' : isCaution ? 'bg-amber-50' : 'bg-rose-50';
  const borderColor = isSafe ? 'border-emerald-200' : isCaution ? 'border-amber-200' : 'border-rose-200';
  const textColor = isSafe ? 'text-emerald-800' : isCaution ? 'text-amber-800' : 'text-rose-800';
  const Icon = isSafe ? ShieldCheck : isCaution ? AlertTriangle : ShieldAlert;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-4 text-left my-3 w-full">
      {/* 1. WARNINGS / PRECAUTIONS FIRST */}
      <div className={`p-4 rounded-xl border ${bgColor} ${borderColor} flex items-start gap-3 shadow-sm`}>
        <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${textColor}`} />
        <div className="space-y-1">
          <div className={`text-xs font-black uppercase tracking-wider ${textColor}`}>
            {scenario.warningHeader}
          </div>
          <div className="text-sm font-bold text-slate-900">
            {scenario.locationName} &bull; <span className="text-xs font-normal text-slate-500">{scenario.district}, {scenario.state}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN RISK HIGHLIGHTED */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 space-y-1 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" /> Primary Marine Hazard
        </div>
        <div className="text-xs font-bold text-slate-100 leading-snug">
          {scenario.primaryHazard}
        </div>
      </div>

      {/* 3. KEY CONDITIONS & RISK SCORE */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Marine Conditions</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
            <Waves className="w-4 h-4 text-ocean-600 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 uppercase font-bold">Wave Height</div>
            <div className="text-sm font-bold text-slate-900">{scenario.waveHeight}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
            <Wind className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 uppercase font-bold">Wind Speed</div>
            <div className="text-sm font-bold text-slate-900">{scenario.windSpeed}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
            <Sun className="w-4 h-4 text-sky-600 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 uppercase font-bold">Weather</div>
            <div className="text-xs font-bold text-slate-900">{scenario.weather}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
            <ShieldAlert className="w-4 h-4 text-rose-600 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 uppercase font-bold">Risk Score</div>
            <div className={`text-sm font-black ${isSafe ? 'text-emerald-600' : 'text-amber-600'}`}>{scenario.riskScore}/100 ({scenario.alertLevel})</div>
          </div>
        </div>
      </div>

      {/* 4. BRIEF REASON */}
      <div className="bg-slate-50 border-l-4 border-ocean-600 p-3 rounded-r-xl text-xs text-slate-700 space-y-1">
        <strong className="text-slate-900 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-ocean-600" /> Explanation & Advisory:
        </strong>
        <p className="leading-relaxed">{scenario.briefReason}</p>
      </div>

      {/* 5. BOAT-SPECIFIC PRECAUTIONS */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Anchor className="w-3.5 h-3.5 text-slate-600" /> Vessel-Specific Precautions
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Non-Motorized Canoes / Crafts:</div>
            <div className="text-slate-700 font-medium">{scenario.vesselPrecautions.nonMotorized}</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Small Motorized Vessels (&lt;12m):</div>
            <div className="text-slate-700 font-medium">{scenario.vesselPrecautions.motorized}</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Mechanized Trawlers (&gt;12m):</div>
            <div className="text-slate-700 font-medium">{scenario.vesselPrecautions.mechanized}</div>
          </div>
        </div>
      </div>

      {/* 6. VIEW ON MAP BUTTON */}
      <div>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs bg-slate-50 hover:bg-slate-100 transition-colors py-2 h-10 font-semibold"
          onClick={() => setShowMap(!showMap)}
        >
          <MapIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          {showMap ? "Hide Map" : `View ${scenario.locationName} on Map`}
        </Button>

        {showMap && (
          <div className="h-52 border border-slate-200 rounded-xl overflow-hidden relative mt-3 shadow-sm">
            <MapComponent
              center={scenario.coords}
              zoom={12}
              zones={[{ id: "alert-map-loc", center: scenario.coords, radius: 3000, type: isSafe ? "safe" : "danger", label: scenario.locationName }]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
