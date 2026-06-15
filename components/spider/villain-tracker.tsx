"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GlassPanel } from "./glass-panel"
import { CATEGORY_DISTRICTS, CATEGORY_THREAT_TYPES } from "@/lib/constants/spider-theme"

const CATEGORY_ENTRIES = Object.entries(CATEGORY_THREAT_TYPES).slice(0, 6)

const threatColors: Record<string, string> = {
  Health: "from-red-500/20 to-red-500/5",
  Work: "from-blue-500/20 to-blue-500/5",
  Learning: "from-purple-500/20 to-purple-500/5",
  Fitness: "from-orange-500/20 to-orange-500/5",
  Personal: "from-green-500/20 to-green-500/5",
  Mindfulness: "from-cyan-500/20 to-cyan-500/5",
}

const borderColors: Record<string, string> = {
  Health: "border-red-500/30",
  Work: "border-blue-500/30",
  Learning: "border-purple-500/30",
  Fitness: "border-orange-500/30",
  Personal: "border-green-500/30",
  Mindfulness: "border-cyan-500/30",
}

export function VillainTracker({ className }: { className?: string }) {
  return (
    <section className={cn("relative px-4 py-24 lg:py-32", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#E11D48]/5 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Category-Based Threat System
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Threat{" "}
            <span className="bg-gradient-to-r from-[#E11D48] via-[#A855F7] to-[#22D3EE] bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Every task category in your system maps to a unique threat type and patrol district.
            Your actual completion rates determine the threat level — no fabricated data.
          </p>
        </motion.div>

        {/* Category Threat Cards */ }
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-4 sm:grid-cols-2"
        >
          {CATEGORY_ENTRIES.map(([category, threat], index) => {
            const district = CATEGORY_DISTRICTS[category] || "NYC"
            return (
              <div
                key={category}
                style={{ transitionDelay: `${index * 100}ms` }}
                className="transition-all duration-500 hover:scale-[1.02]"
              >
                <GlassPanel
                  variant="strong"
                  hover
                  className={cn(
                    "p-5 border-l-4",
                    borderColors[category] || "border-white/10",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                        threatColors[category] || "bg-black/40",
                      )}>
                        <span className="text-2xl">{getCategoryEmoji(category)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{category}</h3>
                        <p className="text-xs text-muted-foreground">📍 {district}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-cyan-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                        THREAT TYPE
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {getCategoryDescription(category, threat)}
                    </p>
                  </div>

                  {/* How it works */}
                  <div className="mt-3 rounded-lg bg-cyan-500/10 p-2">
                    <span className="text-[10px] font-medium text-cyan-400 leading-relaxed block">
                      💡 Your real task completion rates in this category determine the threat level on your actual dashboard — no fabricated data, just your real performance.
                    </span>
                  </div>
                </GlassPanel>
              </div>
            )
          })}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <GlassPanel className="inline-flex items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#22D3EE]" />
              <span className="text-xs text-muted-foreground">
                <strong className="text-cyan-400">{Object.keys(CATEGORY_DISTRICTS).length} districts</strong> mapped
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#A855F7]" />
              <span className="text-xs text-muted-foreground">
                <strong className="text-purple-400">{CATEGORY_ENTRIES.length} threat types</strong> active
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">
                <strong className="text-green-400">Real data</strong> always
              </span>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  )
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    Health: "💊",
    Work: "💼",
    Learning: "📚",
    Fitness: "💪",
    Personal: "👤",
    Mindfulness: "🧘",
    Social: "🤝",
    Finance: "💰",
    Creative: "🎨",
    Other: "🔧",
  }
  return emojis[category] || "❓"
}

function getCategoryDescription(category: string, threat: string): string {
  const descriptions: Record<string, string> = {
    Health: `${threat} — Keep your well-being in check. Track health-related tasks and monitor your self-care completion rate across patrols.`,
    Work: `${threat} — Professional missions require focus. Your work tasks are tracked as corporate security operations.`,
    Learning: `${threat} — Knowledge is power. Each learning task completed is a victory against deception and misinformation.`,
    Fitness: `${threat} — Physical training missions keep you battle-ready. Track workouts and exercise as part of your hero regimen.`,
    Personal: `${threat} — Personal growth missions. Every personal task completed strengthens your foundation as a hero.`,
    Mindfulness: `${threat} — Mental clarity is your greatest weapon. Track meditation and mindfulness as neural defense operations.`,
    Social: `${threat} — Social connections are your network. Maintain relationships across the city like a web of allies.`,
    Finance: `${threat} — Financial stability funds your hero work. Track budgeting and finance tasks as resource management.`,
    Creative: `${threat} — Creative endeavors push boundaries. Each project advances your ability to think outside the box.`,
    Other: `${threat} — Miscellaneous missions that don't fit standard categories. Every task counts toward city security.`,
  }
  return descriptions[category] || `${threat} — Track your completion rate to maintain city security in this district.`
}
