"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Lightbulb, Flame, AlertTriangle, Target } from "lucide-react"
import { AIInsight } from "@/types"

interface InsightCardProps {
  insight: AIInsight
  index: number
  className?: string
}

const typeConfig = {
  performance: {
    icon: Lightbulb,
    gradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
  },
  streak: {
    icon: Flame,
    gradient: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-500",
  },
  risk: {
    icon: AlertTriangle,
    gradient: "from-amber-500/10 to-yellow-500/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-500",
  },
  recommendation: {
    icon: Target,
    gradient: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-500",
  },
}

export function InsightCard({ insight, index, className }: InsightCardProps) {
  const config = typeConfig[insight.type]
  const Icon = config.icon

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4",
        config.gradient,
        config.borderColor,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("rounded-xl bg-background/80 p-2", config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{insight.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{insight.insight}</p>
        </div>
      </div>
    </motion.div>
  )
}
