"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Lock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AchievementBadgeProps {
  emoji: string
  name: string
  description: string
  unlockedAt: Date | null
  progress: number
  target: number
  className?: string
}

export function AchievementBadge({
  emoji,
  name,
  description,
  unlockedAt,
  progress,
  target,
  className,
}: AchievementBadgeProps) {
  const isUnlocked = !!unlockedAt
  const progressPercentage = Math.min((progress / target) * 100, 100)

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center rounded-2xl border bg-card p-4 text-center transition-all",
        isUnlocked && "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20",
        className
      )}
      initial={isUnlocked ? { scale: 0.8, opacity: 0 } : false}
      animate={isUnlocked ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Lock overlay for locked achievements */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-[1px]">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Emoji */}
      <motion.span
        className={cn(
          "text-4xl",
          !isUnlocked && "grayscale"
        )}
        animate={isUnlocked ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
      >
        {emoji}
      </motion.span>

      {/* Name */}
      <h4 className={cn(
        "mt-2 font-semibold",
        !isUnlocked && "text-muted-foreground"
      )}>
        {name}
      </h4>

      {/* Description */}
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>

      {/* Progress bar for locked achievements */}
      {!isUnlocked && (
        <div className="mt-3 w-full">
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">
            {progress}/{target}
          </p>
        </div>
      )}

      {/* Unlock date for unlocked achievements */}
      {isUnlocked && unlockedAt && (
        <p className="mt-2 text-xs text-green-600 dark:text-green-400">
          Unlocked {new Date(unlockedAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  )
}
