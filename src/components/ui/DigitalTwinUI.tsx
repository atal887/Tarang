import React, { useState, useEffect } from 'react';
import { useTwinStore } from '../../store/scenarioStore';
import { evaluateFishermanContext } from '../../services/decisionEngine';
import { resolveFishermanContext, getLocationCoordinates } from '../../services/contextResolver';
import { RotateCcw, Play, MapPin, Sliders, Cpu, ShieldAlert, Target, Waves, Wind, Thermometer, Activity, CheckCircle2, Zap, Navigation } from 'lucide-react';
import type { EnvironmentalConditions } from '../../data/environmentResolver';
import { DIGITAL_TWIN_LOCATIONS } from '../../data/digitalTwinLocations';
import { MapComponent } from '../map/MapComponent';

export function DigitalTwinUI() {
  const { twinState, setTwinState } = useTwinStore();
  
  // Local state for dropdowns & sliders
  const [selectedState, setSelectedState] = useState<string>("Kerala");
  const [selectedPort, setSelectedPort] = useState<string>("Kochi");
  const [localMods, setLocalMods] = useState<Partial<EnvironmentalConditions>>({});

  // Helper to remove markdown symbols
  const formatCleanText = (str: string) => (str || '').replace(/\*\*/g, '').replace(/###/g, '').replace(/---/g, '').trim();

  // Establish baseline when selectedPort changes
  useEffect(() => {
    if (!selectedPort) return;
    
    const ctx = resolveFishermanContext({
      query: selectedPort,
      defaultLocationName: selectedPort,
      defaultBoatType: twinState.context?.boatType || 'motorized'
    });
    
    const baselineDecision = evaluateFishermanContext(
      ctx.locationId,
      ctx.dateTime,
      ctx.boatType,
      selectedPort
    );

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

  useEffect(() => {
    setLocalMods(twinState.modified || {});
  }, [twinState.modified]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const validPorts = DIGITAL_TWIN_LOCATIONS[newState] || [];
    if (validPorts.length > 0) {
      setSelectedPort(validPorts[0]);
    } else {
      setSelectedPort("");
    }
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPort(e.target.value);
  };

  const handleSimulate = () => {
    if (!twinState.context) return;
    
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

  if (!twinState.active) return null;

  const validPorts = DIGITAL_TWIN_LOCATIONS[selectedState] || [];
  const hasPorts = validPorts.length > 0;
  const coords = twinState.context ? getLocationCoordinates(selectedPort || twinState.context.locationId) : null;

  // Render individual slider with baseline vs current modified value
  const renderSlider = (
    label: string, 
    field: keyof EnvironmentalConditions, 
    min: number, 
    max: number, 
    step: number, 
    unit: string,
    IconComponent: any
  ) => {
    const baselineVal = twinState.baseline?.[field] ?? 0;
    const currentVal = localMods[field] ?? baselineVal;
    const isModified = localMods[field] !== undefined && localMods[field] !== baselineVal;

    return (
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2 text-left" key={field}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5 text-slate-700">
            <IconComponent className="w-3.5 h-3.5 text-ocean-600 shrink-0" />
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            {isModified && (
              <span className="text-[9px] font-bold text-slate-400 line-through">
                {Number(baselineVal).toFixed(1)}{unit}
              </span>
            )}
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${isModified ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-800'}`}>
              {Number(currentVal).toFixed(1)} {unit}
            </span>
          </div>
        </div>

        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={Number(currentVal)}
          onChange={(e) => setLocalMods(prev => ({ ...prev, [field]: parseFloat(e.target.value) }))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean-600 hover:accent-ocean-500 transition-all"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>{min}{unit}</span>
          <span>Baseline: {Number(baselineVal).toFixed(1)}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

  const isRiskSafe = twinState.predictions?.riskBand === 'SAFE';
  const isRiskCaution = twinState.predictions?.riskBand === 'CAUTION';
  const riskBand = twinState.predictions?.riskBand || 'SAFE';
  const riskScore = twinState.predictions?.marineRecommendations?.[0]?.riskScore ?? (isRiskSafe ? 28 : isRiskCaution ? 48 : 68);

  const baselineRiskBand = twinState.baselineDecision?.riskBand || 'SAFE';
  const baselineRiskScore = twinState.baselineDecision?.marineRecommendations?.[0]?.riskScore ?? (baselineRiskBand === 'SAFE' ? 28 : baselineRiskBand === 'CAUTION' ? 48 : 68);

  const productivityScore = twinState.predictions?.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore ?? 78;
  const baselineProdScore = twinState.baselineDecision?.marineRecommendations?.[0]?.productivityEvaluation?.productivityScore ?? 78;

  return (
    <div className="m-3 md:m-5 bg-slate-50/50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-md text-left space-y-6">
      
      {/* Top Banner & Mode Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Digital Twin Mode
            </span>
            <span className="text-xs text-slate-500 font-semibold">Interactive Marine Simulator</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 leading-snug mt-1">
            Simulate & Predict Marine Conditions
          </h2>
        </div>

        {/* Location Dropdown Quick Selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <MapPin className="w-4 h-4 text-ocean-600 shrink-0" />
          <div className="flex gap-2 text-xs">
            <select 
              value={selectedState} 
              onChange={handleStateChange}
              className="p-1.5 font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {Object.keys(DIGITAL_TWIN_LOCATIONS).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select 
              value={selectedPort} 
              onChange={handlePortChange}
              className="p-1.5 font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {validPorts.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Two Column Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: ENVIRONMENT SIMULATOR CONTROLS (col-span-5) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-ocean-600" /> Environment Simulator
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Adjust sliders to simulate custom environmental scenarios</p>
            </div>
            {twinState.modified && (
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                Modified
              </span>
            )}
          </div>

          {hasPorts && twinState.baseline ? (
            <div className="space-y-3">
              {renderSlider('Wave Height', 'significantWaveHeightM', 0, 5, 0.1, 'm', Waves)}
              {renderSlider('Wind Speed', 'windSpeedKmph', 0, 80, 1, 'km/h', Wind)}
              {renderSlider('Sea Surface Temp', 'seaSurfaceTemperatureC', 20, 35, 0.1, '°C', Thermometer)}
              {renderSlider('Surface Current', 'surfaceCurrentSpeedMs', 0, 2, 0.05, 'm/s', Activity)}
              {renderSlider('Chlorophyll Conc.', 'chlorophyllMgM3', 0, 5, 0.1, 'mg/m³', Zap)}
              
              {/* Primary & Secondary Action CTAs */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={handleReset} 
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button 
                  onClick={handleSimulate} 
                  className="flex-1 py-3 px-4 bg-ocean-600 hover:bg-ocean-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" /> Simulate Scenario
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Please select a valid port from the top dropdown to activate the environment simulator.
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: SIMULATION RESULTS DASHBOARD (col-span-7) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-5 min-w-0">
          
          {/* SECTION 1: SCENARIO IMPACT (Param Diff Bar) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" /> Scenario Impact & Parameter Diffs
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedPort} Simulation</span>
            </div>

            {twinState.modified ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(localMods).map(([key, val]) => {
                  const baseVal = twinState.baseline?.[key as keyof EnvironmentalConditions] ?? 0;
                  const delta = Number(val) - Number(baseVal);
                  const paramLabels: Record<string, { label: string; unit: string }> = {
                    significantWaveHeightM: { label: 'Wave Height', unit: 'm' },
                    windSpeedKmph: { label: 'Wind Speed', unit: 'km/h' },
                    seaSurfaceTemperatureC: { label: 'SST', unit: '°C' },
                    surfaceCurrentSpeedMs: { label: 'Current Speed', unit: 'm/s' },
                    chlorophyllMgM3: { label: 'Chlorophyll', unit: 'mg/m³' }
                  };
                  const meta = paramLabels[key] || { label: key, unit: '' };

                  return (
                    <div key={key} className="bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="font-bold text-slate-700">{meta.label}:</span>
                      <div className="flex items-center gap-1.5 font-extrabold">
                        <span className="text-slate-400 line-through text-[11px]">{Number(baseVal).toFixed(1)}{meta.unit}</span>
                        <span className="text-indigo-900">&rarr; {Number(val).toFixed(1)}{meta.unit}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${delta >= 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}{meta.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 text-center font-medium">
                Baseline state active. Adjust sliders on the left and click <strong>Simulate Scenario</strong> to compare environmental parameters.
              </div>
            )}
          </div>

          {/* SECTION 2: RISK ASSESSMENT & FISHING PRODUCTIVITY PROMINENT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CARD 1: RISK ASSESSMENT */}
            <div className={`p-4 rounded-2xl border shadow-sm space-y-3 flex flex-col justify-between ${
              isRiskSafe ? 'bg-emerald-50/60 border-emerald-200' : isRiskCaution ? 'bg-amber-50/60 border-amber-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-700" /> Risk Assessment
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    isRiskSafe ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isRiskCaution ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {riskBand}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <div className="text-3xl font-black text-slate-900 leading-none">
                    {riskScore}<span className="text-xs font-bold text-slate-500">/100</span>
                  </div>
                  {twinState.modified && (
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span className="line-through">{baselineRiskScore}/100</span>
                      <span className={riskScore > baselineRiskScore ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                        ({riskScore > baselineRiskScore ? `+${riskScore - baselineRiskScore}` : riskScore - baselineRiskScore} pts)
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
                  {twinState.predictions?.reasons?.[0] ? formatCleanText(twinState.predictions.reasons[0]) : "Marine operational conditions are safe for baseline activities."}
                </p>
              </div>
            </div>

            {/* CARD 2: FISHING PRODUCTIVITY */}
            <div className="p-4 rounded-2xl border border-ocean-200 bg-ocean-50/60 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-wider text-ocean-900 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-ocean-600" /> Fishing Productivity
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-ocean-100 text-ocean-800 border border-ocean-300">
                    {productivityScore > 70 ? 'High' : productivityScore > 40 ? 'Moderate' : 'Low'} Yield
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <div className="text-3xl font-black text-ocean-700 leading-none">
                    {productivityScore}<span className="text-xs font-bold text-slate-500">/100</span>
                  </div>
                  {twinState.modified && (
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span className="line-through">{baselineProdScore}/100</span>
                      <span className={productivityScore < baselineProdScore ? 'text-amber-700 font-extrabold' : 'text-emerald-700 font-extrabold'}>
                        ({productivityScore < baselineProdScore ? `${productivityScore - baselineProdScore}` : `+${productivityScore - baselineProdScore}`} pts)
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
                  Simulated SST and Chlorophyll levels support pelagic species concentration near coastal boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: RECOMMENDED AREAS & ADVISORIES (Clean Cards) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recommended Areas & Port Advisories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {twinState.predictions?.reasons && twinState.predictions.reasons.length > 0 ? (
                twinState.predictions.reasons.map((r, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700 leading-relaxed font-medium flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-ocean-600 shrink-0 mt-1.5"></span>
                    <span>{formatCleanText(r)}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 text-center">
                  All marine parameters remain within safe operational thresholds for {selectedPort}.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: INTERACTIVE MAP / VISUAL PLACEHOLDER */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-ocean-600" /> Simulated Location Map & Safety Zone
              </h3>
              <span className="text-[10px] font-bold text-slate-500">{selectedPort}</span>
            </div>

            <div className="h-56 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner bg-slate-100">
              {coords ? (
                <MapComponent 
                  center={coords}
                  zoom={11}
                  zones={[{ id: "twin-map-loc", center: coords, radius: 3000, type: isRiskSafe ? "safe" : "danger", label: selectedPort }]}
                />
              ) : (
                /* Polished Visual Placeholder Card if coords missing */
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-ocean-950 text-white p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{selectedPort} Marine Radar</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-white/10 rounded-full border border-white/20 text-ocean-300">
                      Simulated Grid
                    </span>
                  </div>

                  <div className="space-y-1 my-auto">
                    <div className="text-lg font-black text-white">{selectedPort} Marine Sector</div>
                    <p className="text-xs text-slate-300">Active digital twin simulation grid monitoring wave, wind, and SST shifts.</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
                    <span>Status: <strong>{riskBand}</strong></span>
                    <span>Simulated Wave: <strong>{localMods.significantWaveHeightM ?? twinState.baseline?.significantWaveHeightM ?? 1.2}m</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
