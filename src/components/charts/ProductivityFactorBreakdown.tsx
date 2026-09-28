import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FactorData {
  name: string;
  score: number;
  weight: number;
  contribution: number;
}

interface Props {
  data: FactorData[];
}

export function ProductivityFactorBreakdown({ data }: Props) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs text-slate-700">
          <div className="font-bold text-slate-900 mb-1">{p.name}</div>
          <div><span className="font-semibold text-slate-500">Normalized Score:</span> {p.score}/100</div>
          <div><span className="font-semibold text-slate-500">Model Weight:</span> {p.weight * 100}%</div>
          <div className="mt-1 pt-1 border-t border-slate-100">
            <span className="font-bold text-ocean-600">Final Contribution:</span> <span className="font-bold">{p.contribution.toFixed(1)}</span> pts
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <div className="text-xs text-slate-500 mb-2 font-medium">Factor Contribution to Final Score (Pts)</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 45]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.weight >= 0.3 ? '#0ea5e9' : '#93c5fd'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-4">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#0ea5e9]"></div> High Weight (≥30%)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#93c5fd]"></div> Low Weight (≤10%)</div>
      </div>
    </div>
  );
}
