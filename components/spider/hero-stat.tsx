"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface HeroStatProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  pulse?: boolean
}

export function HeroStat({
  label,
  value,
  icon,
  trend,
  trendValue,
  className,
  pulse,
}: HeroStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-panel rounded-xl p-4 relative overflow-hidden",
        pulse && "spider-sense-active",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-green-400",
                  trend === "down" && "text-red-400",
                  trend === "neutral" && "text-yellow-400",
                )}
              >
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {trend === "neutral" && "→"}
                {trendValue}
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        )}
      </div>
    </motion.div>
  )
}
