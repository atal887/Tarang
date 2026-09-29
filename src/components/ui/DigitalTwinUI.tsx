import React, { useState, useEffect } from 'react';
import { useTwinStore } from '../../store/scenarioStore';
import { evaluateFishermanContext } from '../../services/decisionEngine';
import { resolveFishermanContext, getLocationCoordinates } from '../../services/contextResolver';
import { RotateCcw, Play, MapPin, Sliders, ShieldAlert, Target, Waves, Wind, Thermometer, Activity, BarChart2, Zap, ArrowRight, Anchor } from 'lucide-react';
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

// Clean helper to sanitize markdown text
function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/###/g, '').replace(/---/g, '').replace(/`/g, '').trim();
}

const CustomRechartsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-md text-xs font-medium border border-slate-700 z-50">
        <div className="font-semibold text-slate-300 mb-1 border-b border-slate-700 pb-1">{label || payload[0].name}</div>
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-slate-200">
              <span className="flex items-center gap-1.5 font-normal">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }}></span>
                {item.name}:
              </span>
              <span className="font-semibold text-white">{item.value}</span>
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
  const [localMods, setLocalMods] = useState<Partial<EnvironmentalConditions>>(() => getPortBaseline("Kochi"));

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
        newMods.significantWaveHeightM = Number((base.significantWaveHeightM + 0.8).toFixed(1));
        break;
      case 'wind':
        newMods.windSpeedKmph = Math.round(base.windSpeedKmph + 14);
        break;
      case 'sst':
        newMods.seaSurfaceTemperatureC = Number((base.seaSurfaceTemperatureC - 2.1).toFixed(1));
        break;
      case 'chlorophyll':
        newMods.chlorophyllMgM3 = Number((base.chlorophyllMgM3 + 0.42).toFixed(2));
        break;
      case 'current':
        newMods.surfaceCurrentSpeedMs = Number((base.surfaceCurrentSpeedMs + 0.90).toFixed(2));
        break;
      case 'compound':
        newMods.significantWaveHeightM = Number((base.significantWaveHeightM + 1.0).toFixed(1));
        newMods.windSpeedKmph = Math.round(base.windSpeedKmph + 18);
        newMods.seaSurfaceTemperatureC = Number((base.seaSurfaceTemperatureC - 3.6).toFixed(1));
        newMods.surfaceCurrentSpeedMs = Number((base.surfaceCurrentSpeedMs + 0.90).toFixed(2));
        newMods.chlorophyllMgM3 = Number((base.chlorophyllMgM3 + 0.42).toFixed(2));
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
    { vessel: 'Canoes (Non-Motorized)', WaveLimit: 0.5, CurrentWave: currentWave, WindLimit: 25, CurrentWind: currentWind },
    { vessel: 'Motorized (<12m)', WaveLimit: 1.4, CurrentWave: currentWave, WindLimit: 40, CurrentWind: currentWind },
    { vessel: 'Trawlers (>12m)', WaveLimit: 2.4, CurrentWave: currentWave, WindLimit: 50, CurrentWind: currentWind }
  ];

  const radarPayload = [
    { subject: 'Wave Safety', Baseline: Math.max(10, 100 - activeBaseline.significantWaveHeightM * 25), Simulated: Math.max(10, 100 - currentWave * 25) },
    { subject: 'Wind Safety', Baseline: Math.max(10, 100 - activeBaseline.windSpeedKmph * 1.2), Simulated: Math.max(10, 100 - currentWind * 1.2) },
    { subject: 'Thermal Index', Baseline: 85, Simulated: Math.max(20, 85 - (29.1 - currentSST) * 15) },
    { subject: 'Current Risk', Baseline: Math.max(10, 100 - activeBaseline.surfaceCurrentSpeedMs * 50), Simulated: Math.max(10, 100 - currentSpeed * 50) },
    { subject: 'Productivity', Baseline: baseProdScore, Simulated: simulatedProdScore }
  ];

  // Professional Slider Control Renderer
  const renderControlSlider = (
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
      <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 space-y-2 text-left" key={field}>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <span className="flex items-center gap-2 text-slate-700 font-medium">
            <IconComponent className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {label}
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">{Number(baseVal).toFixed(step < 0.1 ? 2 : 1)}{unit}</span>
            <span className="text-slate-400">&rarr;</span>
            <span className={`font-semibold px-1.5 py-0.5 rounded ${isFieldModified ? 'bg-slate-800 text-white' : 'text-slate-900 bg-slate-200/60'}`}>
              {Number(currentVal).toFixed(step < 0.1 ? 2 : 1)}{unit}
            </span>
            {isFieldModified && (
              <span className={`text-[11px] font-medium px-1 rounded ${delta >= 0 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'}`}>
                {delta >= 0 ? `+${delta.toFixed(step < 0.1 ? 2 : 1)}` : delta.toFixed(step < 0.1 ? 2 : 1)}{unit}
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
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800 transition-all"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>{min}{unit}</span>
          <span>Baseline: {Number(baseVal).toFixed(step < 0.1 ? 2 : 1)}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 sm:p-5 md:p-6 text-slate-800 font-sans text-left space-y-5">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200 uppercase tracking-wide">
              Digital Twin Simulator
            </span>
            <span className="text-xs text-slate-500">Marine Decision-Support System</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
            Marine Environmental Vector Simulation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate environmental shifts and assess operational vessel risk for Indian fishing ports.
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 shrink-0">
          <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="flex gap-2 text-xs">
            <select 
              value={selectedState} 
              onChange={handleStateChange}
              className="p-1.5 font-semibold text-slate-800 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {Object.keys(DIGITAL_TWIN_LOCATIONS).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select 
              value={selectedPort} 
              onChange={handlePortChange}
              className="p-1.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {validPorts.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: ENVIRONMENTAL CONTROLS (col-span-5) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" /> Environmental Inputs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Adjust environmental parameters to simulate scenario shifts.</p>
            </div>
            {isModified && (
              <span className="text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Modified State
              </span>
            )}
          </div>

          {/* Quick Preset Scenarios */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-500" /> Standard Scenarios ({selectedPort}):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => applyPresetScenario('wave')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div className="font-semibold text-slate-800">Wave Spike</div>
                <div className="text-[10px] text-slate-500">{activeBaseline.significantWaveHeightM}m &rarr; {(activeBaseline.significantWaveHeightM + 0.8).toFixed(1)}m</div>
              </button>

              <button
                onClick={() => applyPresetScenario('wind')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div className="font-semibold text-slate-800">Wind Surge</div>
                <div className="text-[10px] text-slate-500">{activeBaseline.windSpeedKmph} &rarr; {Math.round(activeBaseline.windSpeedKmph + 14)} km/h</div>
              </button>

              <button
                onClick={() => applyPresetScenario('sst')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div className="font-semibold text-slate-800">SST Drop</div>
                <div className="text-[10px] text-slate-500">{activeBaseline.seaSurfaceTemperatureC}°C &rarr; {(activeBaseline.seaSurfaceTemperatureC - 2.1).toFixed(1)}°C</div>
              </button>

              <button
                onClick={() => applyPresetScenario('chlorophyll')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div className="font-semibold text-slate-800">Chlorophyll</div>
                <div className="text-[10px] text-slate-500">{activeBaseline.chlorophyllMgM3} &rarr; {(activeBaseline.chlorophyllMgM3 + 0.42).toFixed(2)}</div>
              </button>

              <button
                onClick={() => applyPresetScenario('current')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div className="font-semibold text-slate-800">Current Surge</div>
                <div className="text-[10px] text-slate-500">{activeBaseline.surfaceCurrentSpeedMs} &rarr; {(activeBaseline.surfaceCurrentSpeedMs + 0.90).toFixed(2)} m/s</div>
              </button>

              <button
                onClick={() => applyPresetScenario('compound')}
                className="p-2 rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-left transition-colors font-semibold text-slate-900"
              >
                <div className="font-bold text-slate-900">Compound Shock</div>
                <div className="text-[10px] text-slate-600">Multi-vector storm</div>
              </button>
            </div>
          </div>

          {/* Environmental Controls Sliders */}
          {hasPorts ? (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {renderControlSlider('Significant Wave Height (Hs)', 'significantWaveHeightM', 0, 5, 0.1, 'm', Waves)}
              {renderControlSlider('Wind Speed (Vw)', 'windSpeedKmph', 0, 80, 1, 'km/h', Wind)}
              {renderControlSlider('Sea Surface Temp (SST)', 'seaSurfaceTemperatureC', 20, 35, 0.1, '°C', Thermometer)}
              {renderControlSlider('Surface Current Speed (uc)', 'surfaceCurrentSpeedMs', 0, 2, 0.05, 'm/s', Activity)}
              {renderControlSlider('Chlorophyll Concentration', 'chlorophyllMgM3', 0, 5, 0.1, 'mg/m³', Zap)}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={handleReset} 
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Baseline
                </button>
                <button 
                  onClick={handleSimulate} 
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Simulate Scenario
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
              Please select a valid port to activate the simulator.
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: SIMULATION ASSESSMENT (col-span-7) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-5 min-w-0">
          
          {/* FLOW STEP 1: WHAT CHANGED */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" /> 1. Parameter Shift (Baseline &rarr; Simulated)
              </h2>
              <span className="text-xs font-medium text-slate-500">{selectedPort}</span>
            </div>

            {isModified ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Wave Diff */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-700">Wave Height:</span>
                  <span className="font-semibold text-slate-900">
                    {activeBaseline.significantWaveHeightM}m &rarr; {currentWave.toFixed(1)}m <span className="text-[11px] font-semibold text-amber-700">({waveDelta >= 0 ? `+${waveDelta.toFixed(1)}` : waveDelta.toFixed(1)}m)</span>
                  </span>
                </div>

                {/* Wind Diff */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-700">Wind Speed:</span>
                  <span className="font-semibold text-slate-900">
                    {activeBaseline.windSpeedKmph} &rarr; {currentWind} km/h <span className="text-[11px] font-semibold text-amber-700">({windDelta >= 0 ? `+${windDelta}` : windDelta} km/h)</span>
                  </span>
                </div>

                {/* SST Diff */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-700">Sea Surface Temp:</span>
                  <span className="font-semibold text-slate-900">
                    {activeBaseline.seaSurfaceTemperatureC}°C &rarr; {currentSST.toFixed(1)}°C <span className="text-[11px] font-semibold text-slate-600">({sstDelta >= 0 ? `+${sstDelta.toFixed(1)}` : sstDelta.toFixed(1)}°C)</span>
                  </span>
                </div>

                {/* Current Diff */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-700">Surface Current:</span>
                  <span className="font-semibold text-slate-900">
                    {activeBaseline.surfaceCurrentSpeedMs} &rarr; {currentSpeed.toFixed(2)} m/s <span className="text-[11px] font-semibold text-slate-600">({currentDelta >= 0 ? `+${currentDelta.toFixed(2)}` : currentDelta.toFixed(2)} m/s)</span>
                  </span>
                </div>

                {/* Chlorophyll Diff */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between col-span-1 sm:col-span-2">
                  <span className="font-medium text-slate-700">Chlorophyll Conc.:</span>
                  <span className="font-semibold text-slate-900">
                    {activeBaseline.chlorophyllMgM3} &rarr; {currentChlorophyll.toFixed(2)} mg/m³ <span className="text-[11px] font-semibold text-emerald-700">({chlorophyllDelta >= 0 ? `+${chlorophyllDelta.toFixed(2)}` : chlorophyllDelta.toFixed(2)} mg/m³)</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 text-center font-medium">
                Baseline environmental conditions active. Adjust sliders on the left or select a standard scenario to simulate shifts.
              </div>
            )}
          </div>

          {/* FLOW STEP 2: RESULT (OPERATIONAL RISK & PRODUCTIVITY) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Operational Risk Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-600" /> Operational Risk Index
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    simulatedRiskBand === 'SAFE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : simulatedRiskBand === 'CAUTION' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {simulatedRiskBand}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-slate-900 leading-none">
                    {simulatedRiskScore}<span className="text-xs font-normal text-slate-400">/100</span>
                  </span>
                  {isModified && (
                    <span className="text-xs text-slate-500 font-medium">
                      Baseline {baseRiskScore}/100 ({simulatedRiskScore >= baseRiskScore ? `+${simulatedRiskScore - baseRiskScore}` : simulatedRiskScore - baseRiskScore} pts)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {cleanText(
                    simulatedRiskBand === 'SAFE' 
                      ? `Marine conditions at ${selectedPort} are safe with minimal wave and wind stress.` 
                      : simulatedRiskBand === 'CAUTION'
                      ? `Elevated hazard at ${selectedPort}. Wave swell (${currentWave.toFixed(1)}m) requires caution for small craft.`
                      : `High operational hazard at ${selectedPort}. Elevated waves and wind force pose severe navigation hazard.`
                  )}
                </p>
              </div>
            </div>

            {/* Pelagic Yield Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-slate-600" /> Pelagic Yield Index
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {simulatedProdScore > 70 ? 'High Potential' : simulatedProdScore > 40 ? 'Moderate Potential' : 'Low Potential'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-slate-900 leading-none">
                    {simulatedProdScore}<span className="text-xs font-normal text-slate-400">/100</span>
                  </span>
                  {isModified && (
                    <span className="text-xs text-slate-500 font-medium">
                      Baseline {baseProdScore}/100 ({simulatedProdScore >= baseProdScore ? `+${simulatedProdScore - baseProdScore}` : simulatedProdScore - baseProdScore} pts)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {cleanText(`Chlorophyll (${currentChlorophyll.toFixed(2)} mg/m³) and thermal structure (${currentSST.toFixed(1)}°C) govern pelagic schooling potential.`)}
                </p>
              </div>
            </div>
          </div>

          {/* FLOW STEP 3: WHAT IT AFFECTS (CAUSAL CHAIN & VESSEL ADVISORIES) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <ArrowRight className="w-4 h-4 text-slate-600" /> 2. Operational Impact & Vessel Limits
            </h2>

            <div className="space-y-2 text-xs">
              {/* Step 1: Environmental Vector Shift */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  Environmental Vector Shift:
                </div>
                <div className="text-slate-600 pl-4">
                  Wave: {currentWave.toFixed(1)}m | Wind: {currentWind} km/h | SST: {currentSST.toFixed(1)}°C | Current: {currentSpeed.toFixed(2)} m/s | Chlorophyll: {currentChlorophyll.toFixed(2)} mg/m³
                </div>
              </div>

              {/* Step 2: Risk & Yield Shift */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  Risk & Yield Shift:
                </div>
                <div className="text-slate-600 pl-4">
                  Operational Risk Index: {baseRiskScore} &rarr; {simulatedRiskScore}/100 ({simulatedRiskBand}) | Yield Index: {baseProdScore} &rarr; {simulatedProdScore}/100
                </div>
              </div>

              {/* Step 3: Vessel Threshold Advisories */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Anchor className="w-3.5 h-3.5 text-slate-600" />
                  Vessel Threshold Advisories:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-4">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold block text-slate-800">Canoes (Non-Motorized):</span>
                    <span className={currentWave > 0.5 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
                      {currentWave > 0.5 ? 'Prohibited (>0.5m limit)' : 'Safe Operations'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold block text-slate-800">Motorized Boats (&lt;12m):</span>
                    <span className={currentWave > 1.4 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-semibold'}>
                      {currentWave > 1.4 ? 'Caution (Nearshore only)' : 'Safe Operations'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold block text-slate-800">Trawlers (&gt;12m):</span>
                    <span className={currentWave > 2.4 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
                      {currentWave > 2.4 ? 'Extreme Caution Required' : 'Safe Operations'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Practical Fishery Advisory */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-slate-600" />
                  Practical Fishing Operational Advisory:
                </div>
                <div className="text-slate-600 pl-4 leading-relaxed">
                  {cleanText(
                    currentWave > 1.8 
                      ? "Rough surface swell makes purse-seine and gillnet deployment hazardous. Vessel drift requires increased engine power."
                      : currentChlorophyll > 0.7 
                      ? "Favorable chlorophyll concentration indicates potential pelagic fish aggregation near thermal fronts."
                      : "Standard sea conditions allow regular fishing net deployment with predictable drift forces."
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FLOW STEP 4: VISUALIZATIONS (3 CLEAN RECHARTS) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <BarChart2 className="w-4 h-4 text-slate-600" /> 3. Environmental & Performance Charts
            </h2>

            {/* CHART 1: PARAMETER SHIFT BAR CHART */}
            <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>1. Environmental Parameter Baseline vs Simulated Shift</span>
                <span className="text-[10px] text-slate-400 font-normal">Bar Chart</span>
              </div>
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartPayload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Baseline" fill="#64748b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#0284c7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: VESSEL OPERATING LIMITS CHART */}
            <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>2. Wave Height vs Safe Vessel Operating Limits</span>
                <span className="text-[10px] text-slate-400 font-normal">Threshold Chart</span>
              </div>
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vesselLimitPayload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="WaveLimit" name="Safe Wave Limit (m)" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="CurrentWave" name={`Simulated Wave (${currentWave.toFixed(1)}m)`} fill="#dc2626" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 3: RADAR PROFILE OVERLAY */}
            <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>3. Environmental Safety Profile Overlay</span>
                <span className="text-[10px] text-slate-400 font-normal">Radar Chart</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarPayload}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Baseline State" dataKey="Baseline" stroke="#475569" fill="#475569" fillOpacity={0.2} />
                    <Radar name="Simulated Scenario" dataKey="Simulated" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* FLOW STEP 5: SECTOR MAP */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600" /> Interactive Simulated Sector Map
              </h2>
              <span className="text-xs text-slate-500 font-medium">{selectedPort}</span>
            </div>

            <div className="h-56 rounded-lg overflow-hidden border border-slate-200 relative shadow-inner bg-slate-100">
              {coords ? (
                <MapComponent 
                  center={coords}
                  zoom={11}
                  zones={[{ id: "twin-map-loc", center: coords, radius: 3000, type: simulatedRiskBand === 'SAFE' ? "safe" : "danger", label: selectedPort }]}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-800 text-white p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{selectedPort} Sector Grid</span>
                  </div>
                  <div className="space-y-1 my-auto">
                    <div className="text-base font-bold text-white">{selectedPort} Port Monitoring Sector</div>
                    <p className="text-xs text-slate-300">Environmental vectors and operational risk simulation active.</p>
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
