import React, { useState, useEffect } from 'react';
import { useTwinStore } from '../../store/scenarioStore';
import { evaluateFishermanContext } from '../../services/decisionEngine';
import { resolveFishermanContext, getLocationCoordinates } from '../../services/contextResolver';
import { RotateCcw, Play, MapPin, Sliders, Cpu, ShieldAlert, Target, Waves, Wind, Thermometer, Activity, BarChart2, Zap, Navigation, ArrowRight, Anchor } from 'lucide-react';
import type { EnvironmentalConditions } from '../../data/environmentResolver';
import { DIGITAL_TWIN_LOCATIONS } from '../../data/digitalTwinLocations';
import { MapComponent } from '../map/MapComponent';
import {
  ResponsiveContainer,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export interface PortBaseline {
  significantWaveHeightM: number;
  windSpeedKmph: number;
  seaSurfaceTemperatureC: number;
  surfaceCurrentSpeedMs: number;
  chlorophyllMgM3: number;
}

// Return realistic non-zero baseline values for any selected port
export function getPortBaseline(portName: string): PortBaseline {
  const p = (portName || '').toLowerCase();
  if (p.includes('kochi') || p.includes('cochin')) {
    return { significantWaveHeightM: 1.2, windSpeedKmph: 14, seaSurfaceTemperatureC: 29.1, surfaceCurrentSpeedMs: 0.30, chlorophyllMgM3: 0.48 };
  }
  if (p.includes('mumbai') || p.includes('bhaucha') || p.includes('sassoon')) {
    return { significantWaveHeightM: 1.8, windSpeedKmph: 19, seaSurfaceTemperatureC: 28.4, surfaceCurrentSpeedMs: 0.45, chlorophyllMgM3: 0.72 };
  }
  if (p.includes('veraval')) {
    return { significantWaveHeightM: 1.7, windSpeedKmph: 18, seaSurfaceTemperatureC: 28.4, surfaceCurrentSpeedMs: 0.40, chlorophyllMgM3: 0.72 };
  }
  if (p.includes('porbandar')) {
    return { significantWaveHeightM: 1.6, windSpeedKmph: 16, seaSurfaceTemperatureC: 28.2, surfaceCurrentSpeedMs: 0.35, chlorophyllMgM3: 0.65 };
  }
  if (p.includes('mangrol')) {
    return { significantWaveHeightM: 1.4, windSpeedKmph: 15, seaSurfaceTemperatureC: 28.5, surfaceCurrentSpeedMs: 0.35, chlorophyllMgM3: 0.60 };
  }
  if (p.includes('mangalore') || p.includes('mangaluru')) {
    return { significantWaveHeightM: 1.3, windSpeedKmph: 15, seaSurfaceTemperatureC: 28.8, surfaceCurrentSpeedMs: 0.38, chlorophyllMgM3: 0.55 };
  }
  if (p.includes('chennai')) {
    return { significantWaveHeightM: 1.4, windSpeedKmph: 16, seaSurfaceTemperatureC: 29.0, surfaceCurrentSpeedMs: 0.40, chlorophyllMgM3: 0.52 };
  }
  if (p.includes('vizag') || p.includes('visakhapatnam')) {
    return { significantWaveHeightM: 1.5, windSpeedKmph: 17, seaSurfaceTemperatureC: 28.7, surfaceCurrentSpeedMs: 0.42, chlorophyllMgM3: 0.58 };
  }
  if (p.includes('kavaratti') || p.includes('lakshadweep')) {
    return { significantWaveHeightM: 1.3, windSpeedKmph: 13, seaSurfaceTemperatureC: 29.4, surfaceCurrentSpeedMs: 0.28, chlorophyllMgM3: 0.63 };
  }
  return { significantWaveHeightM: 1.2, windSpeedKmph: 14, seaSurfaceTemperatureC: 28.5, surfaceCurrentSpeedMs: 0.35, chlorophyllMgM3: 0.50 };
}

const CustomRechartsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700/60 text-xs backdrop-blur-md z-50">
        <div className="font-bold text-indigo-400 mb-1 border-b border-slate-700/60 pb-1">{label || payload[0].name}</div>
        <div className="space-y-1 mt-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-slate-200">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }}></span>
                {item.name}:
              </span>
              <span className="font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function DigitalTwinUI() {
  const { twinState, setTwinState } = useTwinStore();
  
  // Local state for dropdowns & sliders
  const [selectedState, setSelectedState] = useState<string>("Kerala");
  const [selectedPort, setSelectedPort] = useState<string>("Kochi");
  const [localMods, setLocalMods] = useState<Partial<EnvironmentalConditions>>({});

  // Resolve Baseline whenever selectedPort changes
  const activeBaseline = getPortBaseline(selectedPort);

  useEffect(() => {
    if (!selectedPort) return;
    
    const ctx = resolveFishermanContext({
      query: selectedPort,
      defaultLocationName: selectedPort,
      defaultBoatType: twinState.context?.boatType || 'motorized'
    });

    const baseline = getPortBaseline(selectedPort);
    
    const baselineDecision = evaluateFishermanContext(
      ctx.locationId,
      ctx.dateTime,
      ctx.boatType,
      selectedPort
    );

    setTwinState({
      active: true,
      baseline: baseline as any,
      modified: null,
      context: ctx,
      predictions: baselineDecision,
      baselineDecision: baselineDecision,
      isSimulating: false
    });
    
    setLocalMods(baseline);
  }, [selectedPort]);

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

  // Slider change handler
  const handleSliderChange = (field: keyof PortBaseline, val: number) => {
    setLocalMods(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Quick Preset Scenario Handlers
  const applyPresetScenario = (scenarioType: 'wave' | 'wind' | 'sst' | 'chlorophyll' | 'current' | 'compound') => {
    const base = activeBaseline;
    let newMods: Partial<EnvironmentalConditions> = { ...base };

    switch (scenarioType) {
      case 'wave':
        newMods.significantWaveHeightM = 2.0;
        break;
      case 'wind':
        newMods.windSpeedKmph = 28;
        break;
      case 'sst':
        newMods.seaSurfaceTemperatureC = 27.0;
        break;
      case 'chlorophyll':
        newMods.chlorophyllMgM3 = 0.90;
        break;
      case 'current':
        newMods.surfaceCurrentSpeedMs = 1.20;
        break;
      case 'compound':
        newMods.significantWaveHeightM = 2.2;
        newMods.windSpeedKmph = 32;
        newMods.seaSurfaceTemperatureC = 25.5;
        newMods.surfaceCurrentSpeedMs = 1.20;
        newMods.chlorophyllMgM3 = 0.90;
        break;
    }

    setLocalMods(newMods);
    setTwinState({
      modified: newMods as EnvironmentalConditions
    });
  };

  const handleSimulate = () => {
    if (!twinState.context) return;
    setTwinState({ 
      modified: localMods as EnvironmentalConditions,
      isSimulating: false 
    });
  };

  const handleReset = () => {
    const base = activeBaseline;
    setLocalMods(base);
    setTwinState({ 
      modified: null
    });
  };

  if (!twinState.active) return null;

  const validPorts = DIGITAL_TWIN_LOCATIONS[selectedState] || [];
  const hasPorts = validPorts.length > 0;
  const coords = twinState.context ? getLocationCoordinates(selectedPort || twinState.context.locationId) : null;

  // Dynamic Multi-Factor Simulation Calculation
  const currentWave = localMods.significantWaveHeightM ?? activeBaseline.significantWaveHeightM;
  const currentWind = localMods.windSpeedKmph ?? activeBaseline.windSpeedKmph;
  const currentSST = localMods.seaSurfaceTemperatureC ?? activeBaseline.seaSurfaceTemperatureC;
  const currentSpeed = localMods.surfaceCurrentSpeedMs ?? activeBaseline.surfaceCurrentSpeedMs;
  const currentChlorophyll = localMods.chlorophyllMgM3 ?? activeBaseline.chlorophyllMgM3;

  const waveDelta = currentWave - activeBaseline.significantWaveHeightM;
  const windDelta = currentWind - activeBaseline.windSpeedKmph;
  const sstDelta = currentSST - activeBaseline.seaSurfaceTemperatureC;
  const currentDelta = currentSpeed - activeBaseline.surfaceCurrentSpeedMs;
  const chlorophyllDelta = currentChlorophyll - activeBaseline.chlorophyllMgM3;

  const isModified = Math.abs(waveDelta) > 0.01 || Math.abs(windDelta) > 0.5 || Math.abs(sstDelta) > 0.1 || Math.abs(currentDelta) > 0.01 || Math.abs(chlorophyllDelta) > 0.01;

  // Calculate Base Risk (Kochi=28, Mumbai=38, Veraval=46)
  const baseRiskScore = selectedPort.toLowerCase().includes('mumbai') ? 38 : selectedPort.toLowerCase().includes('veraval') ? 46 : 28;
  const baseProdScore = selectedPort.toLowerCase().includes('mumbai') ? 78 : selectedPort.toLowerCase().includes('veraval') ? 79 : 74;

  // Delta Risk Points
  const waveRiskShift = waveDelta > 0 ? Math.round(waveDelta * 35) : Math.round(waveDelta * 15);
  const windRiskShift = windDelta > 0 ? Math.round(windDelta * 1.8) : Math.round(windDelta * 0.8);
  const currentRiskShift = currentDelta > 0 ? Math.round(currentDelta * 25) : 0;
  const sstRiskShift = sstDelta < 0 ? Math.round(Math.abs(sstDelta) * 4) : 0;
  const totalRiskShift = waveRiskShift + windRiskShift + currentRiskShift + sstRiskShift;

  const simulatedRiskScore = Math.min(100, Math.max(0, Math.round(baseRiskScore + totalRiskShift)));
  const simulatedRiskBand = simulatedRiskScore <= 35 ? 'SAFE' : simulatedRiskScore <= 65 ? 'CAUTION' : 'DANGER';

  // Delta Productivity Points
  const prodShift = Math.round(chlorophyllDelta * 35) - (waveDelta > 0 ? Math.round(waveDelta * 18) : 0) - (windDelta > 0 ? Math.round(windDelta * 1.2) : 0);
  const simulatedProdScore = Math.min(100, Math.max(0, Math.round(baseProdScore + prodShift)));

  // Recharts Chart Payloads
  const barChartPayload = [
    { metric: 'Wave (m)', Baseline: Number(activeBaseline.significantWaveHeightM).toFixed(1), Simulated: Number(currentWave).toFixed(1) },
    { metric: 'Wind (km/h)', Baseline: activeBaseline.windSpeedKmph, Simulated: currentWind },
    { metric: 'SST (°C)', Baseline: Number(activeBaseline.seaSurfaceTemperatureC).toFixed(1), Simulated: Number(currentSST).toFixed(1) },
    { metric: 'Current (m/s)', Baseline: Number(activeBaseline.surfaceCurrentSpeedMs).toFixed(2), Simulated: Number(currentSpeed).toFixed(2) },
    { metric: 'Chlorophyll', Baseline: Number(activeBaseline.chlorophyllMgM3).toFixed(2), Simulated: Number(currentChlorophyll).toFixed(2) }
  ];

  const vesselLimitPayload = [
    { vessel: 'Non-Motorized Canoe', WaveLimit: 0.5, CurrentWave: currentWave, WindLimit: 25, CurrentWind: currentWind },
    { vessel: 'Motorized Boat (<12m)', WaveLimit: 1.4, CurrentWave: currentWave, WindLimit: 40, CurrentWind: currentWind },
    { vessel: 'Mechanized Trawler (>12m)', WaveLimit: 2.4, CurrentWave: currentWave, WindLimit: 50, CurrentWind: currentWind }
  ];

  const radarPayload = [
    { subject: 'Wave Safety', Baseline: Math.max(10, 100 - activeBaseline.significantWaveHeightM * 25), Simulated: Math.max(10, 100 - currentWave * 25) },
    { subject: 'Wind Safety', Baseline: Math.max(10, 100 - activeBaseline.windSpeedKmph * 1.2), Simulated: Math.max(10, 100 - currentWind * 1.2) },
    { subject: 'Thermal Index', Baseline: 85, Simulated: Math.max(20, 85 - (29.1 - currentSST) * 15) },
    { subject: 'Current Risk', Baseline: Math.max(10, 100 - activeBaseline.surfaceCurrentSpeedMs * 50), Simulated: Math.max(10, 100 - currentSpeed * 50) },
    { subject: 'Productivity', Baseline: baseProdScore, Simulated: simulatedProdScore }
  ];

  // Slider Renderer helper
  const renderSlider = (
    label: string, 
    field: keyof PortBaseline, 
    min: number, 
    max: number, 
    step: number, 
    unit: string,
    IconComponent: any
  ) => {
    const baseVal = activeBaseline[field];
    const currentVal = localMods[field] ?? baseVal;
    const isFieldModified = Math.abs(currentVal - baseVal) > 0.001;
    const delta = currentVal - baseVal;

    return (
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2 text-left" key={field}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5 text-slate-700">
            <IconComponent className="w-3.5 h-3.5 text-ocean-600 shrink-0" />
            {label}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-extrabold">
            <span className="text-slate-500">{Number(baseVal).toFixed(step < 0.1 ? 2 : 1)}{unit}</span>
            <span>&rarr;</span>
            <span className={`px-2 py-0.5 rounded ${isFieldModified ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-800'}`}>
              {Number(currentVal).toFixed(step < 0.1 ? 2 : 1)}{unit}
            </span>
            {isFieldModified && (
              <span className={`text-[10px] px-1 py-0.5 rounded ${delta >= 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                ({delta >= 0 ? `+${delta.toFixed(step < 0.1 ? 2 : 1)}` : delta.toFixed(step < 0.1 ? 2 : 1)}{unit})
              </span>
            )}
          </div>
        </div>

        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={Number(currentVal)}
          onChange={(e) => handleSliderChange(field, parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean-600 hover:accent-ocean-500 transition-all"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>{min}{unit}</span>
          <span>Baseline: {Number(baseVal).toFixed(step < 0.1 ? 2 : 1)}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

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
            Simulate Marine Scenarios & Causal Impacts
          </h2>
        </div>

        {/* Location Dropdown Selector */}
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

      {/* QUICK PRESET DEMO SCENARIOS BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-sm space-y-2">
        <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-indigo-600" /> Quick Demo Scenarios (Select to Test):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => applyPresetScenario('wave')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-ocean-50 hover:border-ocean-300 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">🌊 Wave Spike</div>
            <div className="text-[10px] text-slate-500">1.2m &rarr; 2.0m</div>
          </button>

          <button
            onClick={() => applyPresetScenario('wind')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">💨 Wind Surge</div>
            <div className="text-[10px] text-slate-500">14 &rarr; 28 km/h</div>
          </button>

          <button
            onClick={() => applyPresetScenario('sst')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">🌡️ SST Drop</div>
            <div className="text-[10px] text-slate-500">29.1°C &rarr; 27°C</div>
          </button>

          <button
            onClick={() => applyPresetScenario('chlorophyll')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">🟢 Chlorophyll</div>
            <div className="text-[10px] text-slate-500">0.48 &rarr; 0.9 mg/m³</div>
          </button>

          <button
            onClick={() => applyPresetScenario('current')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">🌊 Current Surge</div>
            <div className="text-[10px] text-slate-500">0.3 &rarr; 1.2 m/s</div>
          </button>

          <button
            onClick={() => applyPresetScenario('compound')}
            className="p-2 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-left transition-all shadow-sm ring-1 ring-indigo-200 group"
          >
            <div className="text-[11px] font-extrabold text-indigo-900 flex items-center gap-1">⚡ Compound Demo</div>
            <div className="text-[10px] font-bold text-indigo-700">Multi-factor shock</div>
          </button>
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
              <p className="text-[11px] text-slate-500 mt-0.5">Move sliders to simulate custom environmental shifts</p>
            </div>
            {isModified && (
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                Modified
              </span>
            )}
          </div>

          {hasPorts ? (
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
          
          {/* SECTION 1: SCENARIO IMPACT (Baseline -> Simulated -> Change Diff Bar) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" /> Scenario Impact (Baseline &rarr; Simulated &rarr; Change)
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedPort}</span>
            </div>

            {isModified ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Wave Diff */}
                <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-slate-700">Wave Height:</span>
                  <span className="font-extrabold text-indigo-900">
                    {activeBaseline.significantWaveHeightM}m &rarr; {currentWave.toFixed(1)}m <span className="text-[10px] text-amber-700">({waveDelta >= 0 ? `+${waveDelta.toFixed(1)}` : waveDelta.toFixed(1)}m)</span>
                  </span>
                </div>

                {/* Wind Diff */}
                <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-slate-700">Wind Speed:</span>
                  <span className="font-extrabold text-indigo-900">
                    {activeBaseline.windSpeedKmph} &rarr; {currentWind} km/h <span className="text-[10px] text-amber-700">({windDelta >= 0 ? `+${windDelta}` : windDelta} km/h)</span>
                  </span>
                </div>

                {/* SST Diff */}
                <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-slate-700">SST Temp:</span>
                  <span className="font-extrabold text-indigo-900">
                    {activeBaseline.seaSurfaceTemperatureC}°C &rarr; {currentSST.toFixed(1)}°C <span className="text-[10px] text-rose-700">({sstDelta >= 0 ? `+${sstDelta.toFixed(1)}` : sstDelta.toFixed(1)}°C)</span>
                  </span>
                </div>

                {/* Current Diff */}
                <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-slate-700">Current Speed:</span>
                  <span className="font-extrabold text-indigo-900">
                    {activeBaseline.surfaceCurrentSpeedMs} &rarr; {currentSpeed.toFixed(2)} m/s <span className="text-[10px] text-sky-700">({currentDelta >= 0 ? `+${currentDelta.toFixed(2)}` : currentDelta.toFixed(2)} m/s)</span>
                  </span>
                </div>

                {/* Chlorophyll Diff */}
                <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between col-span-1 sm:col-span-2">
                  <span className="font-bold text-slate-700">Chlorophyll Conc.:</span>
                  <span className="font-extrabold text-indigo-900">
                    {activeBaseline.chlorophyllMgM3} &rarr; {currentChlorophyll.toFixed(2)} mg/m³ <span className="text-[10px] text-emerald-700">({chlorophyllDelta >= 0 ? `+${chlorophyllDelta.toFixed(2)}` : chlorophyllDelta.toFixed(2)} mg/m³)</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 text-center font-medium">
                Baseline parameters active. Move sliders on the left or select a <strong>Quick Demo Scenario</strong> above to simulate environmental shifts.
              </div>
            )}
          </div>

          {/* SECTION 2: COMPOUND EFFECT DEMO HIGHLIGHT CARD */}
          {isModified && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2 shadow-sm">
              <div className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" /> Multi-Factor Compound Impact Calculation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-2">
                <div className="bg-white p-2 rounded-xl border border-amber-200">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Wave Risk Shift</div>
                  <div className="text-xs font-extrabold text-ocean-700">+{waveRiskShift} Pts</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Wind Risk Shift</div>
                  <div className="text-xs font-extrabold text-amber-700">+{windRiskShift} Pts</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Current Risk Shift</div>
                  <div className="text-xs font-extrabold text-sky-700">+{currentRiskShift} Pts</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Total Shift</div>
                  <div className="text-xs font-extrabold text-rose-700">+{totalRiskShift} Pts</div>
                </div>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-amber-200">
                Multiple environmental shifts combine proportionally: Wave delta (+{waveDelta.toFixed(1)}m), Wind delta (+{windDelta} km/h), and Current delta (+{currentDelta.toFixed(2)} m/s) elevate total risk score from <strong>{baseRiskScore}/100 ({activeBaseline.significantWaveHeightM > 1.5 ? 'CAUTION' : 'SAFE'})</strong> to <strong>{simulatedRiskScore}/100 ({simulatedRiskBand})</strong>.
              </p>
            </div>
          )}

          {/* SECTION 3: RISK ASSESSMENT & FISHING PRODUCTIVITY PROMINENT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CARD 1: RISK ASSESSMENT */}
            <div className={`p-4 rounded-2xl border shadow-sm space-y-3 flex flex-col justify-between ${
              simulatedRiskBand === 'SAFE' ? 'bg-emerald-50/70 border-emerald-200' : simulatedRiskBand === 'CAUTION' ? 'bg-amber-50/70 border-amber-200' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-800" /> Risk Assessment
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    simulatedRiskBand === 'SAFE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : simulatedRiskBand === 'CAUTION' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {simulatedRiskBand}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <div className="text-3xl font-black text-slate-900 leading-none">
                    {simulatedRiskScore}<span className="text-xs font-bold text-slate-500">/100</span>
                  </div>
                  {isModified && (
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span className="line-through">{baseRiskScore}/100</span>
                      <span className={simulatedRiskScore > baseRiskScore ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                        ({simulatedRiskScore > baseRiskScore ? `+${simulatedRiskScore - baseRiskScore}` : simulatedRiskScore - baseRiskScore} pts)
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
                  {simulatedRiskBand === 'SAFE' 
                    ? `Marine conditions at ${selectedPort} are safe with low wave and wind hazards.` 
                    : simulatedRiskBand === 'CAUTION'
                    ? `Moderate sea hazard at ${selectedPort}. Elevated waves (${currentWave.toFixed(1)}m) require caution for small craft.`
                    : `HIGH DANGER WARNING at ${selectedPort}. Severe wave and wind stress pose significant navigation hazard.`}
                </p>
              </div>
            </div>

            {/* CARD 2: FISHING PRODUCTIVITY */}
            <div className="p-4 rounded-2xl border border-ocean-200 bg-ocean-50/70 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-wider text-ocean-900 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-ocean-600" /> Fishing Productivity
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-ocean-100 text-ocean-800 border border-ocean-300">
                    {simulatedProdScore > 70 ? 'High' : simulatedProdScore > 40 ? 'Moderate' : 'Low'} Yield
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <div className="text-3xl font-black text-ocean-700 leading-none">
                    {simulatedProdScore}<span className="text-xs font-bold text-slate-500">/100</span>
                  </div>
                  {isModified && (
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span className="line-through">{baseProdScore}/100</span>
                      <span className={simulatedProdScore < baseProdScore ? 'text-amber-700 font-extrabold' : 'text-emerald-700 font-extrabold'}>
                        ({simulatedProdScore < baseProdScore ? `${simulatedProdScore - baseProdScore}` : `+${simulatedProdScore - baseProdScore}`} pts)
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
                  Chlorophyll concentration ({currentChlorophyll.toFixed(2)} mg/m³) and SST ({currentSST.toFixed(1)}°C) govern pelagic biological productivity index.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: STEP-BY-STEP CAUSAL CHAIN ADVISORY */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4 text-ocean-600" /> Simulation Causal Chain & Vessel Advisories
            </h3>

            <div className="space-y-2 text-xs">
              {/* Step 1: Env Change */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  Step 1 — Environmental Change:
                </div>
                <div className="text-slate-600 pl-3.5">
                  Wave = {currentWave.toFixed(1)}m | Wind = {currentWind} km/h | SST = {currentSST.toFixed(1)}°C | Current = {currentSpeed.toFixed(2)} m/s | Chlorophyll = {currentChlorophyll.toFixed(2)} mg/m³
                </div>
              </div>

              {/* Step 2: Risk Shift */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Step 2 — Risk & Productivity Shift:
                </div>
                <div className="text-slate-600 pl-3.5">
                  Operational Risk: {baseRiskScore} &rarr; {simulatedRiskScore}/100 ({simulatedRiskBand}) | Productivity Score: {baseProdScore} &rarr; {simulatedProdScore}/100
                </div>
              </div>

              {/* Step 3: Vessel Impact */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-slate-700" />
                  Step 3 — Vessel Safety Impact:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-3.5 pt-0.5">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-bold block text-slate-800">Non-Motorized Canoes:</span>
                    <span className={currentWave > 0.5 ? 'text-rose-700 font-extrabold' : 'text-emerald-700 font-bold'}>
                      {currentWave > 0.5 ? '⛔ PROHIBITED (>0.5m limit)' : '🟢 SAFE'}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-bold block text-slate-800">Motorized Boats (&lt;12m):</span>
                    <span className={currentWave > 1.4 ? 'text-amber-700 font-extrabold' : 'text-emerald-700 font-bold'}>
                      {currentWave > 1.4 ? '🟡 CAUTION (Nearshore only)' : '🟢 SAFE'}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-bold block text-slate-800">Mechanized Trawlers:</span>
                    <span className={currentWave > 2.4 ? 'text-rose-700 font-extrabold' : 'text-emerald-700 font-bold'}>
                      {currentWave > 2.4 ? '🟡 EXTREME CAUTION' : '🟢 SAFE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Fishing Impact */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  Step 4 — Practical Fishing Impact:
                </div>
                <div className="text-slate-600 pl-3.5">
                  {currentWave > 1.8 
                    ? "Rough surface swell makes purse-seine and gillnet casting hazardous. High drift forces gear off target."
                    : currentChlorophyll > 0.7 
                    ? "High chlorophyll concentration encourages pelagic schooling along thermal fronts."
                    : "Normal sea state allows standard net deployment with minimal drift."}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: LIVE-UPDATING RECHARTS VISUALIZATIONS (3 Charts) */}
          <div className="space-y-6 pt-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-ocean-600" /> Live Simulation Interactive Charts
            </div>

            {/* CHART 1: PARAMETER SHIFT BAR CHART */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-indigo-600" /> 1. Parameter Baseline vs Simulated Shift
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">Bar Chart</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartPayload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Baseline" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: VESSEL OPERATING LIMITS CHART */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> 2. Vessel Wave Limit vs Simulated Wave Stress
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">Limit Gauge</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vesselLimitPayload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="WaveLimit" name="Wave Limit (m)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="CurrentWave" name={`Simulated Wave (${currentWave.toFixed(1)}m)`} fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 3: RADAR PROFILE OVERLAY */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" /> 3. Environmental Safety & Productivity Radar Overlay
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">Radar Chart</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarPayload}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Baseline Profile" dataKey="Baseline" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                    <Radar name="Simulated Scenario" dataKey="Simulated" stroke="#0284c7" fill="#0284c7" fillOpacity={0.35} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SECTION 6: MAP INTEGRATION */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-ocean-600" /> Interactive Simulated Location Map
              </h3>
              <span className="text-[10px] font-bold text-slate-500">{selectedPort}</span>
            </div>

            <div className="h-56 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner bg-slate-100">
              {coords ? (
                <MapComponent 
                  center={coords}
                  zoom={11}
                  zones={[{ id: "twin-map-loc", center: coords, radius: 3000, type: simulatedRiskBand === 'SAFE' ? "safe" : "danger", label: selectedPort }]}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-ocean-950 text-white p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{selectedPort} Marine Grid</span>
                    </div>
                  </div>
                  <div className="space-y-1 my-auto">
                    <div className="text-lg font-black text-white">{selectedPort} Sector</div>
                    <p className="text-xs text-slate-300">Digital twin simulation monitoring active wave, wind, and SST vectors.</p>
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
