"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ParticleField } from "./particle-field"

// ─── Rain Drops ─────────────────────────────────────────────────────
function RainEffect() {
  const drops = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: ((i * 17 + i * i * 3) % 100),
    delay: (i * 0.07) % 2,
    duration: 0.8 + (i % 5) * 0.2,
    opacity: 0.2 + (i % 4) * 0.15,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

// ─── Scan Line Overlay ──────────────────────────────────────────────
function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        style={{
          animation: "scan-line 3s linear infinite",
        }}
      />
    </div>
  )
}

// ─── Glitch Text Effect ─────────────────────────────────────────────
function GlitchText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string
  className?: string
  as?: React.ElementType
}) {
  return (
    <Tag className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute inset-0 z-0 text-red-500/30 animate-pulse"
        style={{
          clipPath: "inset(20% 0 60% 0)",
          transform: "translateX(-2px)",
          animation: "glitch-skew 2s ease-in-out infinite",
        }}
        aria-hidden
      >
        {text}
      </span>
      <span
        className="absolute inset-0 z-0 text-cyan-400/30 animate-pulse"
        style={{
          clipPath: "inset(60% 0 10% 0)",
          transform: "translateX(2px)",
          animation: "glitch-skew 2s ease-in-out infinite reverse",
        }}
        aria-hidden
      >
        {text}
      </span>
    </Tag>
  )
}  // ─── Cinematic Scene Types ──────────────────────────────────────────
type BroadcastScene =
  | "opening"     // Black screen with static
  | "broadcast"   // EMERGENCY BROADCAST
  | "alert"       // EMERGENCY ALERT
  | "threat"      // Alert Level: ACTIVE
  | "scanning"    // SCANNING FOR AVAILABLE HERO...
  | "identity"    // IDENTITY CONFIRMED (only if logged in)
  | "enter"       // ENTER SPIDER HQ (only if logged in)
  | "no-hero"     // NO HERO FOUND → sign up (only if anonymous)
  | "complete"    // Scrolled past / dismissed

// When to branch after mount (same timing as old identity scene)
const BRANCH_AT_MS = 7200

interface CinematicHeroProps {
  onComplete?: () => void
}

