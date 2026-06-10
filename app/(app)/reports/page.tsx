"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAIInsights } from "@/hooks/use-ai-insights"
import { useStreaks } from "@/hooks/use-streak"
import { useAchievements } from "@/hooks/use-achievements"
import { PageHeader } from "@/components/shared/page-header"
import { InsightCard } from "@/components/molecules/insight-card"
import { StatCard } from "@/components/molecules/stat-card"
import { AchievementBadge } from "@/components/molecules/achievement-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Calendar, Trophy, Target, Flame, Sparkles, ChevronRight } from "lucide-react"

export default function ReportsPage() {
  const { data: insights, isLoading: insightsLoading } = useAIInsights()
  const { data: streaks, isLoading: streaksLoading } = useStreaks()
  const { achievements, unlockedCount, totalCount, isLoading: achievementsLoading } = useAchievements()

  const recentAchievements = achievements
    .filter((a) => a.unlockedAt)
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Insights"
        description="Track your progress and discover patterns"
      />

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Streak"
          value={streaks?.currentStreak || 0}
          icon={Flame}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Best Streak"
          value={streaks?.bestStreak || 0}
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <StatCard
          title="Perfect Days"
          value={streaks?.perfectDays || 0}
          icon={Calendar}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Achievements"
          value={`${unlockedCount}/${totalCount}`}
          icon={Trophy}
          iconColor="text-yellow-500"
        />
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insights
          </h2>
        </div>
        
        {insightsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
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
        ) : null}
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View your daily completion rates and task breakdowns.{" "}
                <Link href="/reports/daily" className="text-primary hover:underline">
                  View full report →
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyze your weekly trends and consistency scores.{" "}
                <Link href="/reports/weekly" className="text-primary hover:underline">
                  View full report →
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See your monthly progress with heatmaps and category breakdowns.{" "}
                <Link href="/reports/monthly" className="text-primary hover:underline">
                  View full report →
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Achievements</h3>
            <Link href="/reports/achievements">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {achievementsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.achievementId}
                  emoji={achievement.achievement.emoji}
                  name={achievement.achievement.name}
                  description={achievement.achievement.description}
                  unlockedAt={achievement.unlockedAt}
                  progress={achievement.progress}
                  target={achievement.target}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
