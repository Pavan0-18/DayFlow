"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const ALERTS = [
  {
    icon: "🕷️",
    title: "Spider Sense Triggered",
    description: "New threat detected in your area. Heightened awareness advised.",
  },
  {
    icon: "⚡",
    title: "Energy Spike Detected",
    description: "Abnormal energy readings near Midtown. Possible Electro sighting.",
  },
  {
    icon: "🚨",
    title: "Alert — Sector 4",
    description: "Suspicious activity detected. Patrol units advised to investigate.",
  },
  {
    icon: "🦹",
    title: "Symbiote Signature",
    description: "Venom activity fluctuating. Containment teams on standby.",
  },
  {
    icon: "📡",
    title: "Incoming Transmission",
    description: "Priority message from Daily Bugle. Check intelligence feed.",
  },
]

export function SpiderSenseOverlay() {
  const [isVisible, setIsVisible] = useState(false)
  const [alertIndex, setAlertIndex] = useState(0)
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPaused = useRef(false)

  const triggerAlert = useCallback(() => {
    setAlertIndex((prev) => (prev + 1) % ALERTS.length)
    setIsVisible(true)
    setTimeout(() => setIsVisible(false), 4000)
  }, [])

  const scheduleNext = useCallback(() => {
    if (isPaused.current) return
    const delay = 30000 + Math.random() * 30000 // 30-60 seconds
    nextTimerRef.current = setTimeout(() => {
      triggerAlert()
      scheduleNext()
    }, delay)
  }, [triggerAlert])

  useEffect(() => {
    // Pause/resume timers when tab visibility changes
    const onVisibilityChange = () => {
      if (document.hidden) {
        isPaused.current = true
        if (nextTimerRef.current) {
          clearTimeout(nextTimerRef.current)
          nextTimerRef.current = null
        }
      } else if (isPaused.current) {
        isPaused.current = false
        scheduleNext()
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    // First trigger after 5 seconds
    initialTimerRef.current = setTimeout(() => {
      triggerAlert()
      scheduleNext()
    }, 5000)

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current)
    }
  }, [triggerAlert, scheduleNext])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Full screen red pulse */}
          <motion.div
            key="overlay-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, times: [0, 0.05, 0.1] }}
            className="fixed inset-0 z-[100] pointer-events-none bg-red-500"
          />

          {/* Red border flash */}
          <motion.div
            key="overlay-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, times: [0, 0.05, 0.15] }}
            className="fixed inset-0 z-[100] pointer-events-none border-[6px] border-red-500/30"
          />

          {/* Alert card */}
          <motion.div
            key="overlay-alert"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-8 z-[101] -translate-x-1/2"
          >
            <div className="glass-panel-strong rounded-2xl border border-red-500/30 shadow-[0_0_60px_rgba(225,29,72,0.3)] px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Pulse radar icon */}
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-radar" />
                  <div className="absolute inset-1 rounded-full bg-red-500/10 animate-pulse-radar" style={{ animationDelay: "0.3s" }} />
                  <span className="relative text-lg">{ALERTS[alertIndex].icon}</span>
                </div>

                <div>
                  <p className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    {ALERTS[alertIndex].title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                    {ALERTS[alertIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
