import { ProductivityRadar } from '../charts/ProductivityRadar';
import { SafetyStressChart } from '../charts/SafetyStressChart';
import { CandidateComparisonChart } from '../charts/CandidateComparisonChart';
import type { ResearchResponse } from '../../services/researchResponseFormatter';

interface Props {
  payload: ResearchResponse;
}

export function ResearchCard({ payload }: Props) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-4 text-left shadow-sm text-sm overflow-hidden w-full max-w-full">
      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2">
        Research Analysis
      </h4>
      
      {/* Productivity Section */}
      {payload.productivityAnalysis && (
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-500 uppercase">Productivity Analysis</span>
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-800">
                Score: {payload.productivityAnalysis.productivityScore}/100
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-ocean-100 text-ocean-700">
                {payload.productivityAnalysis.productivityBand}
              </span>
            </div>
            
            {payload.charts?.map((chart, idx) => {
              if (chart.type === 'PRODUCTIVITY_RADAR') {
                return <ProductivityRadar key={idx} data={chart.data} />;
              }
              return null;
            })}

            <p className="text-slate-600 mt-2">{payload.productivityAnalysis.insights}</p>
          </div>
        </div>
      )}

      {/* Safety Section */}
      {payload.safetyAnalysis && (
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-500 uppercase">Safety Analysis</span>
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-800">
                Risk Score: {payload.safetyAnalysis.riskScore ?? 'N/A'}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">
                {payload.safetyAnalysis.riskBand}
              </span>
            </div>
            
            {payload.charts?.map((chart, idx) => {
              if (chart.type === 'SAFETY_STRESS') {
                return <SafetyStressChart key={idx} data={chart.data} />;
              }
              return null;
            })}

            <p className="text-slate-600 mt-2">{payload.safetyAnalysis.reasons?.join(' ')}</p>
          </div>
        </div>
      )}

      {/* Candidate Comparison Section */}
      {payload.candidateComparison && payload.candidateComparison.length > 0 && (
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-500 uppercase">Candidate Comparison</span>
          <div className="space-y-2">
            {payload.charts?.map((chart, idx) => {
              if (chart.type === 'CANDIDATE_COMPARISON') {
                return (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100 mb-2">
                    <CandidateComparisonChart data={chart.data} />
                  </div>
                );
              }
              return null;
            })}

            {payload.candidateComparison.map((cand, idx) => (
              <div key={idx} className="bg-white p-2 flex justify-between items-center rounded-lg border border-slate-100">
                <span className="font-medium text-slate-800 truncate pr-2 max-w-[60%]">
                  {cand.facilityName} <span className="text-slate-400 font-normal">({cand.distanceKm} km)</span>
                </span>
                <div className="flex gap-2 shrink-0">
                  <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                    Prod: {cand.productivityScore ?? 'N/A'}
                  </span>
                  <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                    Risk: {cand.riskScore ?? 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodology Section */}
      {payload.methodology && (
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-500 uppercase">Methodology</span>
          <div className="bg-white p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-2">
            {payload.methodology.productivity && (
              <div>
                <span className="font-bold text-slate-700">Productivity:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  {payload.methodology.productivity.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
            {payload.methodology.safety && (
              <div>
                <span className="font-bold text-slate-700">Safety:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  {payload.methodology.safety.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
