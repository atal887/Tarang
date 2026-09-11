import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "safe" | "caution" | "danger" | "location";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        {
          "border-transparent bg-slate-100 text-slate-800": variant === "default",
          "border-transparent bg-status-safeBg text-status-safeText": variant === "safe",
          "border-transparent bg-status-cautionBg text-status-cautionText": variant === "caution",
          "border-transparent bg-status-dangerBg text-status-dangerText": variant === "danger",
          "border-ocean-200 bg-ocean-50 text-ocean-700": variant === "location",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