export function CinematicHero({ onComplete }: CinematicHeroProps) {
  const { data: session, status } = useSession()
  const [scene, setScene] = useState<BroadcastScene>("opening")
  const mountTime = useRef(Date.now())
  const branchingDone = useRef(false)

  // ─── Timed scene progression (first 4 scenes always play) ────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setScene("broadcast"), 400))
    timers.push(setTimeout(() => setScene("alert"), 2200))
    timers.push(setTimeout(() => setScene("threat"), 3800))
    timers.push(setTimeout(() => setScene("scanning"), 5400))

    return () => timers.forEach(clearTimeout)
  }, [])

  // ─── Branch after scanning based on auth state ───────────────────
  // Branches at BRANCH_AT_MS from mount, regardless of when auth resolves
  useEffect(() => {
    if (branchingDone.current) return
    if (status !== "authenticated" && status !== "unauthenticated") return

    const elapsed = Date.now() - mountTime.current
    const delay = Math.max(0, BRANCH_AT_MS - elapsed)

    const timer = setTimeout(() => {
      branchingDone.current = true
      if (status === "authenticated") {
        setScene("identity")
        setTimeout(() => setScene("enter"), 1800)
      } else {
        setScene("no-hero")
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [status])

  const handleScrollDown = useCallback(() => {
    setScene("complete")
    onComplete?.()
    const featuresSection = document.getElementById("city-intel")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [onComplete])

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Full-screen cinematic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a0f1e] to-[#020617]" />

      {/* Static noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Rain */}
      <RainEffect />

      {/* Scan line */}
      <ScanLine />

      {/* Particle field */}
      <ParticleField
        count={20}
        color="rgba(225, 29, 72, 0.15)"
        speed={0.5}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Lightning flashes */}
      <AnimatePresence>
        {scene === "broadcast" && (
          <motion.div
            key="lightning-1"
            className="absolute inset-0 bg-white z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0, 0.05, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, times: [0, 0.1, 0.3, 0.4, 0.6] }}
          />
        )}
      </AnimatePresence>

      {/* NY Skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 160" fill="none" className="h-full w-full opacity-20">
          <path
            d="M0 160V120H40V80H60V100H80V60H100V90H120V70H140V100H160V50H180V80H200V60H220V90H240V40H260V70H280V55H300V85H320V45H340V75H360V65H380V95H400V55H420V85H440V60H460V90H480V70H500V100H520V80H540V110H560V90H580V120H600V90H620V110H640V80H660V100H680V70H700V95H720V65H740V90H760V60H780V85H800V55H820V80H840V50H860V75H880V45H900V70H920V55H940V80H960V60H980V90H1000V70H1020V100H1040V80H1060V110H1080V90H1100V120H1120V100H1140V130H1160V110H1180V140H1200V120H1220V150H1240V130H1260V160H1280V140H1300V160H1320V150H1340V160H1360V145H1380V160H1400V155H1440V160H0Z"
            fill="#0F172A"
          />
          {[60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580, 620, 660, 700, 740, 780, 820, 860, 900, 940, 980, 1020, 1060, 1100, 1140, 1180, 1220, 1260, 1300, 1340, 1380, 1420].map((x, i) => (
            <rect
              key={i}
              x={x}
              y={70 + (i % 5) * 10}
              width="2"
              height="3"
              fill={i % 3 === 0 ? "#E11D48" : i % 3 === 1 ? "#eab308" : "#22D3EE"}
              opacity={0.3 + (i % 4) * 0.1}
            />
          ))}
        </svg>
      </div>

      {/* Fog layer */}
      <div className="absolute bottom-28 left-0 right-0 h-20 z-20 pointer-events-none">
        <div className="h-full bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
      </div>

      {/* ─── Cinematic Content ──────────────────────────────────── */}
      <div className="relative z-30 flex min-h-screen flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* Scene 1: Daily Bugle Emergency Broadcast */}
          {scene === "broadcast" && (
            <motion.div
              key="broadcast"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                    Live Emergency Broadcast
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-[0.15em] sm:text-4xl lg:text-5xl">
                  <span className="text-slate-500">DAILY</span>{" "}
                  <span className="text-white">BUGLE</span>
                </h2>
                <div className="mx-auto mt-2 h-px w-48 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                <p className="mt-4 text-sm tracking-[0.3em] text-slate-600 uppercase">
                  Emergency Broadcast Network
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 2: Alert */}
          {scene === "alert" && (
            <motion.div
              key="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span className="text-3xl">🚨</span>
                  <GlitchText
                    text="EMERGENCY ALERT"
                    className="text-2xl font-black tracking-[0.1em] sm:text-3xl lg:text-4xl text-red-500"
                  />
                  <span className="text-3xl">🚨</span>
                </div>
                <p className="text-base tracking-[0.2em] text-slate-500 sm:text-lg">
                  NEW YORK CITY
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 3: Threat Level */}
          {scene === "threat" && (
            <motion.div
              key="threat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                  Alert Level
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className="h-8 w-2 rounded-sm bg-[#E11D48] animate-threat-pulse"
                        style={{ animationDelay: `${bar * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <GlitchText
                    text="ACTIVE"
                    className="text-3xl font-black tracking-[0.15em] sm:text-4xl lg:text-5xl text-[#E11D48]"
                  />
                </div>

                <div className="mx-auto mt-8 max-w-md">
                  <p className="text-base font-medium text-slate-400">
                    A hero is needed. The city's safety depends on daily missions and commitments.
                    Every completed task makes a difference.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 4: Scanning for Hero (same for all users) */}
          {scene === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse-radar" />
                    <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
                    <div className="absolute inset-4 rounded-full border border-cyan-500/10" />
                    <svg className="h-16 w-16 animate-spin" viewBox="0 0 64 64">
                      <path
                        d="M32 32 L32 2 A30 30 0 0 1 62 32 Z"
                        fill="rgba(34, 211, 238, 0.12)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                <p className="text-lg font-mono tracking-[0.2em] text-cyan-400 animate-pulse">
                  SCANNING FOR AVAILABLE HERO...
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ─── BRANCH A: Logged in → Identity + Enter ──────────── */}
          {scene === "identity" && (
            <motion.div
              key="identity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/50 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <span className="text-3xl">🕷️</span>
                  </div>
                </div>

                <div className="mb-2 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-400">
                    Hero Identified
                  </p>
                  <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                </div>

                <h2 className="text-4xl font-black tracking-[0.1em] sm:text-5xl lg:text-6xl">
                  <span className="bg-gradient-to-r from-[#E11D48] via-[#A855F7] to-[#22D3EE] bg-clip-text text-transparent">
                    {session?.user?.name || "Hero"}
                  </span>
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-3 text-lg font-medium text-slate-400"
                >
                  Welcome Back
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {scene === "enter" && (
            <motion.div
              key="enter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p className="mb-6 text-sm font-mono tracking-[0.15em] text-slate-600">
                  ACCESS GRANTED
                </p>

                <Link href="#city-intel">
                  <button
                    onClick={handleScrollDown}
                    className="group relative inline-flex items-center gap-3 rounded-xl border border-[#E11D48]/40 bg-gradient-to-r from-[#E11D48] to-[#1D4ED8] px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(225,29,72,0.5)] hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      ENTER COMMAND CENTER
                      <svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </Link>

                <p className="mt-4 text-xs text-slate-600 flex items-center justify-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Secure Connection
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ─── BRANCH B: Not logged in → No Hero Found + Sign Up ── */}
          {scene === "no-hero" && (
            <motion.div
              key="no-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* Failed scan visual */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
                    <span className="text-3xl">🔍</span>
                  </div>
                </div>

                {/* Glitch "NO HERO FOUND" */}
                <div className="mb-2 space-y-1">
                  <GlitchText
                    text="NO HERO FOUND"
                    className="text-lg font-black tracking-[0.15em] sm:text-xl lg:text-2xl text-yellow-500"
                  />
                  <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mx-auto mt-6 max-w-md text-base text-slate-400"
                >
                  The city scan completed but no registered hero was found in this sector.
                  The call for help remains unanswered...
                </motion.p>

                {/* Sign up CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8"
                >
                  <Link href="/login">
                    <button className="group relative inline-flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] hover:scale-105">
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="text-xl">🕷️</span>
                        Become a Hero — Sign In
                        <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-4 text-xs text-slate-600 flex items-center justify-center gap-2"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  Authentication required to access the command center
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator (only for logged-in users at the enter scene) */}
        {scene === "enter" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Descend into HQ
              </span>
              <div className="h-8 w-4 rounded-full border border-slate-700 flex justify-center">
                <div className="h-2 w-1 rounded-full bg-slate-500 animate-bounce mt-1" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Hero title for no-hero scene (always visible) */}
        {scene === "no-hero" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4"
          >
            <p className="text-2xl font-bold tracking-[0.15em] sm:text-3xl lg:text-4xl">
              <span className="text-slate-500">DAILY</span>{" "}
              <span className="text-white">BUGLE</span>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
