import React, { useState } from 'react';
import type { DemoResearcherScenario } from '../../data/demoResearcherDataset';
import { FormattedMessage } from './FormattedMessage';
import { MapComponent } from '../map/MapComponent';
import { MapIcon, BarChart2, TrendingUp, ScatterChart as ScatterIcon, Navigation, ShieldAlert, Award, Layers } from 'lucide-react';
import { Button } from './Button';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell
} from 'recharts';

interface Props {
  scenario: DemoResearcherScenario;
}

// Custom Glassmorphic Tooltip for Recharts
const CustomRechartsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700/60 text-xs backdrop-blur-md z-50">
        <div className="font-bold text-ocean-400 mb-1 border-b border-slate-700/60 pb-1">{label || payload[0].name}</div>
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

export const ResearcherVisualizations: React.FC<Props> = ({ scenario }) => {
  const [activeMapPort, setActiveMapPort] = useState<{ coords: [number, number]; name: string } | null>(null);
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<'all' | 'wave' | 'wind' | 'sst'>('all');
  const [activeRouteIndex, setActiveRouteIndex] = useState<number | null>(null);

  // Hardcoded Data Arrays for Recharts

  // Scenario 1 Data
  const s1BarData = [
    { name: 'Wave Height (m)', Mumbai: 1.8, Kochi: 1.2 },
    { name: 'Wind Speed (km/h)', Mumbai: 19, Kochi: 14 },
    { name: 'SST (°C)', Mumbai: 28.4, Kochi: 29.1 },
    { name: 'Chlorophyll (mg/m³ x10)', Mumbai: 7.2, Kochi: 4.8 },
    { name: 'Risk Score (/100)', Mumbai: 48, Kochi: 28 }
  ];

  const s1RadarData = [
    { subject: 'Wave Safety', Mumbai: 52, Kochi: 75 },
    { subject: 'Wind Safety', Mumbai: 55, Kochi: 72 },
    { subject: 'SST Potential', Mumbai: 80, Kochi: 88 },
    { subject: 'Chlorophyll', Mumbai: 85, Kochi: 55 },
    { subject: 'PFZ Probability', Mumbai: 70, Kochi: 65 }
  ];

  const s1RiskData = [
    { location: 'Mumbai Port', OperationalRisk: 48, ProductivityIndex: 78 },
    { location: 'Kochi Harbour', OperationalRisk: 28, ProductivityIndex: 62 }
  ];

  // Scenario 2 Data
  const s2BarData = [
    { factor: 'Wave Height (m)', BhauchaDhakka: 1.2, SassoonDock: 1.5 },
    { factor: 'Wind Speed (km/h)', BhauchaDhakka: 14, SassoonDock: 17 },
    { factor: 'Risk Score (/100)', BhauchaDhakka: 26, SassoonDock: 38 }
  ];

  const s2RadarData = [
    { subject: 'Swell Shelter', BhauchaDhakka: 88, SassoonDock: 70 },
    { subject: 'Wind Protection', BhauchaDhakka: 82, SassoonDock: 68 },
    { subject: 'Tidal Access', BhauchaDhakka: 90, SassoonDock: 85 },
    { subject: 'Safety Margin', BhauchaDhakka: 74, SassoonDock: 62 },
    { subject: 'Thermal Profile', BhauchaDhakka: 80, SassoonDock: 79 }
  ];

  const s2RiskData = [
    { port: 'Bhaucha Dhakka', RiskScore: 26, SafeThreshold: 35 },
    { port: 'Sassoon Dock', RiskScore: 38, SafeThreshold: 35 }
  ];

  // Scenario 3 Data
  const s3TrendData = [
    { day: 'Day 1', WaveHeight: 1.1, WindSpeed: 12, SST: 29.2 },
    { day: 'Day 2', WaveHeight: 1.3, WindSpeed: 15, SST: 29.1 },
    { day: 'Day 3', WaveHeight: 1.6, WindSpeed: 19, SST: 28.9 }
  ];

  const s3AreaData = [
    { day: 'Day 1', SeaStressIndex: 25, Wave: 1.1, Wind: 12 },
    { day: 'Day 2', SeaStressIndex: 42, Wave: 1.3, Wind: 15 },
    { day: 'Day 3', SeaStressIndex: 68, Wave: 1.6, Wind: 19 }
  ];

  // Scenario 4 Data
  const s4ScatterData = [
    { name: 'Kochi Fishing Grounds', x: 0.48, y: 28, z: 29.1, fill: '#10b981' },
    { name: 'Kavaratti Fishing Grounds', x: 0.63, y: 31, z: 29.4, fill: '#0ea5e9' },
    { name: 'Veraval Fishing Grounds', x: 0.72, y: 46, z: 28.4, fill: '#ef4444' }
  ];

  const s4FactorData = [
    { area: 'Kochi', SST: 29.1, Chlorophyll: 4.8, Wave: 1.2, Risk: 28 },
    { area: 'Kavaratti', SST: 29.4, Chlorophyll: 6.3, Wave: 1.3, Risk: 31 },
    { area: 'Veraval', SST: 28.4, Chlorophyll: 7.2, Wave: 1.7, Risk: 46 }
  ];

  const s4RankingData = [
    { area: 'Kavaratti Grounds', SuitabilityScore: 82, SafetyScore: 69 },
    { area: 'Kochi Grounds', SuitabilityScore: 74, SafetyScore: 72 },
    { area: 'Veraval Grounds', SuitabilityScore: 79, SafetyScore: 54 }
  ];

  // Scenario 5 Data
  const s5RiskDistanceData = [
    { route: 'Route 1 (Coastal)', DistanceKm: 42, RiskScore: 29 },
    { route: 'Route 2 (Offshore)', DistanceKm: 31, RiskScore: 52 },
    { route: 'Route 3 (Sheltered)', DistanceKm: 47, RiskScore: 24 }
  ];

  const s5ExposureData = [
    { route: 'Route 1 (Coastal)', WaveExposure: 1.2, WindExposure: 14 },
    { route: 'Route 2 (Offshore)', WaveExposure: 1.8, WindExposure: 22 },
    { route: 'Route 3 (Sheltered)', WaveExposure: 1.1, WindExposure: 11 }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-6 text-left my-3 w-full">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900 leading-snug flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-ocean-600 shrink-0" />
          {scenario.title}
        </h3>
        <div className="text-xs text-slate-500 mt-1">TARANG Researcher Mode Multi-Chart Analysis</div>
      </div>

      {/* Structured Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-slate-50">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="text-[11px] uppercase bg-slate-800 text-white tracking-wider font-bold">
            <tr>
              {scenario.id === 1 && (
                <>
                  <th className="px-3.5 py-2.5">Factor</th>
                  <th className="px-3.5 py-2.5 text-right">Mumbai</th>
                  <th className="px-3.5 py-2.5 text-right">Kochi</th>
                </>
              )}
              {scenario.id === 2 && (
                <>
                  <th className="px-3.5 py-2.5">Factor</th>
                  <th className="px-3.5 py-2.5 text-right">Bhaucha Dhakka</th>
                  <th className="px-3.5 py-2.5 text-right">Sassoon Dock</th>
                </>
              )}
              {scenario.id === 3 && (
                <>
                  <th className="px-3.5 py-2.5">Day</th>
                  <th className="px-3.5 py-2.5 text-right">Wave Height</th>
                  <th className="px-3.5 py-2.5 text-right">Wind Speed</th>
                  <th className="px-3.5 py-2.5 text-right">SST</th>
                </>
              )}
              {scenario.id === 4 && (
                <>
                  <th className="px-3.5 py-2.5">Fishing Area</th>
                  <th className="px-3.5 py-2.5 text-right">SST</th>
                  <th className="px-3.5 py-2.5 text-right">Chlorophyll</th>
                  <th className="px-3.5 py-2.5 text-right">Wave</th>
                  <th className="px-3.5 py-2.5 text-right">Risk Score</th>
                </>
              )}
              {scenario.id === 5 && (
                <>
                  <th className="px-3.5 py-2.5">Route Option</th>
                  <th className="px-3.5 py-2.5 text-right">Distance</th>
                  <th className="px-3.5 py-2.5 text-right">Wave Exp</th>
                  <th className="px-3.5 py-2.5 text-right">Wind Exp</th>
                  <th className="px-3.5 py-2.5 text-right">Risk Score</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {scenario.id === 1 && scenario.tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-bold text-slate-800">{row.factor}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.mumbai}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-ocean-700">{row.kochi}</td>
              </tr>
            ))}
            {scenario.id === 2 && scenario.tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-bold text-slate-800">{row.factor}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-ocean-700">{row.bhaucha}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.sassoon}</td>
              </tr>
            ))}
            {scenario.id === 3 && scenario.tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-bold text-slate-800">{row.day}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.waveText}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.windText}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-ocean-700">{row.sstText}</td>
              </tr>
            ))}
            {scenario.id === 4 && scenario.tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-bold text-slate-800">{row.area}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.sstText}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.chloText}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.waveText}</td>
                <td className="px-3.5 py-2.5 text-right font-bold text-ocean-700">{row.risk}/100</td>
              </tr>
            ))}
            {scenario.id === 5 && scenario.tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }}></span>
                  {row.route}
                </td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.distanceKm} km</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.wave}</td>
                <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">{row.wind}</td>
                <td className="px-3.5 py-2.5 text-right font-bold text-ocean-700">{row.risk}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interpretation Box */}
      <div className="bg-ocean-50/60 border-l-4 border-ocean-600 p-3.5 rounded-r-xl text-xs md:text-sm text-slate-800 space-y-1.5">
        <div className="font-bold text-ocean-900 uppercase tracking-wider text-[11px] mb-1">Interpretation & Analysis</div>
        <FormattedMessage content={scenario.interpretation} />
      </div>

      {/* Interactive Visualizations Section */}
      <div className="space-y-6 pt-2 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-ocean-600" />
          Interactive Visualizations ({scenario.id === 1 || scenario.id === 2 || scenario.id === 3 || scenario.id === 4 || scenario.id === 5 ? '3 Graphs Available' : '2 Graphs Available'})
        </div>

        {/* ========================================================= */}
        {/* SCENARIO 1: Mumbai vs Kochi Comparison */}
        {/* ========================================================= */}
        {scenario.id === 1 && (
          <div className="space-y-6">
            {/* Graph 1: Grouped Bar Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-slate-700" /> 1. Environmental Factors Side-by-Side
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Grouped Bar</span>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s1BarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Mumbai" fill="#334155" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Kochi" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Dual Multi-Factor Radar Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" /> 2. Multi-Factor Environmental Radar Profile
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Radar Chart</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={s1RadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Mumbai" dataKey="Mumbai" stroke="#475569" fill="#475569" fillOpacity={0.25} />
                    <Radar name="Kochi" dataKey="Kochi" stroke="#0284c7" fill="#0284c7" fillOpacity={0.35} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Risk vs Productivity Trade-Off Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" /> 3. Operational Risk vs Biological Productivity
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Composed Chart</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s1RiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="location" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <ReferenceLine y={40} label={{ value: 'Risk Limit (40)', fill: '#ef4444', fontSize: 10, position: 'top' }} stroke="#ef4444" strokeDasharray="3 3" />
                    <Bar dataKey="OperationalRisk" name="Operational Risk (/100)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ProductivityIndex" name="Productivity Index (/100)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENARIO 2: Ports near Mumbai Comparison */}
        {/* ========================================================= */}
        {scenario.id === 2 && (
          <div className="space-y-6">
            {/* Graph 1: Grouped Bar Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-ocean-600" /> 1. Port Marine Conditions (Bhaucha vs Sassoon)
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Grouped Bar</span>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s2BarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="factor" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="BhauchaDhakka" name="Bhaucha Dhakka" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="SassoonDock" name="Sassoon Dock" fill="#d97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Port Protection Radar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" /> 2. Port Shelter & Protection Radar
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Radar Chart</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={s2RadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Bhaucha Dhakka" dataKey="BhauchaDhakka" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                    <Radar name="Sassoon Dock" dataKey="SassoonDock" stroke="#d97706" fill="#d97706" fillOpacity={0.3} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Operational Risk Threshold */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> 3. Operational Risk Score vs Threshold
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Risk Bar</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s2RiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="port" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <YAxis domain={[0, 50]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <ReferenceLine y={30} label={{ value: 'Safe Limit (30)', fill: '#10b981', fontSize: 10, position: 'top' }} stroke="#10b981" strokeDasharray="3 3" />
                    <Bar dataKey="RiskScore" name="Risk Score (/100)">
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENARIO 3: 3-Day Environmental Trend — Kochi */}
        {/* ========================================================= */}
        {scenario.id === 3 && (
          <div className="space-y-6">
            {/* Graph 1: Interactive Multi-Line Trend */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-ocean-600" /> 1. 3-Day Environmental Trajectory (Interactive)
                </div>
                <div className="flex gap-1">
                  {(['all', 'wave', 'wind', 'sst'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTrendMetric(tab)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${selectedTrendMetric === tab ? 'bg-ocean-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={s3TrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    {(selectedTrendMetric === 'all' || selectedTrendMetric === 'wave') && (
                      <Line type="monotone" dataKey="WaveHeight" name="Wave Height (m)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} />
                    )}
                    {(selectedTrendMetric === 'all' || selectedTrendMetric === 'wind') && (
                      <Line type="monotone" dataKey="WindSpeed" name="Wind Speed (km/h)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
                    )}
                    {(selectedTrendMetric === 'all' || selectedTrendMetric === 'sst') && (
                      <Line type="monotone" dataKey="SST" name="SST (°C)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Cumulative Sea Stress Area Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" /> 2. Marine Condition Stress Index Buildup
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Area Chart</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s3AreaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Area type="monotone" dataKey="SeaStressIndex" name="Combined Sea Stress Index" stroke="#0284c7" fillOpacity={1} fill="url(#colorStress)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Daily Factor Comparison Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-amber-600" /> 3. Day-by-Day Factor Magnitude Breakdown
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Grouped Bar</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s3TrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="WaveHeight" name="Wave (m)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="WindSpeed" name="Wind (km/h)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENARIO 4: Fishing Area Potential (Kochi vs Kavaratti vs Veraval) */}
        {/* ========================================================= */}
        {scenario.id === 4 && (
          <div className="space-y-6">
            {/* Graph 1: Trade-Off Scatter / Bubble Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ScatterIcon className="w-4 h-4 text-ocean-600" /> 1. Productivity vs Risk Scatter Analysis
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Scatter Plot</span>
              </div>
              <p className="text-[11px] text-slate-500">X = Chlorophyll (mg/m³) &bull; Y = Operational Risk Score (/100) &bull; Bubble = Fishing Ground</p>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" dataKey="x" name="Chlorophyll" unit=" mg/m³" domain={[0.3, 0.8]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis type="number" dataKey="y" name="Risk Score" domain={[20, 60]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <ZAxis type="number" dataKey="z" range={[100, 300]} name="SST" unit="°C" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomRechartsTooltip />} />
                    <Scatter name="Fishing Grounds" data={s4ScatterData}>
                      {s4ScatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Multi-Factor Environmental Comparison */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-emerald-600" /> 2. Environmental Indicators Comparison
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Grouped Bar</span>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s4FactorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="SST" name="SST (°C)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Chlorophyll" name="Chlorophyll (x10)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Risk" name="Risk Score (/100)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Location Ranking Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" /> 3. Overall Location Ranking Index
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Rank Bar</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={s4RankingData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis type="category" dataKey="area" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="SuitabilityScore" name="Productivity Index" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="SafetyScore" name="Safety Margin" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENARIO 5: Route Comparison (Mumbai Fishing Trip) */}
        {/* ========================================================= */}
        {scenario.id === 5 && (
          <div className="space-y-6">
            {/* Graph 1: Route Map Component */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-ocean-600" /> 1. Interactive Route Trajectory Map
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {scenario.tableData.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveRouteIndex(activeRouteIndex === idx ? null : idx)}
                    className={`flex-1 p-2.5 rounded-lg border text-left text-xs transition-all ${activeRouteIndex === idx ? 'bg-white border-ocean-500 ring-2 ring-ocean-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                      {r.route}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {r.distanceKm} km &bull; Risk: <strong>{r.risk}/100</strong>
                    </div>
                  </button>
                ))}
              </div>
              <div className="h-64 border border-slate-200 rounded-xl overflow-hidden relative bg-white shadow-sm">
                <MapComponent
                  center={[18.86, 72.80]}
                  zoom={10}
                  routes={scenario.tableData.filter((_, idx) => activeRouteIndex === null || activeRouteIndex === idx).map(r => ({
                    id: r.route,
                    positions: r.positions,
                    color: r.color
                  }))}
                  markers={[
                    { id: "start", position: [18.92, 72.83], label: "Mumbai Port (Sassoon Dock)", type: "start" },
                    { id: "dest", position: [18.80, 72.70], label: "Alibaug Fishing Zone", type: "destination" }
                  ]}
                />
              </div>
            </div>

            {/* Graph 2: Distance vs Risk Bar Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-slate-700" /> 2. Route Distance vs Operational Risk Trade-Off
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Grouped Bar</span>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s5RiskDistanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="route" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="DistanceKm" name="Distance (km)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="RiskScore" name="Risk Score (/100)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Environmental Exposure Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-sky-600" /> 3. Environmental Wave & Wind Exposure Score
                </div>
                <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">Exposure Chart</span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s5ExposureData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="route" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="WaveExposure" name="Wave Exposure (m)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="WindExposure" name="Wind Exposure Index" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Location Comparison Cards (for Scenario 1, 2, or custom location pairs) */}
        {scenario.customPayload?.locations && scenario.customPayload.locations.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location & Port Side-by-Side Comparison</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenario.customPayload.locations.map((loc: any, idx: number) => {
                const isSafe = loc.riskBand === 'SAFE';
                const isCaution = loc.riskBand === 'CAUTION';
                const isMapActive = activeMapPort && activeMapPort.name === loc.name;

                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{loc.name}</div>
                          <div className="text-[11px] text-slate-500">{loc.district ? `${loc.district}, ${loc.state}` : ''}</div>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isSafe ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : isCaution ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                          {loc.riskBand} ({loc.riskScore}/100)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Wave Height</span><span className="font-semibold text-slate-800">{loc.waveHeight}</span></div>
                        <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Wind Speed</span><span className="font-semibold text-slate-800">{loc.windSpeed}</span></div>
                        <div><span className="text-[9px] text-slate-400 font-bold block uppercase">SST</span><span className="font-semibold text-slate-800">{loc.sst}</span></div>
                        <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Weather</span><span className="font-semibold text-slate-800">{loc.weather}</span></div>
                      </div>

                      {loc.suitability && (
                        <div className="text-xs text-slate-600 bg-slate-50/70 p-2 rounded-lg border border-slate-100 leading-relaxed">
                          <strong className="text-slate-800">Fishing Suitability:</strong> {loc.suitability}
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs bg-slate-50 hover:bg-slate-100 transition-colors py-1.5 h-9 font-semibold"
                      onClick={() => setActiveMapPort(isMapActive ? null : { coords: loc.coords, name: loc.name })}
                    >
                      <MapIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {isMapActive ? "Hide Map" : `View ${loc.name.split(' ')[0]} on Map`}
                    </Button>
                  </div>
                );
              })}
            </div>

            {activeMapPort && (
              <div className="h-52 border border-slate-200 rounded-xl overflow-hidden relative mt-3 shadow-sm">
                <MapComponent
                  center={activeMapPort.coords}
                  zoom={12}
                  zones={[{ id: "map-active-loc", center: activeMapPort.coords, radius: 3000, type: "fishing", label: activeMapPort.name }]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
