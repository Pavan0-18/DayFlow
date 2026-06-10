"use client"

import { cn } from "@/lib/utils"
import { Priority } from "@/types"

interface PriorityIndicatorProps {
  priority: Priority
  className?: string
}

const priorityConfig = {
  HIGH: { color: "bg-red-500", label: "High" },
  MEDIUM: { color: "bg-amber-500", label: "Medium" },
  LOW: { color: "bg-green-500", label: "Low" },
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const config = priorityConfig[priority]
  
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("h-2 w-2 rounded-full", config.color)} />
      <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
    </div>
  )
}
