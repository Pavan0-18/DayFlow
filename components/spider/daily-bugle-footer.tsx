"use client"

import { cn } from "@/lib/utils"
import { GlassPanel } from "./glass-panel"
import { Shield, Radio, Clock, LayoutDashboard, BarChart3, Trophy } from "lucide-react"

interface DailyBugleFooterProps {
  className?: string
}

export function DailyBugleFooter({ className }: DailyBugleFooterProps) {
  const now = new Date()
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <footer className={cn("relative overflow-hidden border-t border-white/5 bg-[#020617]", className)}>
      {/* Decorative web pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" viewBox="0 0 1440 300">
          {[0, 1, 2].map((row) => (
            <g key={row}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                <circle
                  key={col}
                  cx={col * 200 + 100}
                  cy={row * 100 + 50}
                  r={60}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.3"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        {/* Top: Daily Bugle Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-5 py-2">
            <Radio className="h-3 w-3 text-red-400" />
            <span className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
              DayFlow Network
            </span>
          </div>
        </div>

        {/* Feature Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassPanel variant="strong" className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span className="uppercase tracking-wider">Live Dashboard</span>
            </div>
            <p className="text-lg font-bold text-white">{timeString}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </GlassPanel>

          <GlassPanel variant="strong" className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
              <LayoutDashboard className="h-3 w-3" />
              <span className="uppercase tracking-wider">Task Management</span>
            </div>
            <p className="text-lg font-bold text-green-400">Real-time</p>
            <p className="text-[10px] text-muted-foreground mt-1">Create, organize, complete</p>
          </GlassPanel>

          <GlassPanel variant="strong" className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
              <BarChart3 className="h-3 w-3" />
              <span className="uppercase tracking-wider">Analytics</span>
            </div>
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-lg font-bold text-green-400">Live</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Daily, weekly, monthly reports</p>
          </GlassPanel>

          <GlassPanel variant="strong" className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
              <Trophy className="h-3 w-3" />
              <span className="uppercase tracking-wider">Achievements</span>
            </div>
            <p className="text-lg font-bold text-cyan-400">Auto-tracked</p>
            <p className="text-[10px] text-muted-foreground mt-1">Unlock based on your data</p>
          </GlassPanel>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-slate-700 flex items-center justify-center gap-2">
            <span>© {now.getFullYear()} DayFlow</span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-700" />
            <span>All data sourced from your actual activity</span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-700" />
            <span className="text-slate-600">No fabricated stats — ever</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
