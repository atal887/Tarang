import { cn } from "../../lib/utils";
import { demoData } from "../../data/demoData";

interface RiskScoreProps {
  score: number;
  className?: string;
}

export function RiskScore({ score, className }: RiskScoreProps) {
  let status = demoData.riskThresholds.low;
  if (score > demoData.riskThresholds.high.min) {
    status = demoData.riskThresholds.high;
  } else if (score > demoData.riskThresholds.moderate.min) {
    status = demoData.riskThresholds.moderate;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-semibold text-slate-900">Risk Score</span>
        <span className={cn("text-xs font-bold", {
          "text-status-safe": status.color === "safe",
          "text-status-caution": status.color === "caution",
          "text-status-danger": status.color === "danger",
        })}>
          {score}/100
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", {
            "bg-status-safe": status.color === "safe",
            "bg-status-caution": status.color === "caution",
            "bg-status-danger": status.color === "danger",
          })}
          style={{ width: `${Math.max(5, score)}%` }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{status.label}</span>
      </div>
    </div>
  );
}
