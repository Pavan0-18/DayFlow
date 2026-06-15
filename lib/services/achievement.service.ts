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

    for (const achievement of ACHIEVEMENTS) {
      let met = false
      switch (achievement.condition) {
        case 'streak':
          met = currentStreak >= achievement.requirement
          break
        case 'perfect_days':
          met = perfectDays >= achievement.requirement
          break
        case 'total_tasks':
          met = totalCompleted >= achievement.requirement
          break
        case 'early_completion':
          met = await this.checkEarlyCompletion(userId, achievement.requirement)
          break
        case 'early_task':
          met = await this.checkEarlyTask(userId, achievement.requirement)
          break
        case 'late_task':
          met = await this.checkLateTask(userId, achievement.requirement)
          break
        case 'multi_category':
          met = await this.checkMultiCategory(userId, achievement.requirement)
          break
        case 'task_streak':
          met = await this.checkTaskStreak(userId, achievement.requirement)
          break
        case 'comeback':
          met = await this.checkComeback(userId)
          break
        case 'days_tracked':
          met = await this.checkDaysTracked(userId, achievement.requirement)
          break
      }
      if (met) {
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

    return unlocked
  }

  private async checkEarlyCompletion(userId: string, required: number): Promise<boolean> {
    const count = await db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
        completedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    })
    return count >= required
  }

  private async checkEarlyTask(userId: string, required: number): Promise<boolean> {
    const today7am = new Date()
    today7am.setHours(7, 0, 0, 0)
    const count = await db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
        completedAt: { lte: today7am },
      },
    })
    return count >= required
  }

  private async checkLateTask(userId: string, required: number): Promise<boolean> {
    const count = await db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
        completedAt: {
          gte: new Date(new Date().setHours(22, 0, 0, 0)),
        },
      },
    })
    return count >= required
  }

  private async checkMultiCategory(userId: string, required: number): Promise<boolean> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: {
        items: {
          where: { completed: true },
          include: { task: { select: { category: true } } },
        },
      },
    })
    let multiCategoryDays = 0
    for (const log of logs) {
      const categories = new Set(log.items.map((i) => i.task.category))
      if (categories.size >= 5) multiCategoryDays++
    }
    return multiCategoryDays >= required
  }

  private async checkTaskStreak(userId: string, required: number): Promise<boolean> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: {
        items: {
          where: { completed: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { date: 'desc' },
    })
    const taskStreaks: Record<string, number> = {}
    for (const log of logs) {
      const completedTaskIds = Array.from(new Set(log.items.filter((i) => i.completed).map((i) => i.taskId)))
      for (const taskId of completedTaskIds) {
        taskStreaks[taskId] = (taskStreaks[taskId] || 0) + 1
      }
      const notCompletedTaskIds = new Set(
        log.items.filter((i) => !i.completed).map((i) => i.taskId)
      )
      for (const taskId of Object.keys(taskStreaks)) {
        if (notCompletedTaskIds.has(taskId)) {
          taskStreaks[taskId] = 0
        }
      }
    }
    return Object.values(taskStreaks).some((streak) => streak >= required)
  }

  private async checkComeback(userId: string): Promise<boolean> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 2,
    })
    if (logs.length < 2) return false
    const diffDays = Math.floor(
      (logs[0].date.getTime() - logs[1].date.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diffDays >= 7
  }

  private async checkDaysTracked(userId: string, required: number): Promise<boolean> {
    const count = await db.dailyLog.count({
      where: { userId },
    })
    return count >= required
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
      case 'early_completion':
        return Math.min(await this.checkEarlyCompletionCount(userId), achievement.requirement)
      case 'early_task':
        return Math.min(await this.checkEarlyTaskCount(userId), achievement.requirement)
      case 'late_task':
        return Math.min(await this.checkLateTaskCount(userId), achievement.requirement)
      case 'multi_category':
        return Math.min(await this.checkMultiCategoryCount(userId), achievement.requirement)
      case 'task_streak':
        return Math.min(await this.checkTaskStreakCount(userId), achievement.requirement)
      case 'days_tracked':
        const daysTracked = await db.dailyLog.count({ where: { userId } })
        return Math.min(daysTracked, achievement.requirement)
      default:
        return 0
    }
  }

  private async checkEarlyCompletionCount(userId: string): Promise<number> {
    return db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
        completedAt: { lte: new Date(new Date().setHours(12, 0, 0, 0)) },
      },
    })
  }

  private async checkEarlyTaskCount(userId: string): Promise<number> {
    return db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
        completedAt: { lte: new Date(new Date().setHours(7, 0, 0, 0)) },
      },
    })
  }

  private async checkLateTaskCount(userId: string): Promise<number> {
    return db.dailyLogItem.count({
      where: {
        dailyLog: { userId },
        completed: true,
        completedAt: { gte: new Date(new Date().setHours(22, 0, 0, 0)) },
      },
    })
  }

  private async checkMultiCategoryCount(userId: string): Promise<number> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: {
        items: {
          where: { completed: true },
          include: { task: { select: { category: true } } },
        },
      },
    })
    let count = 0
    for (const log of logs) {
      const categories = new Set(log.items.map((i) => i.task.category))
      if (categories.size >= 5) count++
    }
    return count
  }

  private async checkTaskStreakCount(userId: string): Promise<number> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: {
        items: {
          where: { completed: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { date: 'desc' },
    })
    const taskStreaks: Record<string, number> = {}
    for (const log of logs) {
      const completedTaskIds = Array.from(new Set(log.items.filter((i) => i.completed).map((i) => i.taskId)))
      for (const taskId of completedTaskIds) {
        taskStreaks[taskId] = (taskStreaks[taskId] || 0) + 1
      }
      const notCompletedTaskIds = new Set(
        log.items.filter((i) => !i.completed).map((i) => i.taskId)
      )
      for (const taskId of Object.keys(taskStreaks)) {
        if (notCompletedTaskIds.has(taskId)) {
          taskStreaks[taskId] = 0
        }
      }
    }
    return Math.max(...Object.values(taskStreaks), 0)
  }
}

export const achievementService = new AchievementService()
