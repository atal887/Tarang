import { AlertTriangle, ShieldCheck, AlertCircle, Wind, Waves, Info } from 'lucide-react';
import type { DecisionResult } from '../../services/decisionEngine';
import type { ResolvedContext } from '../../services/contextResolver';

interface AlertUIProps {
  decision: DecisionResult | null;
  context: ResolvedContext | null;
  isSimulated: boolean;
}

export function AlertUI({ decision, context, isSimulated }: AlertUIProps) {
  if (!decision || !context) {
    return (
      <div className="p-4 m-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-sm text-slate-600 text-center flex flex-col items-center">
        <AlertTriangle className="w-8 h-8 text-slate-300 mb-2" />
        <p>Ask a question about a location to view its marine safety alerts.</p>
      </div>
    );
  }

  const { riskBand, reasons, marineRecommendations } = decision;
  const isSafe = riskBand === 'SAFE';
  const isCaution = riskBand === 'CAUTION';

  const bgColor = isSafe ? 'bg-emerald-50' : isCaution ? 'bg-amber-50' : 'bg-rose-50';
  const borderColor = isSafe ? 'border-emerald-200' : isCaution ? 'border-amber-200' : 'border-rose-200';
  const textColor = isSafe ? 'text-emerald-700' : isCaution ? 'text-amber-700' : 'text-rose-700';
  const Icon = isSafe ? ShieldCheck : isCaution ? AlertTriangle : AlertCircle;

  // Find the primary marine recommendation for details
  const primaryRec = marineRecommendations?.[0];
  const env = primaryRec?.productivityProfile;
  
  // Vessel limits
  const waveLimit = context.boatType === 'non_motorized' ? 0.5 : context.boatType === 'motorized' ? 1.4 : 2.0;
  const windLimit = context.boatType === 'non_motorized' ? 25 : context.boatType === 'motorized' ? 40 : 50;

  return (
    <div className={`m-4 border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row ${bgColor} ${borderColor}`}>
      {/* Status Panel */}
      <div className={`p-6 flex flex-col items-center justify-center border-r md:w-64 shrink-0 ${borderColor}`}>
        <Icon className={`w-12 h-12 mb-3 ${textColor}`} />
        <div className={`text-xl font-black uppercase tracking-wider text-center ${textColor}`}>
          {isSafe ? 'NO ACTIVE ALERT' : isCaution ? 'CAUTION' : 'DANGER'}
        </div>
        <div className={`text-xs font-bold mt-2 text-center opacity-80 ${textColor}`}>
          {context.locationName || 'Unknown Location'} • {context.dateTime.toLocaleDateString()}
        </div>
        
        {isSimulated && (
          <div className="mt-4 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full border border-indigo-200 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Scenario Alert
          </div>
        )}
      </div>
      
      {/* Details Panel */}
      <div className="p-4 flex-1 bg-white flex flex-col">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Current Conditions</h4>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 border border-slate-100 bg-slate-50 rounded-lg flex items-start gap-3">
            <Wind className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Wind Speed</div>
              <div className="text-lg font-bold text-slate-800">{env?.surfaceCurrentSpeedMs ? Math.round(env.surfaceCurrentSpeedMs * 3.6) : '--'} <span className="text-sm font-normal text-slate-500">km/h</span></div>
              <div className="text-[10px] text-slate-400 mt-1">Limit: {windLimit} km/h</div>
            </div>
          </div>
          
          <div className="p-3 border border-slate-100 bg-slate-50 rounded-lg flex items-start gap-3">
            <Waves className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Wave Height</div>
              <div className="text-lg font-bold text-slate-800">{primaryRec?.significantWaveHeightM?.toFixed(1) ?? '--'} <span className="text-sm font-normal text-slate-500">m</span></div>
              <div className="text-[10px] text-slate-400 mt-1">Limit: {waveLimit} m</div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <Info className="w-3 h-3" /> Active Warnings & Reasons
          </h4>
          <div className="space-y-1.5">
            {reasons.length > 0 ? reasons.map((r, i) => (
              <div key={i} className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>{r}</span>
              </div>
            )) : (
              <div className="text-sm text-slate-500 italic">No specific warnings at this time.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure we import Cpu since it was missed
import { Cpu } from 'lucide-react';
