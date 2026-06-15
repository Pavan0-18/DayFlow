"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useDailyLog } from "@/hooks/use-daily-log"
import { useStreaks } from "@/hooks/use-streak"
import { useAchievements } from "@/hooks/use-achievements"
import { useTasks } from "@/hooks/use-tasks"
import { ProgressRing } from "@/components/molecules/progress-ring"
import { SkeletonTaskCard } from "@/components/molecules/skeleton-task-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { HeroStat } from "@/components/spider/hero-stat"
import { GlassPanel } from "@/components/spider/glass-panel"
import { CityIntelMap } from "@/components/spider/city-intel-map"
import { RadarScan } from "@/components/spider/radar-scan"
import { SpiderSense } from "@/components/spider/spider-sense"
import { ThreatLevel } from "@/components/spider/threat-level"
import { MissionCard } from "@/components/spider/mission-card"
import { RankBadge, getRankFromXp } from "@/components/spider/rank-badge"
import { getMotivationalMessage } from "@/lib/utils"
import { showTaskCompletedToast } from "@/lib/notifications/show-toasts"
import {
  buildDistrictIntel,
  buildRadarDots,
  completionToThreatLevel,
  completionToTrend,
  categoryToPriority,
  CATEGORY_DISTRICTS,
} from "@/lib/constants/spider-theme"
import { ChevronLeft, ChevronRight, Plus, CheckSquare, Shield, Zap, Activity, Users } from "lucide-react"
import { addDays, subDays, isToday } from "date-fns"
import confetti from "canvas-confetti"

