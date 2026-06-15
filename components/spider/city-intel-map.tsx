"use client"

import { cn } from "@/lib/utils"

interface CityIntelMapProps {
  className?: string
  districts?: { name: string; threat: "low" | "medium" | "high" | "critical"; incidents: number }[]
}

const threatColors = {
  low: "bg-green-500/20 border-green-500/40",
  medium: "bg-yellow-500/20 border-yellow-500/40",
  high: "bg-red-500/20 border-red-500/40",
  critical: "bg-[#E11D48]/20 border-[#E11D48]/40",
}

export function CityIntelMap({ className, districts = [] }: CityIntelMapProps) {
  return (
    <div className={cn("glass-panel rounded-xl p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">City Intelligence</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Med
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" /> Crit
          </span>
        </div>
      </div>

      {/* Map Grid */}
      <div className="radar-grid relative aspect-[4/3] rounded-lg overflow-hidden border border-white/5">
        {/* Simplified NYC boroughs layout */}
        <div className="absolute inset-0 p-2 grid grid-cols-3 grid-rows-2 gap-2">
          {districts.slice(0, 6).map((district, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-2 flex flex-col items-center justify-center text-center transition-all duration-300",
                threatColors[district.threat],
                district.threat === "critical" && "animate-threat-pulse",
              )}
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {district.name}
              </span>
              <span className="text-lg font-bold">{district.incidents}</span>
              <span className="text-[8px] text-muted-foreground uppercase">incidents</span>
            </div>
          ))}
        </div>

        {/* Decorative scan line */}
        <div className="absolute inset-0 scan-line" />
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>🔄 Real-time intelligence feed</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
