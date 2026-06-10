import { db } from '../db'
import { UserAchievement } from '@prisma/client'
import { ACHIEVEMENTS } from '../constants/achievements'

export interface AchievementWithProgress {
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

export class AchievementRepository {
  async findAllByUser(userId: string): Promise<AchievementWithProgress[]> {
    const userAchievements = await db.userAchievement.findMany({
      where: { userId },
    })

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId))

    const allAchievements = ACHIEVEMENTS.map((achievement) => {
      const unlocked = userAchievements.find((ua) => ua.achievementId === achievement.id)
      return {
        id: unlocked?.id ?? `${achievement.id}-locked`,
        userId,
        achievementId: achievement.id,
        unlockedAt: unlocked?.unlockedAt ?? null,
        achievement: {
          id: achievement.id,
          emoji: achievement.emoji,
          name: achievement.name,
          description: achievement.description,
        },
        progress: unlocked ? achievement.requirement : 0,
        target: achievement.requirement,
      }
    })

    return allAchievements
  }

  async findUnlockedByUser(userId: string): Promise<UserAchievement[]> {
    const achievements = await db.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    })
    return achievements
  }

  async unlock(userId: string, achievementId: string): Promise<UserAchievement | null> {
    try {
      const achievement = await db.userAchievement.create({
        data: {
          userId,
          achievementId,
        },
      })
      return achievement
    } catch (error) {
      // Already unlocked
      return null
    }
  }

  async isUnlocked(userId: string, achievementId: string): Promise<boolean> {
    const achievement = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    })
    return !!achievement
  }

  async getTotalCompleted(userId: string): Promise<number> {
    const result = await db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
      },
    })
    return result
  }
}

export const achievementRepository = new AchievementRepository()
