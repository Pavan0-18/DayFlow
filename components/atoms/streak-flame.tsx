"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StreakFlameProps {
  streak: number
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
}

export function StreakFlame({ streak, className, size = "md" }: StreakFlameProps) {
  const isActive = streak > 0

  return (
    <motion.div
      className={cn("inline-flex items-center gap-1", className)}
      animate={isActive ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span
        className={cn(
          sizeConfig[size],
          isActive ? "text-orange-500" : "text-slate-300"
        )}
      >
        🔥
      </span>
      {streak > 0 && (
        <span className={cn("font-bold", sizeConfig[size], "text-orange-500")}>
          {streak}
        </span>
      )}
    </motion.div>
  )
}
