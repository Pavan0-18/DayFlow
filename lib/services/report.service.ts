import { reportRepository, dailyLogRepository, taskRepository } from '../repositories'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns'

export interface DashboardStats {
  todayCompleted: number
  todayTotal: number
  todayPercentage: number
  currentStreak: number
  bestStreak: number
  weeklyAverage: number
  totalTasks: number
}

export interface CategoryBreakdown {
  category: string
  completed: number
  total: number
  percentage: number
}

export class ReportService {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayLog = await dailyLogRepository.findOrCreate(userId, today)
    const todayCompleted = todayLog?.items.filter((i) => i.completed).length ?? 0
    const todayTotal = todayLog?.items.length ?? 0
    const todayPercentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0

    const streakData = await reportRepository.getStreakData(userId)
    const activeTasks = await taskRepository.countActive(userId)

    // Get weekly average
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    const weeklyLogs = await dailyLogRepository.findByDateRange(userId, weekStart, weekEnd)

    const weeklyRates = weeklyLogs.map((log) => {
      const completed = log.items.filter((i) => i.completed).length
      const total = log.items.length
      return total > 0 ? (completed / total) * 100 : 0
    })

    const weeklyAverage = weeklyRates.length > 0
      ? Math.round(weeklyRates.reduce((a, b) => a + b, 0) / weeklyRates.length)
      : 0

    return {
      todayCompleted,
      todayTotal,
      todayPercentage,
      currentStreak: streakData.currentStreak,
      bestStreak: streakData.bestStreak,
      weeklyAverage,
      totalTasks: activeTasks,
    }
  }

  async getCategoryBreakdown(userId: string, days: number = 30): Promise<CategoryBreakdown[]> {
    const startDate = subDays(new Date(), days)
    startDate.setHours(0, 0, 0, 0)

    const logs = await dailyLogRepository.findByDateRange(userId, startDate, new Date())

    const categoryStats: Record<string, { completed: number; total: number }> = {}

    logs.forEach((log) => {
      log.items.forEach((item) => {
        const category = item.task.category
        if (!categoryStats[category]) {
          categoryStats[category] = { completed: 0, total: 0 }
        }
        categoryStats[category].total++
        if (item.completed) {
          categoryStats[category].completed++
        }
      })
    })

    return Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        completed: stats.completed,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }

  async getMostSkippedTasks(userId: string, days: number = 30): Promise<{ taskId: string; title: string; skips: number }[]> {
    const startDate = subDays(new Date(), days)
    startDate.setHours(0, 0, 0, 0)

    const logs = await dailyLogRepository.findByDateRange(userId, startDate, new Date())

    const skipStats: Record<string, { title: string; skips: number }> = {}

    logs.forEach((log) => {
      log.items.forEach((item) => {
        if (!item.completed) {
          const taskId = item.task.id
          if (!skipStats[taskId]) {
            skipStats[taskId] = { title: item.task.title, skips: 0 }
          }
          skipStats[taskId].skips++
        }
      })
    })

    return Object.entries(skipStats)
      .map(([taskId, stats]) => ({ taskId, title: stats.title, skips: stats.skips }))
      .sort((a, b) => b.skips - a.skips)
      .slice(0, 5)
  }

  async getDayOfWeekPerformance(userId: string): Promise<Record<number, number>> {
    const startDate = subDays(new Date(), 90)
    startDate.setHours(0, 0, 0, 0)

    const logs = await dailyLogRepository.findByDateRange(userId, startDate, new Date())

    const dayStats: Record<number, { total: number; completed: number }> = {
      0: { total: 0, completed: 0 },
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
      5: { total: 0, completed: 0 },
      6: { total: 0, completed: 0 },
    }

    logs.forEach((log) => {
      const dayOfWeek = log.date.getDay()
      const completed = log.items.filter((i) => i.completed).length
      const total = log.items.length

      dayStats[dayOfWeek].total += total
      dayStats[dayOfWeek].completed += completed
    })

    const performance: Record<number, number> = {}
    for (let i = 0; i < 7; i++) {
      const stats = dayStats[i]
      performance[i] = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }

    return performance
  }
}

export const reportService = new ReportService()
