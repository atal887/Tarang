import React from 'react';
import type { DemoDigitalTwinScenario } from '../../data/demoDigitalTwinDataset';
import { Cpu, ShieldAlert, BarChart2, Layers, Info, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';

interface Props {
  scenario: DemoDigitalTwinScenario;
}

const CustomTooltip = ({ active, payload, label }: any) => {
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

export const DigitalTwinVisualizations: React.FC<Props> = ({ scenario }) => {
  const { before, changed, after, affectedFactors, boatSuitability, fishingSuitabilityChange, combinedEffectDetails, chartData } = scenario;

  return (
    <div className="bg-white border border-indigo-200 rounded-xl p-4 md:p-5 shadow-sm space-y-6 text-left my-3 w-full">
      {/* Simulation Header */}
      <div className="border-b border-indigo-100 pb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase rounded-full border border-indigo-200 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-600" /> Digital Twin Mode
            </span>
            <span className="text-xs text-slate-500 font-semibold">{scenario.locationName}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug mt-1.5">
            {scenario.title}
          </h3>
        </div>
      </div>

      {/* BEFORE -> CHANGED -> AFTER Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. BEFORE */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>1. Baseline (Before)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{before.riskBand}</div>
          <div className="text-xs font-bold text-slate-600">Risk Score: <span className="text-emerald-700 font-extrabold">{before.riskScore}/100</span></div>
          <div className="grid grid-cols-2 gap-1.5 text-xs bg-white p-2 rounded border border-slate-200">
            <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Wave</span><span className="font-semibold">{before.waveHeight}</span></div>
            <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Wind</span><span className="font-semibold">{before.windSpeed}</span></div>
            <div className="col-span-2"><span className="text-[9px] text-slate-400 font-bold block uppercase">SST</span><span className="font-semibold">{before.sst}</span></div>
          </div>
        </div>

        {/* 2. CHANGED */}
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-2 shadow-sm">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
            <span>2. Simulation Input</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-black text-indigo-900 leading-snug">{changed.paramName}</div>
          <div className="text-xs font-bold text-indigo-800 bg-white p-2 rounded border border-indigo-200">{changed.changeText}</div>
          <p className="text-[11px] text-indigo-700 leading-relaxed">{changed.description}</p>
        </div>

        {/* 3. AFTER */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2 shadow-sm">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center justify-between">
            <span>3. Output (After)</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="text-xl font-extrabold text-rose-900">{after.riskBand}</div>
          <div className="text-xs font-bold text-rose-800">Risk Score: <span className="text-rose-700 font-extrabold text-sm">{after.riskScore}/100</span> <span className="text-[10px] font-semibold text-rose-600">(+{after.riskScore - before.riskScore} pts)</span></div>
          <div className="grid grid-cols-2 gap-1.5 text-xs bg-white p-2 rounded border border-rose-200">
            <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Wave</span><span className="font-bold text-rose-900">{after.waveHeight}</span></div>
            <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Wind</span><span className="font-bold text-rose-900">{after.windSpeed}</span></div>
            <div className="col-span-2"><span className="text-[9px] text-slate-400 font-bold block uppercase">SST</span><span className="font-bold text-rose-900">{after.sst}</span></div>
          </div>
        </div>
      </div>

      {/* COMBINED EFFECT BREAKDOWN (Question 3) */}
      {combinedEffectDetails && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2 shadow-sm">
          <div className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" /> Combined Multi-Factor Impact Breakdown
          </div>
          <div className="grid grid-cols-3 gap-2 text-center my-2">
            <div className="bg-white p-2 rounded border border-amber-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Wave Shift</div>
              <div className="text-sm font-extrabold text-ocean-700">+{combinedEffectDetails.waveDeltaRisk} Risk Pts</div>
            </div>
            <div className="bg-white p-2 rounded border border-amber-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Wind Surge</div>
              <div className="text-sm font-extrabold text-amber-700">+{combinedEffectDetails.windDeltaRisk} Risk Pts</div>
            </div>
            <div className="bg-white p-2 rounded border border-amber-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">SST Cooling</div>
              <div className="text-sm font-extrabold text-rose-700">+{combinedEffectDetails.sstDeltaRisk} Risk Pts</div>
            </div>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium bg-white/80 p-2.5 rounded border border-amber-200">
            {combinedEffectDetails.explanation}
          </p>
        </div>
      )}

      {/* Affected Factors & Vessel Suitability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Affected Factors List */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-500" /> Factors Affected by Simulation
          </div>
          <div className="space-y-1.5">
            {affectedFactors.map((f, i) => (
              <div key={i} className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Boat Suitability Changes */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" /> Boat Suitability Impact
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-white rounded border border-slate-100 space-y-0.5">
              <div className="font-bold text-slate-800">Non-Motorized Canoes:</div>
              <div className="text-slate-600">{boatSuitability.nonMotorized.after}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-100 space-y-0.5">
              <div className="font-bold text-slate-800">Motorized Boats (&lt;12m):</div>
              <div className="text-slate-600">{boatSuitability.motorized.after}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-100 space-y-0.5">
              <div className="font-bold text-slate-800">Mechanized Trawlers (&gt;12m):</div>
              <div className="text-slate-600">{boatSuitability.mechanized.after}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fishing Yield Impact */}
      <div className="bg-indigo-50/50 border-l-4 border-indigo-600 p-3 rounded-r-xl text-xs text-slate-800 space-y-1">
        <strong className="text-indigo-900 font-bold uppercase tracking-wider text-[10px] block">Fishing Suitability Impact:</strong>
        <p className="leading-relaxed">{fishingSuitabilityChange}</p>
      </div>

      {/* 2-3 Interactive Recharts Visualizations */}
      <div className="space-y-6 pt-3 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-600" /> Simulation Interactive Graphs (3 Charts)
        </div>

        {/* SCENARIO 1 CHARTS */}
        {scenario.id === 1 && (
          <div className="space-y-6">
            {/* Chart 1: Before vs After Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-600" /> 1. Baseline vs Simulated Metrics
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.comparisonBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Baseline" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Vessel Limits Gauge */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> 2. Wave Height vs Safe Operating Limits per Vessel Type
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.vesselLimits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Limit" name="Safe Limit (m)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" name="Simulated Wave (2.0m)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Productivity Impact Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> 3. Operational Performance & Yield Shift Index
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.productivityImpact} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="factor" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Baseline" name="Baseline Index" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" name="Simulated Index" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO 2 CHARTS */}
        {scenario.id === 2 && (
          <div className="space-y-6">
            {/* Chart 1: Wind & Secondary Wave Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-amber-600" /> 1. Wind Surge & Secondary Swell Build-up
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.comparisonBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Baseline" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Wind Threshold Comparison */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> 2. Wind Speed vs Vessel Operating Limits
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.vesselLimits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Limit" name="Wind Limit (km/h)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" name="Simulated Wind (28 km/h)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Risk Matrix Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> 3. Operational Hazard Breakdown Index
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.riskMatrix} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="Baseline" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO 3 CHARTS */}
        {scenario.id === 3 && (
          <div className="space-y-6">
            {/* Chart 1: Multi-Factor Risk Waterfall */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" /> 1. Compound Risk Escalation Step-by-Step
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.waterfallRisk} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
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
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> 2. Multi-Factor Exposure Radar Overlay
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData.combinedRadar}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Baseline" dataKey="Baseline" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                    <Radar name="Storm State" dataKey="Simulated" stroke="#ef4444" fill="#ef4444" fillOpacity={0.35} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Multi-Vessel Risk Impact */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> 3. Vessel Type Risk Jump Comparison
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.vesselImpact} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vessel" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="BaselineRisk" name="Baseline Risk" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="SimulatedRisk" name="Simulated Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
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
