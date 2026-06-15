"use client"

import { cn } from "@/lib/utils"

export type ThreatLevel = "low" | "medium" | "high" | "critical"

interface ThreatLevelProps {
  level: ThreatLevel
  showLabel?: boolean
  className?: string
}

const threatConfig: Record<ThreatLevel, { label: string; color: string; bars: number }> = {
  low: { label: "Low", color: "bg-green-500", bars: 1 },
  medium: { label: "Medium", color: "bg-yellow-500", bars: 2 },
  high: { label: "High", color: "bg-red-500", bars: 3 },
  critical: { label: "Critical", color: "bg-[#E11D48]", bars: 4 },
}

export function ThreatLevel({ level, showLabel = true, className }: ThreatLevelProps) {
  const config = threatConfig[level]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "h-4 w-1 rounded-sm transition-all duration-500",
              bar <= config.bars
                ? config.color
                : "bg-white/10",
              level === "critical" && bar <= config.bars && "animate-threat-pulse",
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            `threat-${level}`,
          )}
        >
          {config.label}
        </span>
      )}
    </div>
  )
}
