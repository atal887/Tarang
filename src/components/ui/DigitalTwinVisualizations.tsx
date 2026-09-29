import React from 'react';
import type { DemoDigitalTwinScenario } from '../../data/demoDigitalTwinDataset';
import { ShieldAlert, BarChart2, Layers, Info, Zap, Anchor } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';

interface Props {
  scenario: DemoDigitalTwinScenario;
}

function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/###/g, '').replace(/---/g, '').replace(/`/g, '').trim();
}

const CustomTooltip = ({ active, payload, label }: any) => {
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

export const DigitalTwinVisualizations: React.FC<Props> = ({ scenario }) => {
  const { before, changed, after, affectedFactors, boatSuitability, fishingSuitabilityChange, combinedEffectDetails, chartData } = scenario;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-5 text-left my-3 w-full">
      {/* Simulation Header */}
      <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200 uppercase tracking-wide">
              Digital Twin Simulation
            </span>
            <span className="text-xs text-slate-500">{cleanText(scenario.locationName)}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug mt-1.5">
            {cleanText(scenario.title)}
          </h3>
        </div>
      </div>

      {/* BEFORE -> CHANGED -> AFTER Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. BEFORE */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center justify-between">
            <span>1. Baseline (Before)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-lg font-bold text-slate-900">{cleanText(before.riskBand)}</div>
          <div className="text-xs font-medium text-slate-600">Risk Index: <span className="text-slate-900 font-bold">{before.riskScore}/100</span></div>
          <div className="grid grid-cols-2 gap-1.5 text-xs bg-white p-2 rounded border border-slate-200 mt-1">
            <div><span className="text-[10px] text-slate-400 font-medium block uppercase">Wave</span><span className="font-semibold text-slate-800">{before.waveHeight}</span></div>
            <div><span className="text-[10px] text-slate-400 font-medium block uppercase">Wind</span><span className="font-semibold text-slate-800">{before.windSpeed}</span></div>
            <div className="col-span-2"><span className="text-[10px] text-slate-400 font-medium block uppercase">SST</span><span className="font-semibold text-slate-800">{before.sst}</span></div>
          </div>
        </div>

        {/* 2. CHANGED */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
            <span>2. Simulation Input</span>
            <Zap className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 leading-snug">{cleanText(changed.paramName)}</div>
          <div className="text-xs font-semibold text-slate-800 bg-white p-2 rounded border border-slate-200">{cleanText(changed.changeText)}</div>
          <p className="text-xs text-slate-600 leading-relaxed">{cleanText(changed.description)}</p>
        </div>

        {/* 3. AFTER */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
            <span>3. Output (After)</span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          </div>
          <div className="text-lg font-bold text-slate-900">{cleanText(after.riskBand)}</div>
          <div className="text-xs font-medium text-slate-600">Risk Index: <span className="text-slate-900 font-bold">{after.riskScore}/100</span> <span className="text-slate-500">(+{after.riskScore - before.riskScore} pts)</span></div>
          <div className="grid grid-cols-2 gap-1.5 text-xs bg-white p-2 rounded border border-slate-200 mt-1">
            <div><span className="text-[10px] text-slate-400 font-medium block uppercase">Wave</span><span className="font-bold text-slate-900">{after.waveHeight}</span></div>
            <div><span className="text-[10px] text-slate-400 font-medium block uppercase">Wind</span><span className="font-bold text-slate-900">{after.windSpeed}</span></div>
            <div className="col-span-2"><span className="text-[10px] text-slate-400 font-medium block uppercase">SST</span><span className="font-bold text-slate-900">{after.sst}</span></div>
          </div>
        </div>
      </div>

      {/* COMBINED EFFECT BREAKDOWN */}
      {combinedEffectDetails && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-slate-600" /> Multi-Factor Risk Calculation Shift
          </div>
          <div className="grid grid-cols-3 gap-2 text-center my-1.5">
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] font-medium text-slate-400 uppercase">Wave Shift</div>
              <div className="text-xs font-bold text-slate-800">+{combinedEffectDetails.waveDeltaRisk} Pts</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] font-medium text-slate-400 uppercase">Wind Surge</div>
              <div className="text-xs font-bold text-slate-800">+{combinedEffectDetails.windDeltaRisk} Pts</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] font-medium text-slate-400 uppercase">SST Cooling</div>
              <div className="text-xs font-bold text-slate-800">+{combinedEffectDetails.sstDeltaRisk} Pts</div>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white p-2.5 rounded border border-slate-200">
            {cleanText(combinedEffectDetails.explanation)}
          </p>
        </div>
      )}

      {/* Affected Factors & Vessel Suitability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Affected Factors List */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" /> Factors Affected
          </div>
          <div className="space-y-1.5 text-xs">
            {affectedFactors.map((f, i) => (
              <div key={i} className="text-slate-700 bg-white p-2 rounded border border-slate-200 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                {cleanText(f)}
              </div>
            ))}
          </div>
        </div>

        {/* Boat Suitability Changes */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Anchor className="w-3.5 h-3.5 text-slate-600" /> Boat Operating Limits
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-white rounded border border-slate-200 space-y-0.5">
              <div className="font-semibold text-slate-800">Canoes (Non-Motorized):</div>
              <div className="text-slate-600">{cleanText(boatSuitability.nonMotorized.after)}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 space-y-0.5">
              <div className="font-semibold text-slate-800">Motorized Boats (&lt;12m):</div>
              <div className="text-slate-600">{cleanText(boatSuitability.motorized.after)}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 space-y-0.5">
              <div className="font-semibold text-slate-800">Trawlers (&gt;12m):</div>
              <div className="text-slate-600">{cleanText(boatSuitability.mechanized.after)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fishing Yield Impact */}
      <div className="bg-slate-50 border-l-4 border-slate-700 p-3 rounded-r-lg text-xs text-slate-800 space-y-1">
        <span className="text-slate-900 font-bold uppercase tracking-wide text-[10px] block">Fishery Operational Advisory:</span>
        <p className="leading-relaxed text-slate-700">{cleanText(fishingSuitabilityChange)}</p>
      </div>

      {/* 2-3 Interactive Recharts Visualizations */}
      <div className="space-y-5 pt-3 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-slate-600" /> Simulation Graphs
        </div>

        {/* SCENARIO 1 & 4 CHARTS (Wave Height Spike) */}
        {(scenario.id === 1 || scenario.id === 4) && (
          <div className="space-y-5">
            {/* Chart 1: Before vs After Bar */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-slate-600" /> 1. Baseline vs Simulated Metrics
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.comparisonBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Baseline" fill="#64748b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#0284c7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Vessel Limits Gauge */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-600" /> 2. Wave Height vs Vessel Limits
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.vesselLimits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Limit" name="Safe Limit (m)" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" name={`Simulated Wave (${cleanText(scenario.after.waveHeight)})`} fill="#dc2626" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Operational Yield Shift */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-600" /> 3. Performance & Yield Shift Index
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.productivityImpact} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="factor" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Baseline" name="Baseline Index" fill="#0284c7" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" name="Simulated Index" fill="#64748b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO 2 CHARTS */}
        {scenario.id === 2 && (
          <div className="space-y-5">
            {/* Chart 1: Wind & Secondary Wave Bar */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-slate-600" /> 1. Wind Surge & Secondary Swell Build-up
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.comparisonBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Baseline" fill="#0284c7" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#64748b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Wind Threshold Comparison */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-600" /> 2. Wind Speed vs Vessel Operating Limits
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.vesselLimits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Limit" name="Wind Limit (km/h)" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" name={`Simulated Wind (${cleanText(scenario.after.windSpeed)})`} fill="#dc2626" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Risk Matrix Bar */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-600" /> 3. Operational Hazard Breakdown Index
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.riskMatrix} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Baseline" fill="#475569" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#dc2626" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO 3 & 5 CHARTS (Compound Shock) */}
        {(scenario.id === 3 || scenario.id === 5) && (
          <div className="space-y-5">
            {/* Chart 1: Multi-Factor Risk Waterfall */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-slate-600" /> 1. Compound Risk Escalation Step-by-Step
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.waterfallRisk} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Risk" name="Cumulative Risk (/100)">
                      {chartData.waterfallRisk.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Combined Radar Profile */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-600" /> 2. Multi-Factor Exposure Radar Overlay
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData.combinedRadar}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Baseline" dataKey="Baseline" stroke="#475569" fill="#475569" fillOpacity={0.2} />
                    <Radar name="Storm State" dataKey="Simulated" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Multi-Vessel Risk Impact */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-600" /> 3. Vessel Type Risk Comparison
              </div>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.vesselImpact} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="BaselineRisk" name="Baseline Risk" fill="#0284c7" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="SimulatedRisk" name="Simulated Risk" fill="#dc2626" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
