import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, ReferenceLine, Cell } from 'recharts';

interface CandidatePoint {
  facilityName: string;
  productivityScore: number;
  riskScore: number;
  distanceKm: number;
  riskBand: string;
}

interface Props {
  data: CandidatePoint[];
}

export function TradeOffScatter({ data }: Props) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900/95 p-3 rounded-lg shadow-xl border border-slate-700/50 text-xs text-slate-100 backdrop-blur-sm min-w-[150px]">
          <div className="font-bold text-sky-400 mb-2 border-b border-slate-700 pb-1">{p.facilityName}</div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400">Productivity:</span>
            <span className="font-bold text-white">{p.productivityScore}/100</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400">Risk:</span>
            <span className="font-bold text-white">{p.riskScore}/100</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400">Distance:</span>
            <span className="font-bold text-white">{p.distanceKm} km</span>
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
              p.riskBand === 'SAFE' ? 'bg-emerald-900/50 text-emerald-400' :
              p.riskBand === 'CAUTION' ? 'bg-amber-900/50 text-amber-400' :
              'bg-rose-900/50 text-rose-400'
            }`}>
              {p.riskBand}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full relative">
      <div className="absolute top-2 left-10 text-[10px] font-bold text-emerald-600 uppercase">← Safer</div>
      <div className="absolute top-2 right-4 text-[10px] font-bold text-rose-500 uppercase">Riskier →</div>
      <div className="absolute top-1/2 -left-3 -rotate-90 text-[10px] font-bold text-slate-400 uppercase tracking-widest origin-center">Productivity</div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            type="number" 
            dataKey="riskScore" 
            name="Risk Score" 
            domain={[0, 100]} 
            tick={{ fontSize: 11, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false}
            label={{ value: "Risk Score (0-100)", position: "insideBottom", offset: -10, fontSize: 11, fill: '#64748b' }}
          />
          <YAxis 
            type="number" 
            dataKey="productivityScore" 
            name="Productivity Score" 
            domain={[0, 100]} 
            tick={{ fontSize: 11, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false}
          />
          <ZAxis type="number" range={[100, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          <ReferenceLine x={40} stroke="#fcd34d" strokeDasharray="3 3" label={{ value: 'Caution', position: 'insideTopLeft', fill: '#d97706', fontSize: 10 }} />
          <ReferenceLine x={70} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Avoid', position: 'insideTopLeft', fill: '#e11d48', fontSize: 10 }} />
          <ReferenceLine y={70} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: 'High Prod.', position: 'insideTopRight', fill: '#0284c7', fontSize: 10 }} />

          <Scatter name="Zones" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.riskBand === 'SAFE' ? '#10b981' : entry.riskBand === 'CAUTION' ? '#f59e0b' : '#ef4444'} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
