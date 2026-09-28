import type { MarineCandidateResult } from './marineCandidateEvaluator';

export function formatComparisonResponse(candidates: MarineCandidateResult[], activeMode: string): string {
  if (candidates.length === 0) return "I couldn't find any zones to compare.";
  if (candidates.length === 1) return `I only have one zone to look at: **${candidates[0].facilityName}**. It has a risk band of **${candidates[0].riskBand}**.`;

  if (candidates.length === 2) {
    const [c1, c2] = candidates;
    const r1 = c1.riskScore ?? 0; const r2 = c2.riskScore ?? 0;
    const p1 = c1.productivityEvaluation?.productivityScore ?? 0; const p2 = c2.productivityEvaluation?.productivityScore ?? 0;
    
    let safetyDiff = "";
    if (Math.abs(r1 - r2) < 5) safetyDiff = "They have similar safety profiles.";
    else if (r1 < r2) safetyDiff = `**${c1.facilityName} is safer for your boat.** Its current risk score is ${r1} (${c1.riskBand}), compared with ${r2} (${c2.riskBand}) for ${c2.facilityName}.`;
    else safetyDiff = `**${c2.facilityName} is safer for your boat.** Its current risk score is ${r2} (${c2.riskBand}), compared with ${r1} (${c1.riskBand}) for ${c1.facilityName}.`;

    let prodDiff = "";
    if (Math.abs(p1 - p2) < 5) prodDiff = "Both zones have similar fishing potential.";
    else if (p1 > p2) prodDiff = `${c1.facilityName} has a higher fishing-potential score (${p1} vs ${p2}).`;
    else prodDiff = `${c2.facilityName} has a higher fishing-potential score (${p2} vs ${p1}).`;

    // Determine conclusion
    let conclusion = "";
    if (r1 <= r2 && p1 >= p2 && (r1 < r2 || p1 > p2)) {
      conclusion = `**${c1.facilityName} is the better overall choice.** It is safer and has better or equal productivity.`;
    } else if (r2 <= r1 && p2 >= p1 && (r2 < r1 || p2 > p1)) {
      conclusion = `**${c2.facilityName} is the better overall choice.** It is safer and has better or equal productivity.`;
    } else {
      conclusion = `**There isn't a single clear winner here.** One zone has better productivity, while the other has lower safety risk. The better choice depends on whether your priority is fishing potential or safer operating conditions.`;
    }

    if (activeMode === 'Research') {
      return `${conclusion}\n\n**Safety Analysis:**\n${safetyDiff}\n\n**Productivity Analysis:**\n${prodDiff}\n\n*Note: This analysis is based on the currently available TARANG dataset.*`;
    } else {
      return `${conclusion}\n\n${safetyDiff} ${prodDiff}`;
    }
  }

  // 3-way or more
  let text = "**Quick comparison:**\n\n";
  let minRisk = 100; let maxProd = 0;
  let safest = ""; let mostProd = "";
  
  candidates.forEach((c) => {
    const r = c.riskScore ?? 0;
    const p = c.productivityEvaluation?.productivityScore ?? 0;
    
    let line = `* **${c.facilityName}:** `;
    if (r <= 40) line += `Safe operating conditions`;
    else if (r <= 70) line += `Caution advised`;
    else line += `Dangerous conditions`;
    
    line += ` with a fishing potential of ${p}/100.\n`;
    text += line;

    if (r < minRisk) { minRisk = r; safest = c.facilityName; }
    if (p > maxProd) { maxProd = p; mostProd = c.facilityName; }
  });

  text += `\n**Conclusion:** **${mostProd}** offers the strongest fishing potential, while **${safest}** provides the safest operating conditions.`;
  
  if (activeMode === 'Research') {
    text += `\n\n*Note: This analysis is based on the currently available TARANG dataset.*`;
  }
  return text;
}
