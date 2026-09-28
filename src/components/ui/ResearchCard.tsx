import { useState } from 'react';
import { ProductivityRadar } from '../charts/ProductivityRadar';
import { ProductivityFactorBreakdown } from '../charts/ProductivityFactorBreakdown';
import { SafetyStressChart } from '../charts/SafetyStressChart';
import { TradeOffScatter } from '../charts/TradeOffScatter';
import { EnvironmentalProfile } from '../charts/EnvironmentalProfile';
import { TripVisualization } from '../charts/TripVisualization';
import type { ResearchResponse } from '../../services/researchResponseFormatter';
import { demoVisualizationDataset } from '../../data/demoVisualizationDataset';
import { ChevronDown, ChevronUp, AlertCircle, Info, ShieldAlert, Fish, Map, Lightbulb, Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';

interface Props {
  payload: ResearchResponse;
}

export function ResearchCard({ payload }: Props) {
  const [showMethodology, setShowMethodology] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderExpandButton = (modalId: string) => (
    <button
      onClick={() => setActiveModal(modalId)}
      className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
    >
      <Maximize2 className="w-3 h-3" /> Expand / View Full Analysis
    </button>
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl mt-3 text-left shadow-sm text-sm overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2">
          <ActivityIcon /> Research Analysis
        </h4>
        <div className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600">
          TARANG AI
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Executive Insight */}
        {payload.summary && (
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-ocean-500"></div>
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-ocean-500 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-700 leading-relaxed font-medium">
                {payload.summary.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Section Ordering based on Intent */}
        {(() => {
          const isSafetyFirst = ['SAFETY_TOMORROW', 'BOAT_SAFETY', 'SAFETY_ANALYSIS', 'WAVE_HEIGHT'].includes(payload.intent);
          
          const ProductivitySection = payload.productivityAnalysis ? (
            <section key="prod" className="space-y-3 mb-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Fish className="w-4 h-4 text-ocean-600" />
              <h5 className="font-bold text-slate-800 uppercase tracking-wide text-xs">Productivity deep-dive</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="text-center mb-2">
                  <div className="text-3xl font-black text-slate-800">{payload.productivityAnalysis.productivityScore}<span className="text-lg text-slate-400 font-bold">/100</span></div>
                  <div className="text-[10px] font-bold text-ocean-600 uppercase tracking-widest px-2 py-0.5 bg-ocean-50 rounded-full inline-block mt-1">
                    {payload.productivityAnalysis.productivityBand} POTENTIAL
                  </div>
                </div>
                {payload.charts?.map((c, i) => c.type === 'PRODUCTIVITY_RADAR' ? <ProductivityRadar key={i} data={c.data} /> : null)}
                {renderExpandButton('radar')}
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                <ProductivityFactorBreakdown data={[
                  { name: 'PFZ', score: payload.productivityAnalysis.factors.pfz.score, weight: 0.4, contribution: payload.productivityAnalysis.factors.pfz.score * 0.4 },
                  { name: 'Chlorophyll', score: payload.productivityAnalysis.factors.chlorophyll.score, weight: 0.3, contribution: payload.productivityAnalysis.factors.chlorophyll.score * 0.3 },
                  { name: 'SST', score: payload.productivityAnalysis.factors.sst.score, weight: 0.1, contribution: payload.productivityAnalysis.factors.sst.score * 0.1 },
                  { name: 'Current', score: payload.productivityAnalysis.factors.currentSpeed.score, weight: 0.1, contribution: payload.productivityAnalysis.factors.currentSpeed.score * 0.1 },
                  { name: 'MLD', score: payload.productivityAnalysis.factors.mixedLayer.score, weight: 0.05, contribution: payload.productivityAnalysis.factors.mixedLayer.score * 0.05 },
                  { name: 'D20', score: payload.productivityAnalysis.factors.d20Depth.score, weight: 0.05, contribution: payload.productivityAnalysis.factors.d20Depth.score * 0.05 },
                ]} />
                {renderExpandButton('breakdown')}
              </div>
            </div>
          </section>
          ) : null;

          const EnvSection = (payload.candidateComparison && payload.candidateComparison[0]?.environmentalProfile) ? (
            <section key="env" className="space-y-3 mb-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Map className="w-4 h-4 text-emerald-600" />
              <h5 className="font-bold text-slate-800 uppercase tracking-wide text-xs">Environmental Profile</h5>
            </div>
                <EnvironmentalProfile data={{
                  pfz: 85, // Illustrative
                  chlorophyll: 1.2,
                  sst: 28.5,
                  wind: payload.safetyAnalysis?.windSpeedKmph ?? 20,
                  waves: payload.safetyAnalysis?.significantWaveHeightM ?? 1.2,
                  current: 0.5,
                  mld: 45,
                  d20: 80
                }} />
                {renderExpandButton('env')}
            </section>
          ) : null;

          const SafetySection = payload.safetyAnalysis ? (
            <section key="safety" className="space-y-3 mb-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h5 className="font-bold text-slate-800 uppercase tracking-wide text-xs">Safety stress test</h5>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Overall Risk</div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-slate-800">{payload.safetyAnalysis.riskScore ?? 'N/A'}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                      payload.safetyAnalysis.riskBand === 'SAFE' ? 'bg-emerald-100 text-emerald-700' :
                      payload.safetyAnalysis.riskBand === 'CAUTION' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {payload.safetyAnalysis.riskBand}
                    </span>
                  </div>
                </div>
                
                {/* Demo trip toggle just to show the chart */}
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                  Vessel: <span className="font-bold text-slate-700 not-italic">{payload.safetyAnalysis.vesselType}</span>
                </div>
              </div>
              
              {payload.charts?.map((c, i) => c.type === 'SAFETY_STRESS' ? (
                <SafetyStressChart key={i} data={c.data} vesselType={payload.safetyAnalysis!.vesselType} />
              ) : null)}
              {renderExpandButton('safety')}
            </div>
          </section>
          ) : null;

          const CompareSection = (payload.candidateComparison && payload.candidateComparison.length > 0) ? (
            <section key="compare" className="space-y-3 mb-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-indigo-600" />
                <h5 className="font-bold text-slate-800 uppercase tracking-wide text-xs">Zone comparison trade-off</h5>
              </div>
              <div className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                DEMO DATASET
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <TradeOffScatter data={demoVisualizationDataset.tradeOffData} />
              {renderExpandButton('tradeoff')}
            </div>
          </section>
          ) : null;

          const TripSection = payload.safetyAnalysis ? (
            <section key="trip" className="space-y-3 mb-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <TripVisualization data={demoVisualizationDataset.tripData} />
              {renderExpandButton('trip')}
            </div>
          </section>
          ) : null;

          // Render in prioritized order
          if (isSafetyFirst) {
            return <>{SafetySection}{CompareSection}{TripSection}{ProductivitySection}{EnvSection}</>;
          }
          return <>{ProductivitySection}{EnvSection}{SafetySection}{CompareSection}{TripSection}</>;
        })()}

        {/* Methodology Accordion */}
        {payload.methodology && (
          <section className="mt-4">
            <button 
              onClick={() => setShowMethodology(!showMethodology)}
              className="flex items-center justify-between w-full p-3 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                Technical Methodology & Data Source
              </div>
              {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showMethodology && (
              <div className="p-4 bg-white border border-t-0 border-slate-200 rounded-b-lg -mt-1 text-xs text-slate-600 space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-800 flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Important Data Notice:</strong> The charts labeled as "DEMO DATASET" or "SIMULATED" use illustrative values designed to demonstrate the analytical capabilities of the platform. They are not derived from live satellite imagery or real-time buoy feeds. The deterministic engine uses a static, seasonal baseline dataset.
                  </p>
                </div>

                {payload.methodology.productivity && (
                  <div>
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2 block">Productivity Engine</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {payload.methodology.productivity.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                  </div>
                )}
                {payload.methodology.safety && (
                  <div>
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2 block mt-3">Safety Engine</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {payload.methodology.safety.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>

      {/* MODALS */}
      {payload.productivityAnalysis && (
        <>
          <ChartModal
            isOpen={activeModal === 'radar'}
            onClose={() => setActiveModal(null)}
            title="Productivity Radar Analysis"
            subtitle="Environmental Factor Normalization"
            explanation="This radar chart plots the 6 key environmental factors driving fishing productivity on a normalized 0–100 scale. A perfectly circular, large web indicates ideal conditions across all dimensions, while dips towards the center indicate limiting factors. Factors like PFZ Potential and Chlorophyll typically push the overall score higher when they expand outwards."
            methodology={payload.methodology?.productivity?.join(' ')}
          >
            {payload.charts?.map((c, i) => c.type === 'PRODUCTIVITY_RADAR' ? <div className="w-full max-w-lg mx-auto" key={i}><ProductivityRadar data={c.data} /></div> : null)}
          </ChartModal>

          <ChartModal
            isOpen={activeModal === 'breakdown'}
            onClose={() => setActiveModal(null)}
            title="Factor Contribution Breakdown"
            subtitle="Weighted Model Analysis"
            explanation="This chart breaks down exactly how the final productivity score is calculated. The model doesn't just average the scores; it weighs them based on their importance to marine life. PFZ Potential (40%) and Chlorophyll (30%) have a massive impact on the final score (blue bars), while secondary factors like D20 Depth only contribute 5% (light blue bars). The 'Final Contribution' is what actually gets added to your total score."
            methodology={payload.methodology?.productivity?.join(' ')}
          >
            <div className="w-full max-w-lg mx-auto">
              <ProductivityFactorBreakdown data={[
                { name: 'PFZ', score: payload.productivityAnalysis.factors.pfz.score, weight: 0.4, contribution: payload.productivityAnalysis.factors.pfz.score * 0.4 },
                { name: 'Chlorophyll', score: payload.productivityAnalysis.factors.chlorophyll.score, weight: 0.3, contribution: payload.productivityAnalysis.factors.chlorophyll.score * 0.3 },
                { name: 'SST', score: payload.productivityAnalysis.factors.sst.score, weight: 0.1, contribution: payload.productivityAnalysis.factors.sst.score * 0.1 },
                { name: 'Current', score: payload.productivityAnalysis.factors.currentSpeed.score, weight: 0.1, contribution: payload.productivityAnalysis.factors.currentSpeed.score * 0.1 },
                { name: 'MLD', score: payload.productivityAnalysis.factors.mixedLayer.score, weight: 0.05, contribution: payload.productivityAnalysis.factors.mixedLayer.score * 0.05 },
                { name: 'D20', score: payload.productivityAnalysis.factors.d20Depth.score, weight: 0.05, contribution: payload.productivityAnalysis.factors.d20Depth.score * 0.05 },
              ]} />
            </div>
          </ChartModal>
        </>
      )}

      {payload.safetyAnalysis && (
        <ChartModal
          isOpen={activeModal === 'safety'}
          onClose={() => setActiveModal(null)}
          title="Safety Stress Test"
          subtitle={`Vessel Profile: ${payload.safetyAnalysis.vesselType}`}
          explanation="This chart compares the actual environmental conditions (Wind and Waves) against the maximum safe operating limits for your specific vessel type. If an 'Actual Condition' bar exceeds the grey 'Vessel Limit' bar, the risk becomes elevated to CAUTION or AVOID. Hover over the bars to see exact thresholds."
          methodology={payload.methodology?.safety?.join(' ')}
        >
          {payload.charts?.map((c, i) => c.type === 'SAFETY_STRESS' ? (
            <div className="w-full max-w-lg mx-auto" key={i}><SafetyStressChart data={c.data} vesselType={payload.safetyAnalysis!.vesselType} /></div>
          ) : null)}
        </ChartModal>
      )}

      <ChartModal
        isOpen={activeModal === 'tradeoff'}
        onClose={() => setActiveModal(null)}
        title="Zone Comparison Trade-Off"
        subtitle="Safety vs Productivity"
        explanation="This scatter plot helps you find the 'Goldilocks' zone. You want a location that is high on the vertical axis (high productivity) but low on the horizontal axis (low risk). Locations in the green zone are ideal. Locations crossing into the yellow or red zones indicate severe safety trade-offs, regardless of how good the fishing is."
      >
        <div className="w-full max-w-2xl mx-auto min-h-[400px]">
          <TradeOffScatter data={demoVisualizationDataset.tradeOffData} />
        </div>
      </ChartModal>

      <ChartModal
        isOpen={activeModal === 'trip'}
        onClose={() => setActiveModal(null)}
        title="Multi-Day Trip Forecast"
        subtitle="Temporal Risk & Productivity"
        explanation="This visualization forecasts how conditions might evolve over a multi-day trip. The line shows the trend in fishing productivity, while the bars show the daily risk score. This allows you to plan the optimal days for your voyage, potentially avoiding days where risk spikes above the safe threshold."
      >
        <div className="w-full max-w-2xl mx-auto min-h-[400px]">
          <TripVisualization data={demoVisualizationDataset.tripData} />
        </div>
      </ChartModal>

      {payload.candidateComparison && payload.candidateComparison[0]?.environmentalProfile && (
        <ChartModal
          isOpen={activeModal === 'env'}
          onClose={() => setActiveModal(null)}
          title="Environmental Profile"
          subtitle="Specific Marine Parameters"
          explanation="This grid provides the exact environmental readings for the selected marine area. These are the raw variables (like SST in °C and Wind in km/h) before they are normalized or scored by the TARANG models. Reviewing these raw numbers can help experienced mariners make their own nuanced judgments alongside our automated recommendations."
        >
          <div className="w-full mx-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
            <EnvironmentalProfile data={{
              pfz: 85,
              chlorophyll: 1.2,
              sst: 28.5,
              wind: payload.safetyAnalysis?.windSpeedKmph ?? 20,
              waves: payload.safetyAnalysis?.significantWaveHeightM ?? 1.2,
              current: 0.5,
              mld: 45,
              d20: 80
            }} />
          </div>
        </ChartModal>
      )}

    </div>
  );
}

// Simple icon for header
function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ocean-400">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
