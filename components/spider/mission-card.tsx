"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ThreatLevel } from "./threat-level"
import type { ThreatLevel as ThreatLevelType } from "./threat-level"

interface MissionCardProps {
  title: string
  status: "alert-received" | "swinging-into-action" | "city-saved" | "villain-interference" | "mission-aborted"
  threatLevel: ThreatLevelType
  villain?: string
  location?: string
  priority: "low" | "medium" | "high" | "critical"
  assignedHero?: string
  progress?: number
  className?: string
}

const statusConfig = {
  "alert-received": { label: "Alert Received", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  "swinging-into-action": { label: "Swinging Into Action", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  "city-saved": { label: "City Saved", color: "text-green-400", bgColor: "bg-green-500/10" },
  "villain-interference": { label: "Villain Interference", color: "text-red-400", bgColor: "bg-red-500/10" },
  "mission-aborted": { label: "Mission Aborted", color: "text-muted-foreground", bgColor: "bg-white/5" },
}

const priorityConfig = {
  low: "border-l-green-500",
  medium: "border-l-yellow-500",
  high: "border-l-red-500",
  critical: "border-l-[#E11D48]",
}

export function MissionCard({
  title,
  status,
  threatLevel,
  villain,
  location,
  priority,
  assignedHero,
  progress,
  className,
}: MissionCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={cn(
        "glass-panel rounded-xl p-4 border-l-4 overflow-hidden",
        priorityConfig[priority],
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{title}</h3>
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", statusInfo.color, statusInfo.bgColor)}>
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {location && <span>📍 {location}</span>}
            {villain && <span>🦹 {villain}</span>}
            {assignedHero && <span>🕷️ {assignedHero}</span>}
          </div>
        </div>
        <ThreatLevel level={threatLevel} showLabel={false} />
      </div>

      {progress !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="xp-bar-fill h-full rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
