"use client"

import { motion } from "framer-motion"
import { useAchievements } from "@/hooks/use-achievements"
import { useStreaks } from "@/hooks/use-streak"
import { AchievementBadge } from "@/components/molecules/achievement-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { GlassPanel } from "@/components/spider/glass-panel"
import { Trophy, Flame, Calendar, Lock, Sparkles } from "lucide-react"

export default function AchievementsPage() {
  const { achievements, unlockedCount, totalCount, unlockedAchievements, lockedAchievements, progressPercentage } = useAchievements()
  const { data: streaks } = useStreaks()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#E11D48]/20 border border-white/10">
          <Trophy className="h-6 w-6 text-[#F59E0B]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Awards</h1>
          <p className="text-sm text-muted-foreground">{unlockedCount} of {totalCount} achievements unlocked</p>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassPanel variant="holographic" className="p-4 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-[#F59E0B]" />
          <div>
            <p className="text-xs text-muted-foreground">Completion</p>
            <p className="text-lg font-bold text-white">{progressPercentage}%</p>
          </div>
        </GlassPanel>
        <GlassPanel variant="holographic" className="p-4 flex items-center gap-3">
          <Flame className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-xs text-muted-foreground">Current streak</p>
            <p className="text-lg font-bold text-white">{streaks?.currentStreak || 0} days</p>
          </div>
        </GlassPanel>
        <GlassPanel variant="holographic" className="p-4 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-[#22D3EE]" />
          <div>
            <p className="text-xs text-muted-foreground">Perfect days</p>
            <p className="text-lg font-bold text-white">{streaks?.perfectDays || 0}</p>
          </div>
        </GlassPanel>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Unlocked awards</h3>
        {unlockedAchievements.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No awards yet"
            description="Complete missions and build streaks to earn hero achievements."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((a) => (
              <AchievementBadge
                key={a.achievementId}
                emoji={a.achievement.emoji}
                name={a.achievement.name}
                description={a.achievement.description}
                unlockedAt={a.unlockedAt}
                progress={a.progress}
                target={a.target}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Locked awards</h3>
        {lockedAchievements.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="All achievements unlocked!"
            description="You've earned every hero award. Outstanding work!"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((a) => (
              <AchievementBadge
                key={a.achievementId}
                emoji={a.achievement.emoji}
                name={a.achievement.name}
                description={a.achievement.description}
                unlockedAt={null}
                progress={a.progress}
                target={a.target}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