export default function SpiderHQPage() {
  const [date, setDate] = useState(new Date())
  const { log, items, completedCount, totalCount, completionPercentage, isLoading, error, toggleTask } = useDailyLog(date)
  const { data: streaks } = useStreaks()
  const { achievements, unlockedCount, totalCount: totalAchievements } = useAchievements()
  const { activeTasks } = useTasks()
  const { rank } = getRankFromXp((streaks?.currentStreak || 0) * 50)

  const canGoForward = !isToday(date)
  const confettiFiredRef = useRef(false)

  useEffect(() => {
    if (completionPercentage === 100 && totalCount > 0 && !confettiFiredRef.current) {
      confettiFiredRef.current = true
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E11D48", "#1D4ED8", "#A855F7", "#22D3EE", "#F59E0B"],
      })
    }
    if (completionPercentage < 100) {
      confettiFiredRef.current = false
    }
  }, [completionPercentage, totalCount])

  const handlePreviousDay = () => setDate((prev) => subDays(prev, 1))
  const handleNextDay = () => { if (canGoForward) setDate((prev) => addDays(prev, 1)) }

  // Build district intelligence from actual task data
  const categoryCounts: Record<string, number> = {}
  const categoryCompletionRates: Record<string, number> = {}
  for (const item of items) {
    const cat = item.task.category
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    if (!(cat in categoryCompletionRates)) {
      const catItems = items.filter((i) => i.task.category === cat)
      const catCompleted = catItems.filter((i) => i.completed).length
      categoryCompletionRates[cat] = catItems.length > 0 ? Math.round((catCompleted / catItems.length) * 100) : 0
    }
  }
  const districts = buildDistrictIntel(categoryCounts, categoryCompletionRates)
  const radarDots = buildRadarDots(totalCount, completedCount)

  if (error) {
    return (
      <ErrorState
        title="Spider HQ Connection Lost"
        description="Unable to connect to the command center. Check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    )
  }

  const message = getMotivationalMessage(completionPercentage)
  const isHighAlert = completionPercentage < 30 && totalCount > 0

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E11D48]/20 to-[#1D4ED8]/20 border border-white/10">
            <Shield className="h-6 w-6 text-[#E11D48]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Spider HQ</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Command Center Active
            </p>
          </div>
        </div>
        <RankBadge rank={rank} xp={(streaks?.currentStreak || 0) * 50} nextRankXp={500} />
      </motion.div>

      {/* Date Navigator */}
      <div className="flex items-center justify-between glass-panel rounded-xl p-3">
        <Button variant="ghost" size="icon" onClick={handlePreviousDay} className="text-muted-foreground hover:text-white">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-base font-semibold text-white">
            {isToday(date) ? "Today's Mission" : date.toLocaleDateString("en-US", { weekday: "long" })}
          </h2>
          <p className="text-xs text-muted-foreground">
            {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextDay}
          disabled={!canGoForward}
          className="text-muted-foreground hover:text-white disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HeroStat
          label="City Security"
          value={`${completionPercentage}%`}
          icon={<Shield className="h-4 w-4" />}
          trend={completionToTrend(completionPercentage)}
          trendValue={`${completedCount}/${totalCount} missions`}
          pulse={isHighAlert}
        />
        <HeroStat
          label="Hero Streak"
          value={`${streaks?.currentStreak || 0} days`}
          icon={<Zap className="h-4 w-4" />}
          trend={streaks?.currentStreak && streaks.currentStreak > 0 ? "up" : "neutral"}
          trendValue={streaks?.bestStreak ? `Best: ${streaks.bestStreak}` : "Start your streak"}
        />
        <HeroStat
          label="Active Threats"
          value={activeTasks.length}
          icon={<Activity className="h-4 w-4" />}
          trend={activeTasks.length > 10 ? "up" : activeTasks.length > 0 ? "neutral" : "down"}
          trendValue={activeTasks.length > 10 ? "High priority" : "Manageable"}
        />
        <HeroStat
          label="Achievements"
          value={`${unlockedCount}/${totalAchievements}`}
          icon={<Users className="h-4 w-4" />}
          trend={unlockedCount > 0 ? "up" : "neutral"}
          trendValue={`${totalAchievements - unlockedCount} remaining`}
        />
      </div>

      {/* Main Command Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: City Intel + Radar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Spider Sense */}
          <GlassPanel variant="holographic" className="p-4">
            <div className="flex flex-col items-center">
              <SpiderSense
                active={isHighAlert}
                notifications={
                  isHighAlert
                    ? [{ id: "1", message: "⚡ Multiple threats detected across the city!", type: "danger" }]
                    : completionPercentage >= 100
                    ? [{ id: "1", message: "✅ City secured! All missions completed.", type: "info" }]
                    : [{ id: "1", message: "🕷️ All quiet. Patrol ongoing.", type: "info" }]
                }
              />
              <div className="mt-3 text-center">
                <p className="text-xs font-medium text-muted-foreground">Spider Sense Status</p>
                <p className={`text-sm font-semibold ${isHighAlert ? "text-red-400" : "text-green-400"}`}>
                  {isHighAlert ? "⚠️ Alert — Threats detected" : completionPercentage >= 100 ? "✅ Secure" : "🟢 Calm"}
                </p>
              </div>
            </div>
          </GlassPanel>

          {/* Radar Scan */}
          <GlassPanel variant="strong" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City Radar</h3>
              <ThreatLevel level={completionToThreatLevel(completionPercentage)} />
            </div>
            <div className="flex justify-center">
              <RadarScan dots={radarDots} />
            </div>
          </GlassPanel>
        </div>

        {/* Center: City Intel Map */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mission Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0F172A]/90 via-[#0F172A]/70 to-[#1D4ED8]/10 p-6 shadow-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E11D48]/5 via-transparent to-[#A855F7]/5" />
            <div className="relative flex flex-col items-center">
              <ProgressRing percentage={completionPercentage} size={180}>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">{completedCount}</span>
                  <span className="text-muted-foreground">/{totalCount}</span>
                  <p className="text-xs text-muted-foreground">missions complete</p>
                </div>
              </ProgressRing>

              <div className="mt-4 text-center">
                <p className={`text-base font-medium ${message.color}`}>
                  {message.emoji} {message.text}
                </p>
              </div>
            </div>
          </motion.div>

          {/* City Intel Map */}
          <CityIntelMap districts={districts} />
        </div>
      </div>

      {/* Active Missions / Task Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E11D48] animate-pulse" />
            Active Missions
          </h3>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalCount} secured
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <SkeletonTaskCard />
            <SkeletonTaskCard />
            <SkeletonTaskCard />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No active missions"
            description="The city is quiet. Head to the Mission Board to accept new assignments."
            action={{
              label: "Mission Board",
              onClick: () => { window.location.href = "/tasks" },
            }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item, index) => {
              const districtName = CATEGORY_DISTRICTS[item.task.category] || "NYC"
              // Derive priority from actual task category rather than array index
              const categoryPriority = categoryToPriority(item.task.category)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => {
                      const newCompleted = !item.completed
                      toggleTask.mutate(
                        { taskId: item.task.id, date, completed: newCompleted },
                        {
                          onSuccess: () => {
                            if (newCompleted) {
                              showTaskCompletedToast(item.task.title, () => {
                                toggleTask.mutate({ taskId: item.task.id, date, completed: false })
                              })
                            }
                          },
                        }
                      )
                    }}
                    className="w-full text-left"
                  >
                    <MissionCard
                      title={item.task.title}
                      status={item.completed ? "city-saved" : "swinging-into-action"}
                      threatLevel={completionToThreatLevel(completionPercentage)}
                      priority={item.completed ? "low" : categoryPriority}
                      location={districtName}
                      // Only show progress as 0 or 100 — no fabricated partial progress
                      progress={item.completed ? 100 : 0}
                    />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Action FAB */}
      <motion.div
        className="fixed bottom-28 right-4 lg:bottom-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-[#E11D48] to-[#1D4ED8] shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:shadow-[0_0_50px_rgba(225,29,72,0.5)] transition-all duration-300"
          onClick={() => window.location.href = "/tasks"}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  )
}
