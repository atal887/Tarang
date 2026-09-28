import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import type { SafetyStressChart as SafetyStressChartType } from '../../services/researchResponseFormatter';

interface Props {
  data: SafetyStressChartType['data'];
  vesselType?: string;
}

export function SafetyStressChart({ data, vesselType }: Props) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload.find((p: any) => p.dataKey === 'actual')?.value;
      const limit = payload.find((p: any) => p.dataKey === 'limit')?.value;
      const isExceeded = actual > limit;
      
      return (
        <div className="bg-slate-900/95 p-3 rounded-lg shadow-xl border border-slate-700/50 text-xs text-slate-100 backdrop-blur-sm">
          <div className="font-bold text-slate-100 mb-2">{label}</div>
          <div className="flex justify-between items-center gap-4 mb-1">
            <span className="text-slate-400">Actual:</span>
            <span className={`font-bold ${isExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>{actual}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Vessel Limit:</span>
            <span className="font-bold text-slate-300">{limit}</span>
          </div>
          {isExceeded && (
            <div className="mt-2 text-[10px] text-rose-300 font-medium bg-rose-950/50 px-2 py-1 rounded">
              ⚠️ Exceeds safe operating limit
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-56 w-full mt-2 relative">
      <div className="absolute top-0 right-0 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase z-10 border border-slate-200">
        Vessel: {vesselType || 'Unknown'}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 5 }} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
          
          <Bar dataKey="actual" name="Actual Condition" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.actual > entry.limit ? '#f43f5e' : '#10b981'} />
            ))}
          </Bar>
          <Bar dataKey="limit" name="Vessel Limit" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
