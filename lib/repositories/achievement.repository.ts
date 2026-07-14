import { db } from '../db'
import { UserAchievement } from '@prisma/client'
import { ACHIEVEMENTS } from '../constants/achievements'
import { startOfDay } from 'date-fns'

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
    const [userAchievements, allLogs, totalCompleted] = await Promise.all([
      db.userAchievement.findMany({ where: { userId } }),
      db.dailyLog.findMany({
        where: { userId },
        include: {
          items: {
            include: { task: { select: { category: true } } },
          },
        },
        orderBy: { date: 'desc' },
      }),
      db.dailyLogItem.count({
        where: { dailyLog: { userId }, completed: true },
      }),
    ])

    const today = startOfDay(new Date())
    const todayLog = allLogs.find((l) => startOfDay(new Date(l.date)).getTime() === today.getTime())
    const todayItems = todayLog?.items ?? []

    const completedByCategoryToday = todayItems
      .filter((i) => i.completed)
      .reduce((acc, i) => {
        acc.add(i.task.category)
        return acc
      }, new Set<string>())

    const prevLogs = allLogs.filter((l) => startOfDay(new Date(l.date)).getTime() < today.getTime())
    const multiCategoryDays = prevLogs.filter((l) => {
      const cats = new Set(l.items.filter((i) => i.completed).map((i) => i.task.category))
      return cats.size >= 5
    }).length

    const earlyCompletions = todayItems.filter(
      (i) => i.completed && i.completedAt && new Date(i.completedAt).getHours() < 12
    ).length

    const earlyTasks = todayItems.filter(
      (i) => i.completed && i.completedAt && new Date(i.completedAt).getHours() < 7
    ).length

    const lateTasks = todayItems.filter(
      (i) => i.completed && i.completedAt && new Date(i.completedAt).getHours() >= 22
    ).length

    const completedLogs = allLogs.map((l) => ({
      date: l.date,
      completed: l.items.filter((i) => i.completed).length,
      total: l.items.length,
      completedTaskIds: new Set(l.items.filter((i) => i.completed).map((i) => i.taskId)),
      allTaskIds: new Set(l.items.map((i) => i.taskId)),
    }))

    const { currentStreak, bestStreak, perfectDays } = computeStreaks(completedLogs)

    const taskStreaks = computeTaskStreaks(completedLogs)

    const hasComeback = allLogs.length >= 2 && (() => {
      const dates = allLogs.map((l) => startOfDay(new Date(l.date)).getTime())
      for (let i = 1; i < dates.length; i++) {
        if ((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24) >= 7) return true
      }
      return false
    })()

    const daysTracked = allLogs.length

    const allAchievements = ACHIEVEMENTS.map((achievement) => {
      const unlocked = userAchievements.find((ua) => ua.achievementId === achievement.id)
      const progress = unlocked
        ? achievement.requirement
        : computeProgress(achievement, {
            currentStreak, bestStreak, perfectDays, totalCompleted,
            earlyCompletions, earlyTasks, lateTasks, multiCategoryDays,
            taskStreaks, hasComeback, daysTracked, completedByCategoryToday,
          })
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
        progress: Math.min(progress, achievement.requirement),
        target: achievement.requirement,
      }
    })

    return allAchievements
  }

  async findAllByUserBasic(userId: string): Promise<AchievementWithProgress[]> {
    const userAchievements = await db.userAchievement.findMany({ where: { userId } })
    return ACHIEVEMENTS.map((achievement) => {
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

type ProgressInput = {
  currentStreak: number
  bestStreak: number
  perfectDays: number
  totalCompleted: number
  earlyCompletions: number
  earlyTasks: number
  lateTasks: number
  multiCategoryDays: number
  taskStreaks: number[]
  hasComeback: boolean
  daysTracked: number
  completedByCategoryToday: Set<string>
}

function computeProgress(achievement: typeof ACHIEVEMENTS[number], input: ProgressInput): number {
  switch (achievement.condition) {
    case 'streak': return input.currentStreak
    case 'perfect_days': return input.perfectDays
    case 'total_tasks': return input.totalCompleted
    case 'early_completion': return input.earlyCompletions
    case 'early_task': return input.earlyTasks
    case 'late_task': return input.lateTasks
    case 'multi_category': return input.multiCategoryDays + (input.completedByCategoryToday.size >= 5 ? 1 : 0)
    case 'task_streak': return Math.max(...input.taskStreaks, 0)
    case 'comeback': return input.hasComeback ? 1 : 0
    case 'days_tracked': return input.daysTracked
    default: return 0
  }
}

function computeStreaks(
  completedLogs: { completed: number; total: number; date: Date }[]
) {
  let bestStreak = 0
  let tempStreak = 0
  let perfectDays = 0
  let lastDate: Date | null = null

  for (const log of completedLogs) {
    const isPerfect = log.total > 0 && log.completed === log.total
    if (isPerfect) perfectDays++

    if (log.total > 0 && log.completed / log.total >= 0.7) {
      if (lastDate) {
        const diffDays = Math.floor((lastDate.getTime() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) tempStreak++
        else { bestStreak = Math.max(bestStreak, tempStreak); tempStreak = 1 }
      } else tempStreak = 1
      lastDate = log.date
    } else {
      bestStreak = Math.max(bestStreak, tempStreak)
      tempStreak = 0
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak)

  const today = startOfDay(new Date())
  let checkDate = new Date(today)
  let currentStreak = 0

  for (const log of completedLogs) {
    const logDate = startOfDay(new Date(log.date))
    const diffDays = Math.floor((checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 1) {
      if (log.total > 0 && log.completed / log.total >= 0.7) {
        if (diffDays === 0 || diffDays === 1) {
          currentStreak++
          checkDate = new Date(logDate)
          checkDate.setDate(checkDate.getDate() - 1)
        }
      } else if (diffDays === 0) continue
      else break
    } else break
  }

  return { currentStreak, bestStreak, perfectDays }
}

function computeTaskStreaks(
  completedLogs: { completedTaskIds: Set<string>; allTaskIds: Set<string> }[]
) {
  const taskStreaks: Record<string, number> = {}
  for (const log of completedLogs) {
    for (const taskId of log.completedTaskIds) {
      taskStreaks[taskId] = (taskStreaks[taskId] || 0) + 1
    }
    for (const [taskId] of Object.entries(taskStreaks)) {
      if (!log.completedTaskIds.has(taskId)) {
        taskStreaks[taskId] = 0
      }
    }
  }
  return Object.values(taskStreaks)
}

export const achievementRepository = new AchievementRepository()
