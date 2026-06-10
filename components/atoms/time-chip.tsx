"use client"

import { cn } from "@/lib/utils"
import { formatTime } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeChipProps {
  time: string
  className?: string
  showIcon?: boolean
}

export function TimeChip({ time, className, showIcon = true }: TimeChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        className
      )}
    >
      {showIcon && <Clock className="h-3 w-3" />}
      {formatTime(time)}
    </span>
  )
}
