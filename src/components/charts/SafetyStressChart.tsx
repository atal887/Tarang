import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SafetyStressChart as SafetyStressChartType } from '../../services/researchResponseFormatter';

interface Props {
  data: SafetyStressChartType['data'];
}

export function SafetyStressChart({ data }: Props) {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            wrapperStyle={{ zIndex: 1000 }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="actual" name="Actual Condition" fill="#0284c7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="limit" name="Vessel Limit" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
