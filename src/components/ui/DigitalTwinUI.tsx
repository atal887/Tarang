import { useState, useEffect } from 'react';
import { useTwinStore } from '../../store/scenarioStore';
import { evaluateFishermanContext } from '../../services/decisionEngine';
import { RotateCcw, Play } from 'lucide-react';
import type { EnvironmentalConditions } from '../../data/environmentResolver';

export function DigitalTwinUI() {
  const { twinState, setTwinState } = useTwinStore();
  const [localMods, setLocalMods] = useState<Partial<EnvironmentalConditions>>({});

  // When baseline changes, reset local mods
  useEffect(() => {
    setLocalMods(twinState.modified || {});
  }, [twinState.modified]);

  const handleSimulate = () => {
    if (!twinState.context) return;
    
    // Merge local mods into modified state
    setTwinState({ modified: localMods as EnvironmentalConditions, isSimulating: true });
    
    // Evaluate with simulated environment
    const decision = evaluateFishermanContext(
      twinState.context.locationId, 
      twinState.context.dateTime, 
      twinState.context.boatType, 
      "", 
      localMods
    );
    
    setTwinState({ predictions: decision, isSimulating: false });
  };

  const handleReset = () => {
    setLocalMods({});
    setTwinState({ modified: null });
    
    if (twinState.context) {
      const decision = evaluateFishermanContext(
        twinState.context.locationId, 
        twinState.context.dateTime, 
        twinState.context.boatType, 
        ""
      );
      setTwinState({ predictions: decision });
    }
  };

  const renderSlider = (label: string, field: keyof EnvironmentalConditions, min: number, max: number, step: number) => {
    const val = localMods[field] ?? twinState.baseline?.[field] ?? 0;
    return (
      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-xs text-slate-700 font-bold">
          <span>{label}</span>
          <span className="text-ocean-600">{Number(val).toFixed(1)}</span>
        </div>
        <input 
          type="range" 
          min={min} max={max} step={step} 
          value={Number(val)}
          onChange={(e) => setLocalMods(prev => ({ ...prev, [field]: parseFloat(e.target.value) }))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean-600 hover:accent-ocean-500 transition-all active:scale-[1.02]"
        />
      </div>
    );
  };

  if (!twinState.active) return null;
  if (!twinState.baseline) return (
    <div className="p-4 m-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-sm text-slate-600 text-center">
      Please ask a question about a location first to establish a baseline for the Digital Twin.
    </div>
  );

  return (
    <div className="m-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
      {/* Controls */}
      <div className="p-4 bg-slate-50 border-r border-slate-200 w-full md:w-64 shrink-0">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Scenario Controls</h4>
        {renderSlider('Wave Height (m)', 'significantWaveHeightM', 0, 5, 0.1)}
        {renderSlider('Wind Speed (km/h)', 'windSpeedKmph', 0, 80, 1)}
        {renderSlider('SST (°C)', 'seaSurfaceTemperatureC', 20, 35, 0.1)}
        {renderSlider('Current (m/s)', 'surfaceCurrentSpeedMs', 0, 2, 0.05)}
        {renderSlider('Chlorophyll (mg/m³)', 'chlorophyllMgM3', 0, 5, 0.1)}
        
        <div className="flex gap-2 mt-6">
          <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-1 py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-all active:scale-95">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button onClick={handleSimulate} className="flex-1 flex items-center justify-center gap-1 py-2 bg-ocean-600 text-white rounded text-xs font-bold hover:bg-ocean-700 shadow-sm transition-all active:scale-95 hover:shadow-md">
            <Play className="w-3 h-3" /> Simulate
          </button>
        </div>
      </div>
      
      {/* Dashboard */}
      <div className="p-4 flex-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Simulation Dashboard</h4>
        {twinState.predictions ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Simulated conditions for {twinState.context?.locationName}</span>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                twinState.predictions.riskBand === 'SAFE' ? 'bg-emerald-100 text-emerald-700' :
                twinState.predictions.riskBand === 'CAUTION' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>{twinState.predictions.riskBand}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-3 border border-slate-200 rounded-lg">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Fishing Suitability</div>
                 <div className="text-2xl font-black text-ocean-600">
                   {twinState.predictions.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore ?? 'N/A'}<span className="text-sm text-slate-400">/100</span>
                 </div>
               </div>
               <div className="p-3 border border-slate-200 rounded-lg">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Target Species</div>
                 <div className="text-sm font-medium text-slate-700">Pelagic (Tuna, Mackerel)</div>
               </div>
            </div>
            
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
              {twinState.predictions.reasons.map((r, i) => <div key={i}>{r}</div>)}
            </div>
            
            {/* Map Placeholder */}
            <div className="h-32 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden relative">
              <div className={`absolute inset-0 opacity-20 ${
                twinState.predictions.riskBand === 'SAFE' ? 'bg-emerald-500' :
                twinState.predictions.riskBand === 'CAUTION' ? 'bg-amber-500' :
                'bg-rose-500'
              }`}></div>
              <span className="text-xs font-bold text-slate-500 relative z-10">Dynamic Safety Map Area</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Run a simulation to see predictions.
          </div>
        )}
      </div>
    </div>
  );
}
