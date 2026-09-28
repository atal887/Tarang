import { Droplets, Wind, Waves, Thermometer, Anchor, Activity, TrendingUp } from 'lucide-react';

interface EnvData {
  pfz: number;
  chlorophyll: number;
  sst: number;
  wind: number;
  waves: number;
  current: number;
  mld: number;
  d20: number;
}

interface Props {
  data: EnvData;
}

export function EnvironmentalProfile({ data }: Props) {
  const metrics = [
    { label: 'SST', value: data.sst, unit: '°C', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Chlorophyll', value: data.chlorophyll, unit: 'mg/m³', icon: Droplets, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Wind', value: data.wind, unit: 'km/h', icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Waves', value: data.waves, unit: 'm', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Current', value: data.current, unit: 'm/s', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'MLD', value: data.mld, unit: 'm', icon: Anchor, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'D20', value: data.d20, unit: 'm', icon: TrendingUp, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
      {metrics.map((m, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
          <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
            <m.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</div>
            <div className="text-sm font-bold text-slate-700">
              {m.value} <span className="text-[10px] font-medium text-slate-400">{m.unit}</span>
            </div>
          </div>
        </div>
      ))}
      {/* PFZ Potential separately since it's a probability */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-ocean-50 to-sky-50 border border-ocean-100 rounded-lg shadow-sm">
        <div className="p-2 rounded-lg bg-ocean-500 text-white shadow-sm">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-ocean-700 uppercase tracking-wider">PFZ Potential</div>
          <div className="text-sm font-bold text-ocean-900">
            {data.pfz}% <span className="text-[10px] font-medium text-ocean-600/70">Prob.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
