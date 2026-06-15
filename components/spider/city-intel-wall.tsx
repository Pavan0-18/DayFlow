"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GlassPanel } from "./glass-panel"
import { SpiderSense } from "./spider-sense"

const FEATURES = [
  {
    icon: "📡",
    title: "Real-time Analytics",
    description: "Track your daily completion rates and productivity patterns with live-updating dashboards powered by your actual task data.",
  },
  {
    icon: "🎯",
    title: "Mission Planning",
    description: "Organize tasks by category and priority. Each category maps to a patrol district so you always know where to focus.",
  },
  {
    icon: "📊",
    title: "Performance Reports",
    description: "View daily, weekly, and monthly reports based on your real completion data — no guesswork, just actionable insights.",
  },
  {
    icon: "🏆",
    title: "Achievement System",
    description: "Earn hero awards by completing real tasks and maintaining streaks. Every badge represents a genuine accomplishment.",
  },
  {
    icon: "🧠",
    title: "AI Coaching",
    description: "Get personalized insights and suggestions based on your actual performance patterns, not generic advice.",
  },
  {
    icon: "⚡",
    title: "Auto-Scheduling",
    description: "Let the AI router plan your optimal patrol schedule from your active tasks, minimizing gaps and maximizing efficiency.",
  },
]

export function CityIntelWall({ className }: { className?: string }) {
  const { data: session } = useSession()

  return (
    <section id="city-intel" className={cn("relative px-4 py-24 lg:py-32", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#1D4ED8]/5 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Your Data, Your Command Center
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            City{" "}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#A855F7] bg-clip-text text-transparent">
              Intelligence Wall
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Every metric, every insight comes from your actual activity. No simulated data, no fake stats — just
            your real performance driving the command center.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Left: Spider Sense + Key Features */}
          <div className="space-y-6 lg:col-span-1">
            <GlassPanel variant="holographic" className="flex flex-col items-center p-6">
              <SpiderSense
                active={false}
                notifications={[
                  { id: "1", message: "🕷️ Your patrol data feeds every dashboard in real time.", type: "info" },
                  { id: "2", message: "⚠️ Your completion rate updates as you check off tasks.", type: "alert" },
                  { id: "3", message: "🚨 Achievements unlock automatically when you hit milestones.", type: "info" },
                ]}
              />
              <div className="mt-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Data Integrity Status
                </p>
                <p className="text-xs font-medium text-cyan-400">
                  🟢 All data sourced from your actual activity
                </p>
              </div>
            </GlassPanel>

            {/* Feature highlights */}
            <GlassPanel variant="strong" className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {session?.user?.name ? `${session.user.name}'s Command Center` : "Hero Command Center"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data Source</span>
                  <span className="font-bold text-white">Your Tasks</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reports</span>
                  <span className="font-bold text-green-400">Real-time</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Insights</span>
                  <span className="font-bold text-yellow-400">Personalized</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Achievements</span>
                  <span className="font-bold text-white">Auto-tracked</span>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Center + Right: Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform Capabilities
              </h3>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Powered by your data
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  style={{ transitionDelay: `${index * 80}ms` }}
                  className="transition-all duration-500 hover:translate-x-1"
                >
                  <GlassPanel className="border-l-4 border-l-cyan-500/40 p-4 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-lg">{feature.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                        <p className="mt-0.5 text-sm text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
