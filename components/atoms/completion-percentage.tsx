"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { getCompletionColor } from "@/lib/utils"

interface CompletionPercentageProps {
  percentage: number
  className?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const sizeConfig = {
  sm: "text-lg",
  md: "text-3xl",
  lg: "text-5xl",
}

export function CompletionPercentage({
  percentage,
  className,
  size = "md",
  showLabel = true,
}: CompletionPercentageProps) {
  const color = getCompletionColor(percentage)

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <motion.span
        className={cn("font-bold", sizeConfig[size])}
        style={{ color }}
        key={percentage}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {percentage}%
      </motion.span>
      {showLabel && (
        <span className="text-sm text-muted-foreground">complete</span>
      )}
    </div>
  )
}
