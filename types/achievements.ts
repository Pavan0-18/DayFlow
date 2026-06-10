export interface AchievementDefinition {
  id: string
  emoji: string
  name: string
  description: string
  condition: string
  requirement: number
}

export interface UserAchievementWithProgress {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date | null
  achievement: {
    id: string
    emoji: string
    name: string
    description: string
  }
  progress: number
  target: number
}

export interface AchievementUnlockEvent {
  achievementId: string
  emoji: string
  name: string
  description: string
  unlockedAt: Date
}

export interface AchievementStats {
  totalAchievements: number
  unlockedCount: number
  lockedCount: number
  completionPercentage: number
  recentlyUnlocked: UserAchievementWithProgress[]
}
