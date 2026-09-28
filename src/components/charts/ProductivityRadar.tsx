import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { ProductivityRadarChart } from '../../services/researchResponseFormatter';
import { Info } from 'lucide-react';

interface Props {
  data: ProductivityRadarChart['data'];
}

export function ProductivityRadar({ data }: Props) {
  // A custom tooltip that explains each factor
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      const factorExplanations: Record<string, string> = {
        'PFZ': 'Potential Fishing Zone probability derived from thermal boundaries.',
        'Chlorophyll': 'Phytoplankton concentration indicating primary food source.',
        'SST': 'Sea Surface Temperature suitability for target species.',
        'Current': 'Ocean surface current speed affecting gear and fish movement.',
        'MLD': 'Mixed Layer Depth indicating nutrient availability.',
        'D20': 'Depth of the 20°C isotherm indicating thermocline structure.'
      };

      return (
        <div className="bg-slate-900/95 text-slate-100 p-3 rounded-lg shadow-xl border border-slate-700/50 text-xs backdrop-blur-sm max-w-[200px]">
          <div className="font-bold text-sky-400 mb-1">{p.subject}</div>
          <div className="text-white text-lg font-bold mb-2">Score: {p.A} / 100</div>
          <div className="text-slate-300 leading-relaxed">{factorExplanations[p.subject] || ''}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="absolute top-0 right-0 p-2 text-slate-400 group cursor-help z-10">
        <Info className="w-4 h-4" />
        <div className="hidden group-hover:block absolute right-0 top-6 w-48 p-2 bg-slate-800 text-slate-200 text-xs rounded-md shadow-lg z-20">
          This radar chart shows the normalized (0-100) scores for the 6 environmental factors driving fishing productivity.
        </div>
      </div>
      <div className="h-64 w-full -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="#38bdf8"
              fillOpacity={0.35}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
