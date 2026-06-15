"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { SpiderLoader } from "./spider-loader"

interface SpiderVerseLoaderProps {
  onComplete: () => void
  minDuration?: number
}

const LOADING_MESSAGES = [
  "INITIALIZING SPIDER-VERSE PROTOCOL...",
  "ESTABLISHING SECURE CONNECTION...",
  "AUTHENTICATING HERO IDENTITY...",
  "CALIBRATING SPIDER SENSE...",
  "SYNCING CITY INTELLIGENCE...",
  "LOADING SUIT DATABASE...",
  "CONNECTING TO DAILY BUGLE NETWORK...",
  "SCANNING FOR THREATS...",
  "DEPLOYING WEB SHOOTERS...",
  "ACTIVATING HOLOGRAPHIC DISPLAY...",
]

export function SpiderVerseLoader({
  onComplete,
  minDuration = 3000,
}: SpiderVerseLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showExit, setShowExit] = useState(false)

  // ─── Progress simulation ──────────────────────────────────────────
  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      // Fast at first, then slow down near 100%
      const rawProgress = Math.min(
        (elapsed / minDuration) * 100,
        98, // never quite reach 100 until we're done
      )
      setProgress(rawProgress)
      setMessageIndex(Math.min(
        Math.floor((rawProgress / 100) * LOADING_MESSAGES.length),
        LOADING_MESSAGES.length - 1,
      ))
    }, 100)

    // Complete after minDuration
    const completeTimer = setTimeout(() => {
      setProgress(100)
      setIsComplete(true)

      // Brief pause then call onComplete
      setTimeout(() => {
        setShowExit(true)
        setTimeout(() => onComplete(), 600)
      }, 400)
    }, minDuration)

    return () => {
      clearInterval(interval)
      clearTimeout(completeTimer)
    }
  }, [minDuration, onComplete])

  return (
    <AnimatePresence>
      {!showExit && (
        <motion.div
          key="spider-verse-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020617]"
        >
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a0f1e] to-[#020617]" />

          {/* Subtle grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo / spinner */}
            <motion.div
              animate={{
                scale: isComplete ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <SpiderLoader variant="web-spin" label="" />
            </motion.div>

            {/* Status message */}
            <div className="text-center">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "text-sm font-mono tracking-[0.15em] transition-colors duration-500",
                  isComplete ? "text-green-400" : "text-cyan-400",
                )}
              >
                {isComplete
                  ? "✓ CONNECTION ESTABLISHED"
                  : LOADING_MESSAGES[messageIndex]}
              </motion.p>

              {/* Progress bar */}
              <div className="mt-6 w-64">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={cn(
                      "h-full rounded-full transition-all duration-100",
                      isComplete ? "xp-bar-fill" : "bg-gradient-to-r from-cyan-500 to-cyan-400",
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>SYSTEM BOOT</span>
                  <span className="font-mono">{Math.floor(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Version info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-[10px] tracking-[0.2em] text-slate-700">
                SPIDER-VERSE OS v3.0 — BIOMETRIC SCAN INITIALIZED
              </p>
              <p className="mt-1 text-[9px] text-slate-800">
                © {new Date().getFullYear()} Oscorp Industries — Advanced Hero Technologies Division
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
