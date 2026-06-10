import { achievementRepository, reportRepository } from '../repositories'
import { ACHIEVEMENTS } from '../constants/achievements'
import { db } from '../db'

export interface UnlockedAchievement {
  id: string
  emoji: string
  name: string
  description: string
}

export class AchievementService {
  async checkAndUnlockAchievements(userId: string): Promise<UnlockedAchievement[]> {
    const unlocked: UnlockedAchievement[] = []

    const { currentStreak, bestStreak, perfectDays } = await reportRepository.getStreakData(userId)
    const totalCompleted = await achievementRepository.getTotalCompleted(userId)

    // Check streak achievements
    const streakAchievements = ACHIEVEMENTS.filter((a) => a.condition === 'streak')
    for (const achievement of streakAchievements) {
      if (currentStreak >= achievement.requirement) {
        const wasUnlocked = await this.unlockAchievement(userId, achievement.id)
        if (wasUnlocked) {
          unlocked.push({
            id: achievement.id,
            emoji: achievement.emoji,
            name: achievement.name,
            description: achievement.description,
          })
        }
      }
    }

    // Check perfect days achievement
    const perfectAchievement = ACHIEVEMENTS.find((a) => a.id === 'perfect_10')
    if (perfectAchievement && perfectDays >= perfectAchievement.requirement) {
      const wasUnlocked = await this.unlockAchievement(userId, perfectAchievement.id)
      if (wasUnlocked) {
        unlocked.push({
          id: perfectAchievement.id,
          emoji: perfectAchievement.emoji,
          name: perfectAchievement.name,
          description: perfectAchievement.description,
        })
      }
    }

    // Check century tasks achievement
    const centuryAchievement = ACHIEVEMENTS.find((a) => a.id === 'century_tasks')
    if (centuryAchievement && totalCompleted >= centuryAchievement.requirement) {
      const wasUnlocked = await this.unlockAchievement(userId, centuryAchievement.id)
      if (wasUnlocked) {
        unlocked.push({
          id: centuryAchievement.id,
          emoji: centuryAchievement.emoji,
          name: centuryAchievement.name,
          description: centuryAchievement.description,
        })
      }
    }

    return unlocked
  }

  private async unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    const isAlreadyUnlocked = await achievementRepository.isUnlocked(userId, achievementId)
    if (isAlreadyUnlocked) return false

    const result = await achievementRepository.unlock(userId, achievementId)
    return !!result
  }

  async getProgress(userId: string, achievementId: string): Promise<number> {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
    if (!achievement) return 0

    const isUnlocked = await achievementRepository.isUnlocked(userId, achievementId)
    if (isUnlocked) return achievement.requirement

    const { currentStreak, perfectDays } = await reportRepository.getStreakData(userId)
    const totalCompleted = await achievementRepository.getTotalCompleted(userId)

    switch (achievement.condition) {
      case 'streak':
        return Math.min(currentStreak, achievement.requirement)
      case 'perfect_days':
        return Math.min(perfectDays, achievement.requirement)
      case 'total_tasks':
        return Math.min(totalCompleted, achievement.requirement)
      default:
        return 0
    }
  }
}

export const achievementService = new AchievementService()
