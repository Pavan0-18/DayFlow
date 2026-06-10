import { db } from '../db'

export interface StreakInfo {
  currentStreak: number
  bestStreak: number
  isAtRisk: boolean
  lastCompletedDate: Date | null
}

export class StreakService {
  async getStreakInfo(userId: string): Promise<StreakInfo> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { date: 'desc' },
    })

    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0
    let lastCompletedDate: Date | null = null
    let lastDate: Date | null = null

    for (const log of logs) {
      const completed = log.items.filter((i) => i.completed).length
      const total = log.items.length
      const hasActivity = total > 0
      const isComplete = hasActivity && completed / total >= 0.7

      if (isComplete && !lastCompletedDate) {
        lastCompletedDate = log.date
      }

      if (hasActivity) {
        if (lastDate) {
          const diffDays = Math.floor((lastDate.getTime() - log.date.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays === 1 && isComplete) {
            tempStreak++
          } else if (diffDays === 1 && !isComplete) {
            bestStreak = Math.max(bestStreak, tempStreak)
            tempStreak = 0
          } else if (diffDays > 1) {
            bestStreak = Math.max(bestStreak, tempStreak)
            tempStreak = isComplete ? 1 : 0
          }
        } else if (isComplete) {
          tempStreak = 1
        }
        lastDate = log.date
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak)

    // Calculate current streak from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let checkDate = new Date(today)

    for (const log of logs) {
      const logDate = new Date(log.date)
      logDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        const completed = log.items.filter((i) => i.completed).length
        const total = log.items.length
        if (total > 0 && completed / total >= 0.7) {
          currentStreak++
          checkDate = new Date(logDate)
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (diffDays === 0) {
          continue
        } else {
          break
        }
      } else {
        break
      }
    }

    // Check if streak is at risk (no completion today and yesterday)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayLog = logs.find((l) => {
      const d = new Date(l.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime()
    })

    const yesterdayLog = logs.find((l) => {
      const d = new Date(l.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === yesterday.getTime()
    })

    const isAtRisk = currentStreak > 0 && (!yesterdayLog || yesterdayLog.items.filter((i) => i.completed).length === 0)

    return {
      currentStreak,
      bestStreak,
      isAtRisk,
      lastCompletedDate,
    }
  }

  async getLongestStreak(userId: string): Promise<number> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { date: 'asc' },
    })

    let longestStreak = 0
    let currentStreak = 0

    for (const log of logs) {
      const completed = log.items.filter((i) => i.completed).length
      const total = log.items.length

      if (total > 0 && completed / total >= 0.7) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    return longestStreak
  }
}

export const streakService = new StreakService()
