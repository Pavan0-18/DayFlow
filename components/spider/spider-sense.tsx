"use client"

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface SpiderSenseProps {
  active?: boolean
  notifications?: { id: string; message: string; type: "alert" | "info" | "danger" }[]
  className?: string
}

export function SpiderSense({
  active: externalActive,
  notifications = [],
  className,
}: SpiderSenseProps) {
  const [isActive, setIsActive] = useState(externalActive || false)
  const [currentAlert, setCurrentAlert] = useState<number>(0)

  useEffect(() => {
    if (externalActive !== undefined) {
      setIsActive(externalActive)
    }
  }, [externalActive])

  useEffect(() => {
    if (notifications.length === 0) return
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % notifications.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [notifications.length])

  const typeColors = {
    alert: "border-yellow-500/50 shadow-yellow-500/20",
    info: "border-cyan-500/50 shadow-cyan-500/20",
    danger: "border-red-500/50 shadow-red-500/30",
  }

  return (
    <div className={cn("relative", className)}>
      {/* Radar Dome */}
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "h-24 w-24 rounded-full border-2 transition-all duration-500",
            isActive
              ? "border-red-500/50 shadow-[0_0_30px_rgba(225,29,72,0.3)]"
              : "border-white/10",
          )}
        >
          <div className="absolute inset-2 rounded-full border border-white/5" />
          <div className="absolute inset-4 rounded-full border border-white/5" />
          <div className="absolute inset-6 rounded-full border border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5" />
        </div>

        {/* Pulse Rings */}
        {isActive && (
          <>
            <div className="absolute h-24 w-24 rounded-full border-2 border-red-500/30 animate-pulse-radar" />
            <div className="absolute h-32 w-32 rounded-full border border-red-500/20 animate-pulse-radar" style={{ animationDelay: "0.5s" }} />
            <div className="absolute h-40 w-40 rounded-full border border-red-500/10 animate-pulse-radar" style={{ animationDelay: "1s" }} />
          </>
        )}

        {/* Center Icon */}
        <div
          className={cn(
            "absolute flex items-center justify-center transition-all duration-300",
            isActive && "animate-spider-sense",
          )}
        >
          {isActive ? (
            <span className="text-2xl">🕷️</span>
          ) : (
            <span className="text-2xl opacity-50">🕸️</span>
          )}
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence mode="wait">
        {notifications.length > 0 && (
          <motion.div
            key={notifications[currentAlert]?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "mt-3 rounded-lg border p-2 text-center",
              typeColors[notifications[currentAlert]?.type || "info"],
              "glass-panel",
            )}
          >
            <p className="text-xs font-medium">{notifications[currentAlert]?.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
