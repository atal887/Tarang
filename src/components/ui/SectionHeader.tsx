import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, className, action }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between mb-4", className)}>
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
