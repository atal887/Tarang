import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CandidateComparisonChart as CandidateComparisonChartType } from '../../services/researchResponseFormatter';

interface Props {
  data: CandidateComparisonChartType['data'];
}

export function CandidateComparisonChart({ data }: Props) {
  // Truncate long names for the X-axis
  const formattedData = data.map(d => ({
    ...d,
    shortName: d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name
  }));

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            wrapperStyle={{ zIndex: 1000 }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            labelFormatter={(label, payload) => payload.length > 0 ? payload[0].payload.name : label}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="productivityScore" name="Productivity" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="riskScore" name="Risk (Lower is better)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
