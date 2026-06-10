"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { CategoryBadge } from "@/components/atoms/category-badge"
import { TimeChip } from "@/components/atoms/time-chip"
import { PriorityIndicator } from "@/components/atoms/priority-indicator"
import { Priority } from "@/types"
import { Check } from "lucide-react"

interface TaskCardProps {
  id: string
  title: string
  color: string
  icon: string
  category: string
  completed: boolean
  scheduledTime?: string
  priority?: Priority
  onToggle: (completed: boolean) => void
  className?: string
}

export function TaskCard({
  title,
  color,
  icon,
  category,
  completed,
  scheduledTime,
  priority,
  onToggle,
  className,
}: TaskCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-colors",
        completed && "border-green-200/60 bg-green-50/80 dark:border-green-900/40 dark:bg-green-950/30",
        className
      )}
      whileHover={{ scale: 1.01, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      whileTap={{ scale: 0.99 }}
      layout
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: color }}
        animate={{ width: completed ? 4 : 4, opacity: completed ? 1 : 0.7 }}
      />

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/10"
          />
        )}
      </AnimatePresence>

      <motion.div whileTap={{ scale: 0.85 }} className="relative z-10">
        <Checkbox
          checked={completed}
          onCheckedChange={(checked) => onToggle(checked === true)}
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-all duration-300",
            completed && "border-green-500 bg-green-500 text-white scale-110"
          )}
        />
      </motion.div>

      <motion.span
        className="relative z-10 text-2xl"
        animate={{ scale: completed ? 1.1 : 1, rotate: completed ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        {icon}
      </motion.span>

      <div className="relative z-10 flex flex-1 flex-col gap-1">
        <motion.span
          className={cn("font-medium transition-all duration-300", completed && "text-muted-foreground line-through")}
          animate={{ x: completed ? 4 : 0 }}
        >
          {title}
        </motion.span>
        <div className="flex items-center gap-2">
          <CategoryBadge category={category} />
          {scheduledTime && <TimeChip time={scheduledTime} />}
          {priority && <PriorityIndicator priority={priority} />}
        </div>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400"
          >
            <Check className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
