"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Zap, Shield, Star, Target, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassPanel } from "@/components/spider/glass-panel"
import { CinematicHero } from "@/components/spider/cinematic-hero"
import { CityIntelWall } from "@/components/spider/city-intel-wall"
import { VillainTracker } from "@/components/spider/villain-tracker"
import { SpiderSenseOverlay } from "@/components/spider/spider-sense-overlay"
import { DailyBugleFooter } from "@/components/spider/daily-bugle-footer"
import { ParticleField } from "@/components/spider/particle-field"

// ─── Join — CTA ──────────────────────────────────
function JoinSpiderNetwork() {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E11D48]/20 via-[#020617] to-[#1D4ED8]/20 px-4 py-24 lg:py-32">
      {/* Decorative particles */}
      <ParticleField
        count={40}
        color="rgba(225, 29, 72, 0.1)"
        speed={0.8}
        className="absolute inset-0 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl"
      >
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            {isAuthenticated
              ? `Hero Identified — Welcome Back, ${session.user.name?.split(" ")[0] || "Agent"}`
              : "DayFlow Network — Open for Registration"}
          </div>

          {/* Main heading */}
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-[#E11D48] via-[#A855F7] to-[#22D3EE] bg-clip-text text-transparent">
              {isAuthenticated ? "Continue Your" : "The City Is"}{" "}
            </span>
            {isAuthenticated ? "Mission" : "Calling"}
          </h2>

          {/* Feature highlights */}
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4">
            <GlassPanel variant="strong" className="p-3 text-center">
              <p className="text-2xl font-bold text-[#22D3EE]">📊</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Real Reports
              </p>
            </GlassPanel>
            <GlassPanel variant="strong" className="p-3 text-center">
              <p className="text-2xl font-bold text-[#A855F7]">🏆</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Earned Badges
              </p>
            </GlassPanel>
            <GlassPanel variant="strong" className="p-3 text-center">
              <p className="text-2xl font-bold text-[#E11D48]">📅</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Auto Schedule
              </p>
            </GlassPanel>
          </div>

          <p className="mt-8 text-xl text-slate-400">
            {isAuthenticated ? "Your command center is waiting." : "Will You Answer?"}
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button
                size="lg"
                className="group relative overflow-hidden gap-3 bg-gradient-to-r from-primary to-accent px-10 py-6 text-lg font-bold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isAuthenticated ? <LayoutDashboard className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                  {isAuthenticated ? "Return to Command Center" : "Swing Into Action"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
          </div>

          {/* Quick secondary link */}
          {isAuthenticated && (
            <div className="mt-4">
              <Link
                href="/tasks"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-4 decoration-slate-700"
              >
                Or head to Mission Board →
              </Link>
            </div>
          )}

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> No suit required
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" /> Every hero starts somewhere
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" /> Your data, your command center
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Floating Auth Bar (returning users) ───────────────────────────
function FloatingAuthBar() {
  const { data: session, status } = useSession()

  if (status === "loading" || !session?.user) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <Link href="/dashboard">
        <Button
          size="sm"
          className="gap-2 bg-card/50 backdrop-blur-md border border-border/30 text-foreground hover:bg-accent/10 text-xs"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          {session.user.name?.split(" ")[0] || "Hero"} — HQ
        </Button>
      </Link>
    </motion.div>
  )
}

// ─── Export ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const { status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <main className="flex-1 bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse-radar" />
                <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-4 rounded-full border border-cyan-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm">🕷️</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600">Establishing connection...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      {/* Floating auth bar for returning users + Skip to login */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <FloatingAuthBar />
        {status === "unauthenticated" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/login">
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Skip
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Scene 1: Cinematic Entry */}
      <CinematicHero />

      {/* Scene 2: City Intelligence Wall */}
      <CityIntelWall />

      {/* Scene 3: Threat Categories */}
      <VillainTracker />

      {/* Hero Shot: Spider-Man catching Gwen */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src="/spider-1.jpeg"
            alt="Spider-Man saves the day"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-black/40 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-cyan-400">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Every hero makes a difference
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              Even heroes need a plan
            </h3>
          </div>
        </div>
      </section>

      {/* Scene 4: CTA */}
      <JoinSpiderNetwork />

      {/* Scene 5: Footer */}
      <DailyBugleFooter />

      {/* Periodic Spider Sense Overlay */}
      <SpiderSenseOverlay />
    </main>
  )
}
