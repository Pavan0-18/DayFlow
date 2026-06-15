"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  variant?: "default" | "spider"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "spider",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl p-8 text-center",
        variant === "spider"
          ? "border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-sm"
          : "border border-dashed bg-muted/30",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-full",
          variant === "spider"
            ? "bg-gradient-to-br from-[#E11D48]/20 to-[#1D4ED8]/20"
            : "bg-muted"
        )}
      >
        <Icon className={cn(
          "h-6 w-6",
          variant === "spider" ? "text-[#E11D48]" : "text-muted-foreground"
        )} />
      </motion.div>
      <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
      <p className="mb-4 max-w-xs text-xs text-muted-foreground">{description}</p>
      {action && (
        <Button
          size="sm"
          onClick={action.onClick}
          className="bg-gradient-to-r from-[#E11D48] to-[#1D4ED8] hover:from-[#E11D48]/90 hover:to-[#1D4ED8]/90 text-white shadow-lg"
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
