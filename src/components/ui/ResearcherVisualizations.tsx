import React, { useState } from 'react';
import type { DemoResearcherScenario } from '../../data/demoResearcherDataset';
import { FormattedMessage } from './FormattedMessage';
import { MapComponent } from '../map/MapComponent';
import { MapIcon, BarChart2, TrendingUp, ScatterChart as ScatterIcon, Navigation } from 'lucide-react';
import { Button } from './Button';

interface Props {
  scenario: DemoResearcherScenario;
}

export const ResearcherVisualizations: React.FC<Props> = ({ scenario }) => {
  const [activeMapPort, setActiveMapPort] = useState<{ coords: [number, number]; name: string } | null>(null);
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<'all' | 'wave' | 'wind' | 'sst'>('all');
  const [activeRouteIndex, setActiveRouteIndex] = useState<number | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm space-y-6 text-left my-3 w-full">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900 leading-snug flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-ocean-600 shrink-0" />
          {scenario.title}
        </h3>
        <div className="text-xs text-slate-500 mt-1">TARANG Researcher Mode Analysis</div>
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

      {/* Interactive Visualizations */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interactive Visualization</div>

        {/* 1. Side-by-Side Comparison Chart */}
        {scenario.visualizationType === 'SIDE_BY_SIDE' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 mb-2">{scenario.title}</div>
            {[
              { label: 'Wave Height (m)', val1: 1.8, val2: 1.2, max: 2.5, unit: 'm' },
              { label: 'Wind Speed (km/h)', val1: 19, val2: 14, max: 25, unit: 'km/h' },
              { label: 'SST (°C)', val1: 28.4, val2: 29.1, max: 35, unit: '°C' },
              { label: 'Chlorophyll (mg/m³)', val1: 0.72, val2: 0.48, max: 1.0, unit: 'mg/m³' },
              { label: 'Risk Score (/100)', val1: 48, val2: 28, max: 100, unit: '' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>{item.label}</span>
                  <span><span className="text-slate-900 font-bold">Mumbai: {item.val1}</span> vs <span className="text-ocean-700 font-bold">Kochi: {item.val2}</span></span>
                </div>
                <div className="grid grid-cols-2 gap-2 h-4">
                  <div className="bg-slate-200 rounded-full overflow-hidden h-full flex justify-end">
                    <div className="bg-slate-700 h-full rounded-full transition-all duration-500" style={{ width: `${(item.val1 / item.max) * 100}%` }}></div>
                  </div>
                  <div className="bg-slate-200 rounded-full overflow-hidden h-full">
                    <div className="bg-ocean-600 h-full rounded-full transition-all duration-500" style={{ width: `${(item.val2 / item.max) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-6 pt-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-700 rounded-sm"></span> Mumbai</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ocean-600 rounded-sm"></span> Kochi</span>
            </div>
          </div>
        )}

        {/* Location Comparison Cards with View on Map for Both Locations */}
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

        {/* 2. Grouped Bar Chart & Map for Ports */}
        {scenario.visualizationType === 'GROUPED_BAR' && (
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700">Port Conditions Comparison</div>
            {[
              { label: 'Wave Height', bhaucha: 1.2, sassoon: 1.5, max: 2.0, unit: 'm' },
              { label: 'Wind Speed', bhaucha: 14, sassoon: 17, max: 25, unit: 'km/h' },
              { label: 'Risk Score', bhaucha: 26, sassoon: 38, max: 100, unit: '' },
            ].map((metric, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{metric.label}</span>
                  <span className="text-[11px] text-slate-500">Bhaucha: {metric.bhaucha}{metric.unit} | Sassoon: {metric.sassoon}{metric.unit}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-ocean-500 h-full transition-all duration-500" style={{ width: `${(metric.bhaucha / metric.max) * 100}%` }}></div>
                  </div>
                  <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${(metric.sassoon / metric.max) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-6 pt-1 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ocean-500 rounded-sm"></span> Bhaucha Dhakka</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-600 rounded-sm"></span> Sassoon Dock</span>
            </div>

            {/* Map Interactions */}
            <div className="border-t border-slate-200 pt-3">
              <div className="text-xs font-bold text-slate-700 mb-2">View Ports on Map</div>
              <div className="flex flex-col sm:flex-row gap-2">
                {scenario.customPayload?.ports?.map((p: any, idx: number) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs bg-white hover:bg-slate-100"
                    onClick={() => setActiveMapPort(activeMapPort?.name === p.name ? null : { coords: p.coords, name: p.name })}
                  >
                    <MapIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    {activeMapPort?.name === p.name ? `Hide ${p.name}` : `View ${p.name}`}
                  </Button>
                ))}
              </div>
              {activeMapPort && (
                <div className="h-48 border border-slate-200 rounded-lg overflow-hidden relative mt-3">
                  <MapComponent
                    center={activeMapPort.coords}
                    zoom={13}
                    zones={[{ id: "port-z", center: activeMapPort.coords, radius: 2000, type: "safe", label: activeMapPort.name }]}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. 3-Day Trend Line Chart */}
        {scenario.visualizationType === 'TREND_LINE' && (
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-ocean-600" /> 3-Day Trend Analysis
              </div>
              <div className="flex gap-1">
                {(['all', 'wave', 'wind', 'sst'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTrendMetric(tab)}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${selectedTrendMetric === tab ? 'bg-ocean-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Bars */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {scenario.tableData.map((d, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">{d.day}</div>
                  <div className="space-y-1.5 text-xs">
                    {(selectedTrendMetric === 'all' || selectedTrendMetric === 'wave') && (
                      <div className="bg-sky-50 p-1 rounded text-sky-900 font-bold">🌊 {d.waveText}</div>
                    )}
                    {(selectedTrendMetric === 'all' || selectedTrendMetric === 'wind') && (
                      <div className="bg-amber-50 p-1 rounded text-amber-900 font-bold">💨 {d.windText}</div>
                    )}
                    {(selectedTrendMetric === 'all' || selectedTrendMetric === 'sst') && (
                      <div className="bg-rose-50 p-1 rounded text-rose-900 font-bold">🌡️ {d.sstText}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Bubble / Scatter Chart */}
        {scenario.visualizationType === 'BUBBLE_SCATTER' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ScatterIcon className="w-4 h-4 text-ocean-600" /> Productivity vs Risk Scatter Analysis
            </div>
            <p className="text-[11px] text-slate-500">X = Chlorophyll (mg/m³) &bull; Y = Risk Score (/100) &bull; Size = SST (°C)</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {scenario.tableData.map((item, idx) => {
                const bubbleColor = item.risk < 30 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : item.risk < 40 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-rose-50 border-rose-300 text-rose-900';
                return (
                  <div key={idx} className={`p-3.5 rounded-xl border ${bubbleColor} shadow-sm space-y-1.5 flex flex-col justify-between`}>
                    <div className="font-bold text-xs border-b border-slate-200/60 pb-1">{item.area}</div>
                    <div className="text-[11px] space-y-1">
                      <div><span className="text-slate-500">Chlorophyll:</span> <strong>{item.chloText}</strong></div>
                      <div><span className="text-slate-500">Risk Score:</span> <strong>{item.risk}/100</strong></div>
                      <div><span className="text-slate-500">SST:</span> <strong>{item.sstText}</strong></div>
                      <div><span className="text-slate-500">Wave Exp:</span> <strong>{item.waveText}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Route Map & Route Comparison */}
        {scenario.visualizationType === 'ROUTE_MAP_COMPARISON' && (
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-ocean-600" /> Route Environmental Exposure Map
            </div>

            {/* Interactive Route Buttons */}
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

            {/* Map Container */}
            <div className="h-64 border border-slate-200 rounded-xl overflow-hidden relative bg-white">
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
        )}
      </div>
    </div>
  );
};
