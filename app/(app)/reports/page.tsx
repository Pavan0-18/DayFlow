"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useAIInsights } from "@/hooks/use-ai-insights"
import { useStreaks } from "@/hooks/use-streak"
import { useAchievements } from "@/hooks/use-achievements"
import { InsightCard } from "@/components/molecules/insight-card"
import { AchievementBadge } from "@/components/molecules/achievement-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { GlassPanel } from "@/components/spider/glass-panel"
import { HeroStat } from "@/components/spider/hero-stat"
import { ThreatLevel } from "@/components/spider/threat-level"
import {
  TrendingUp,
  Calendar,
  Trophy,
  Flame,
  ChevronRight,
  FileText,
  Shield,
  Eye,
  ScrollText,
  Zap,
} from "lucide-react"

export default function CaseFilesPage() {
  const { data: insights, isLoading: insightsLoading } = useAIInsights()
  const { data: streaks, isLoading: streaksLoading } = useStreaks()
  const { achievements, unlockedCount, totalCount, isLoading: achievementsLoading } = useAchievements()

  const recentAchievements = achievements
    .filter((a) => a.unlockedAt)
    .slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#E11D48]/20 border border-white/10">
            <FileText className="h-6 w-6 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Case Files</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Classified Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThreatLevel level={streaks?.currentStreak && streaks.currentStreak > 7 ? "low" : streaks?.currentStreak && streaks.currentStreak > 3 ? "medium" : "high"} />
        </div>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <HeroStat
            label="Patrol Streak"
            value={`${streaks?.currentStreak || 0} days`}
            icon={<Flame className="h-4 w-4" />}
            trend={streaks?.currentStreak && streaks.currentStreak > 0 ? "up" : "neutral"}
            trendValue={streaks?.bestStreak ? `Best: ${streaks.bestStreak}` : "Active"}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeroStat
            label="Best Streak"
            value={`${streaks?.bestStreak || 0}`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={streaks?.bestStreak && streaks.bestStreak > 10 ? "up" : "neutral"}
            trendValue="days"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <HeroStat
            label="Perfect Days"
            value={streaks?.perfectDays || 0}
            icon={<Calendar className="h-4 w-4" />}
            trend={streaks?.perfectDays && streaks.perfectDays > 5 ? "up" : "neutral"}
            trendValue="days"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <HeroStat
            label="Achievements"
            value={`${unlockedCount}/${totalCount}`}
            icon={<Trophy className="h-4 w-4" />}
            trend={unlockedCount > totalCount / 2 ? "up" : unlockedCount > 0 ? "neutral" : "down"}
            trendValue={`${Math.round((unlockedCount / totalCount) * 100)}%`}
          />
        </motion.div>
      </div>

      {/* AI Intelligence Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#A855F7] animate-pulse" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              AI Intelligence Reports
            </h2>
          </div>
        </div>
        
        {insightsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : insights ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.type}
                insight={insight}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Zap}
            title="No intelligence data"
            description="Complete tasks and build streaks to generate AI insights about your performance."
          />
        )}
      </div>

      {/* Report Dossiers */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-white/5 p-1 border border-white/5">
          <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-[#E11D48]/20 data-[state=active]:text-[#E11D48] text-xs">
            Daily Log
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg data-[state=active]:bg-[#1D4ED8]/20 data-[state=active]:text-[#1D4ED8] text-xs">
            Weekly Intel
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg data-[state=active]:bg-[#A855F7]/20 data-[state=active]:text-[#A855F7] text-xs">
            Monthly Dossier
          </TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-lg data-[state=active]:bg-[#F59E0B]/20 data-[state=active]:text-[#F59E0B] text-xs">
            Hero Awards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <GlassPanel variant="holographic" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Daily Patrol Log</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Review your daily completion rates and mission breakdowns across the city.
                </p>
              </div>
              <ScrollText className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="mt-4">
              <Link href="/reports/daily">
                <Button variant="outline" className="gap-2 border-white/10 text-muted-foreground hover:text-white">
                  <Eye className="h-4 w-4" />
                  View Full Report
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </GlassPanel>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <GlassPanel variant="holographic" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Weekly Intelligence Brief</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Analyze your weekly trends and consistency scores across patrol patterns.
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="mt-4">
              <Link href="/reports/weekly">
                <Button variant="outline" className="gap-2 border-white/10 text-muted-foreground hover:text-white">
                  <Eye className="h-4 w-4" />
                  View Full Report
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </GlassPanel>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <GlassPanel variant="holographic" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Monthly Hero Dossier</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  See your monthly impact with heatmaps, category breakdowns, and threat analysis.
                </p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="mt-4">
              <Link href="/reports/monthly">
                <Button variant="outline" className="gap-2 border-white/10 text-muted-foreground hover:text-white">
                  <Eye className="h-4 w-4" />
                  View Full Report
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </GlassPanel>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Hero Awards
            </h3>
            <Link href="/reports/achievements">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-white">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {achievementsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentAchievements.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground text-sm">No awards yet. Complete missions to earn hero achievements!</p>
                </div>
              ) : (
                recentAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.achievementId}
                    emoji={achievement.achievement.emoji}
                    name={achievement.achievement.name}
                    description={achievement.achievement.description}
                    unlockedAt={achievement.unlockedAt}
                    progress={achievement.progress}
                    target={achievement.target}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
