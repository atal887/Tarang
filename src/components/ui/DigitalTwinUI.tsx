import { useState, useEffect } from 'react';
import { useTwinStore } from '../../store/scenarioStore';
import { evaluateFishermanContext } from '../../services/decisionEngine';
import { resolveFishermanContext } from '../../services/contextResolver';
import { RotateCcw, Play, Map as MapIcon, Target } from 'lucide-react';
import type { EnvironmentalConditions } from '../../data/environmentResolver';
import { DIGITAL_TWIN_LOCATIONS } from '../../data/digitalTwinLocations';
import { MapComponent } from '../map/MapComponent';
import { getLocationCoordinates } from '../../services/contextResolver';

export function DigitalTwinUI() {
  const { twinState, setTwinState } = useTwinStore();
  
  // Local state for dropdowns
  const [selectedState, setSelectedState] = useState<string>("Kerala");
  const [selectedPort, setSelectedPort] = useState<string>("Kochi");
  const [localMods, setLocalMods] = useState<Partial<EnvironmentalConditions>>({});

  // Establish a new baseline when port changes
  useEffect(() => {
    if (!selectedPort) return;
    
    // Resolve location string to context
    const ctx = resolveFishermanContext({
      query: selectedPort,
      defaultLocationName: selectedPort,
      defaultBoatType: twinState.context?.boatType || 'motorized'
    });
    
    // Evaluate baseline decision
    const baselineDecision = evaluateFishermanContext(
      ctx.locationId,
      ctx.dateTime,
      ctx.boatType,
      selectedPort
    );

    // Update global store
    setTwinState({
      active: true,
      baseline: baselineDecision.marineRecommendations?.[0]?.productivityProfile as any || null,
      modified: null,
      context: ctx,
      predictions: baselineDecision,
      baselineDecision: baselineDecision,
      isSimulating: false
    });
    
    setLocalMods({});
  }, [selectedPort]);

  // When global modified state changes (e.g., reset), sync to local UI sliders
  useEffect(() => {
    setLocalMods(twinState.modified || {});
  }, [twinState.modified]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    // Auto-select first valid port
    const validPorts = DIGITAL_TWIN_LOCATIONS[newState] || [];
    if (validPorts.length > 0) {
      setSelectedPort(validPorts[0]);
    } else {
      setSelectedPort(""); // No ports available
    }
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPort(e.target.value);
  };

  const handleSimulate = () => {
    if (!twinState.context) return;
    
    // Evaluate with simulated environment
    const scenarioDecision = evaluateFishermanContext(
      twinState.context.locationId, 
      twinState.context.dateTime, 
      twinState.context.boatType, 
      selectedPort, 
      localMods
    );
    
    setTwinState({ 
      modified: localMods as EnvironmentalConditions,
      predictions: scenarioDecision, 
      isSimulating: false 
    });
  };

  const handleReset = () => {
    setLocalMods({});
    setTwinState({ 
      modified: null,
      predictions: twinState.baselineDecision 
    });
  };

  const renderSlider = (label: string, field: keyof EnvironmentalConditions, min: number, max: number, step: number) => {
    const val = localMods[field] ?? twinState.baseline?.[field] ?? 0;
    return (
      <div className="space-y-1 mb-3" key={field}>
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

  const validPorts = DIGITAL_TWIN_LOCATIONS[selectedState] || [];
  const hasPorts = validPorts.length > 0;

  return (
    <div className="m-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
      
      {/* Controls & Scenarios */}
      <div className="p-4 bg-slate-50 border-r border-slate-200 w-full md:w-72 shrink-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Location Settings</h4>
        
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Location / State</label>
            <select 
              value={selectedState} 
              onChange={handleStateChange}
              className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-white"
            >
              {Object.keys(DIGITAL_TWIN_LOCATIONS).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Port</label>
            {hasPorts ? (
              <select 
                value={selectedPort} 
                onChange={handlePortChange}
                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-white"
              >
                {validPorts.map(port => (
                  <option key={port} value={port}>{port}</option>
                ))}
              </select>
            ) : (
              <div className="p-2 text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                No port is currently available for this location.
              </div>
            )}
          </div>
        </div>

        {hasPorts && twinState.baseline && (
          <>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pt-4 border-t border-slate-200">Environment Simulator</h4>
            {renderSlider('Wave Height (m)', 'significantWaveHeightM', 0, 5, 0.1)}
            {renderSlider('Wind Speed (km/h)', 'windSpeedKmph', 0, 80, 1)}
            {renderSlider('SST (°C)', 'seaSurfaceTemperatureC', 20, 35, 0.1)}
            {renderSlider('Current (m/s)', 'surfaceCurrentSpeedMs', 0, 2, 0.05)}
            {renderSlider('Chlorophyll (mg/m³)', 'chlorophyllMgM3', 0, 5, 0.1)}
            
            <div className="flex gap-2 mt-6">
              <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all active:scale-95">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button onClick={handleSimulate} className="flex-1 flex items-center justify-center gap-1 py-2 bg-ocean-600 text-white rounded-lg text-xs font-bold hover:bg-ocean-700 shadow-sm transition-all active:scale-95 hover:shadow-md">
                <Play className="w-3 h-3" /> Simulate
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Dashboard */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Scenario Results</h4>
        
        {!hasPorts ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            Select a valid port to view the baseline and simulate scenarios.
          </div>
        ) : !twinState.predictions ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
            Loading baseline...
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Comparison Header */}
            {twinState.modified && twinState.baselineDecision && twinState.predictions.riskBand !== twinState.baselineDecision.riskBand && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <span className="font-bold">Scenario Update:</span> Safety changed from <span className="font-bold">{twinState.baselineDecision.riskBand}</span> to <span className="font-bold">{twinState.predictions.riskBand}</span> due to the simulated environmental conditions.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               {/* Safety Metrics */}
               <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-3">
                   <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                     <Target className="w-3 h-3" /> Safety Prediction
                   </div>
                 </div>
                 
                 <div className="flex items-end gap-3 mb-2">
                    <span className={`px-3 py-1 text-sm font-bold rounded-lg uppercase tracking-wide ${
                      twinState.predictions.riskBand === 'SAFE' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      twinState.predictions.riskBand === 'CAUTION' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {twinState.predictions.riskBand}
                    </span>
                    {twinState.modified && twinState.baselineDecision && (
                      <div className="text-xs text-slate-400 line-through">
                        was {twinState.baselineDecision.riskBand}
                      </div>
                    )}
                 </div>
                 
                 <div className="text-xs text-slate-600 mt-auto">
                    {twinState.predictions.reasons[0] || "Operational conditions are stable."}
                 </div>
               </div>

               {/* Productivity Metrics */}
               <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm flex flex-col">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-3 flex items-center gap-1">
                   <MapIcon className="w-3 h-3" /> Fishing Productivity
                 </div>
                 
                 <div className="flex items-end gap-2 mb-2">
                   <div className="text-3xl font-black text-ocean-600 leading-none">
                     {twinState.predictions.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore ?? 'N/A'}
                     <span className="text-sm font-bold text-slate-400">/100</span>
                   </div>
                   {twinState.modified && twinState.baselineDecision && (
                      <div className="text-xs text-slate-400 line-through mb-1">
                        was {twinState.baselineDecision.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore ?? 'N/A'}
                      </div>
                    )}
                 </div>
                 
                 <div className="text-xs text-slate-600 mt-auto">
                   Simulated environmental metrics update productivity score for Pelagic species.
                 </div>
               </div>
            </div>
            
            {/* Context Reasons Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 shadow-inner">
               <h5 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Detailed Analysis</h5>
               <ul className="space-y-2">
                 {twinState.predictions.reasons.map((r, i) => (
                   <li key={i} className="flex gap-2 items-start">
                     <span className="text-ocean-500 mt-1">•</span>
                     <span>{r}</span>
                   </li>
                 ))}
               </ul>
            </div>
            
            {/* Map Integration */}
            <div className="h-48 rounded-lg overflow-hidden border border-slate-200 relative shadow-sm">
               {twinState.context && twinState.context.locationId && getLocationCoordinates(twinState.context.locationId) ? (
                  <MapComponent 
                    center={getLocationCoordinates(twinState.context.locationId)!}
                    zoom={10}
                  />
               ) : (
                 <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">Map unavailable</span>
                 </div>
               )}
               {/* Overlay color tint based on safety */}
               <div className={`absolute inset-0 opacity-10 pointer-events-none ${
                  twinState.predictions.riskBand === 'SAFE' ? 'bg-emerald-500' :
                  twinState.predictions.riskBand === 'CAUTION' ? 'bg-amber-500' :
                  'bg-rose-500'
                }`}></div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
