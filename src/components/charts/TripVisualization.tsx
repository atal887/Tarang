import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface TripDay {
  day: number;
  label: string;
  productivity: number;
  risk: number;
  wind: number;
  wave: number;
}

interface Props {
  data: TripDay[];
}

export function TripVisualization({ data }: Props) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900/95 p-3 rounded-lg shadow-xl border border-slate-700/50 text-xs text-slate-100 backdrop-blur-sm min-w-[160px]">
          <div className="font-bold text-sky-400 mb-2 border-b border-slate-700 pb-1">{p.label}</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wide">Risk</div>
              <div className={`font-bold ${p.risk > 70 ? 'text-rose-400' : p.risk > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.risk}/100</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wide">Productivity</div>
              <div className="font-bold text-ocean-400">{p.productivity}/100</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wide">Wind</div>
              <div className="font-bold text-slate-300">{p.wind} km/h</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wide">Wave</div>
              <div className="font-bold text-slate-300">{p.wave} m</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full relative">
      <div className="absolute top-0 right-0 bg-amber-100 px-2 py-1 rounded text-[9px] font-bold text-amber-700 uppercase z-10 border border-amber-200 shadow-sm flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Demonstration Dataset — Illustrative Values
      </div>
      <div className="text-xs text-slate-500 font-medium mb-2 pl-2">Multi-day Trip Forecast (Simulated)</div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
          
          <Bar yAxisId="left" dataKey="risk" name="Risk Score" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.risk > 70 ? '#f43f5e' : entry.risk > 40 ? '#f59e0b' : '#10b981'} fillOpacity={0.8} />
            ))}
          </Bar>
          <Line yAxisId="left" type="monotone" dataKey="productivity" name="Productivity" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
