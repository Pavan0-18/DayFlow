import { db } from '../db'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

export interface DailyReport {
  date: Date
  completionRate: number
  completedTasks: number
  totalTasks: number
  dayScore: number
}

export interface WeeklyReport {
  weekStart: Date
  weekEnd: Date
  dailyRates: { date: Date; rate: number }[]
  averageRate: number
  bestDay: { date: Date; rate: number } | null
  worstDay: { date: Date; rate: number } | null
  totalCompleted: number
  consistencyScore: number
}

export interface MonthlyReport {
  month: Date
  dailyRates: { date: Date; rate: number }[]
  averageRate: number
  totalCompleted: number
  bestWeek: { start: Date; rate: number } | null
  topCompleted: { taskId: string; title: string; count: number }[]
  topMissed: { taskId: string; title: string; count: number }[]
}

export class ReportRepository {
  async getDailyReport(userId: string, date: Date): Promise<DailyReport> {
    const log = await db.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      include: {
        items: true,
      },
    })

    if (!log) {
      return {
        date,
        completionRate: 0,
        completedTasks: 0,
        totalTasks: 0,
        dayScore: 0,
      }
    }

    const completedTasks = log.items.filter((i) => i.completed).length
    const totalTasks = log.items.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Day score = completion rate (schedule adherence would require more complex logic)
    const dayScore = completionRate

    return {
      date,
      completionRate,
      completedTasks,
      totalTasks,
      dayScore,
    }
  }

  async getWeeklyReport(userId: string, date: Date): Promise<WeeklyReport> {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

    const logs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        items: true,
      },
    })

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const dailyRates = days.map((day) => {
      const log = logs.find((l) => l.date.toDateString() === day.toDateString())
      const completed = log?.items.filter((i) => i.completed).length ?? 0
      const total = log?.items.length ?? 0
      return {
        date: day,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })

    const averageRate = dailyRates.length > 0
      ? Math.round(dailyRates.reduce((sum, d) => sum + d.rate, 0) / dailyRates.length)
      : 0

    const sortedByRate = [...dailyRates].sort((a, b) => b.rate - a.rate)
    const bestDay = sortedByRate[0]
    const worstDay = sortedByRate[sortedByRate.length - 1]

    const totalCompleted = logs.reduce((sum, log) => sum + log.items.filter((i) => i.completed).length, 0)

    const daysWithGoodCompletion = dailyRates.filter((d) => d.rate >= 70).length
    const consistencyScore = Math.round((daysWithGoodCompletion / 7) * 100)

    return {
      weekStart,
      weekEnd,
      dailyRates,
      averageRate,
      bestDay,
      worstDay,
      totalCompleted,
      consistencyScore,
    }
  }

  async getMonthlyReport(userId: string, date: Date): Promise<MonthlyReport> {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    const logs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        items: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const dailyRates = days.map((day) => {
      const log = logs.find((l) => l.date.toDateString() === day.toDateString())
      const completed = log?.items.filter((i) => i.completed).length ?? 0
      const total = log?.items.length ?? 0
      return {
        date: day,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })

    const averageRate = dailyRates.length > 0
      ? Math.round(dailyRates.reduce((sum, d) => sum + d.rate, 0) / dailyRates.length)
      : 0

    const totalCompleted = logs.reduce((sum, log) => sum + log.items.filter((i) => i.completed).length, 0)

    // Calculate best week
    const weeks: { start: Date; totalRate: number; count: number }[] = []
    for (let i = 0; i < dailyRates.length; i += 7) {
      const weekDays = dailyRates.slice(i, i + 7)
      const activeWeekDays = weekDays.filter((d) => d.rate > 0)
      if (activeWeekDays.length > 0) {
        weeks.push({
          start: weekDays[0].date,
          totalRate: activeWeekDays.reduce((sum, d) => sum + d.rate, 0),
          count: activeWeekDays.length,
        })
      }
    }
    const bestWeek = weeks.length > 0
      ? weeks.sort((a, b) => b.totalRate / b.count - a.totalRate / a.count)[0]
      : null

    // Top completed tasks
    const taskStats: Record<string, { title: string; completed: number; missed: number }> = {}
    logs.forEach((log) => {
      log.items.forEach((item) => {
        if (!taskStats[item.task.id]) {
          taskStats[item.task.id] = { title: item.task.title, completed: 0, missed: 0 }
        }
        if (item.completed) {
          taskStats[item.task.id].completed++
        } else {
          taskStats[item.task.id].missed++
        }
      })
    })

    const topCompleted = Object.entries(taskStats)
      .sort((a, b) => b[1].completed - a[1].completed)
      .slice(0, 5)
      .map(([taskId, stats]) => ({ taskId, title: stats.title, count: stats.completed }))

    const topMissed = Object.entries(taskStats)
      .sort((a, b) => b[1].missed - a[1].missed)
      .slice(0, 5)
      .map(([taskId, stats]) => ({ taskId, title: stats.title, count: stats.missed }))

    return {
      month: date,
      dailyRates,
      averageRate,
      totalCompleted,
      bestWeek: bestWeek ? { start: bestWeek.start, rate: Math.round(bestWeek.totalRate / bestWeek.count) } : null,
      topCompleted,
      topMissed,
    }
  }

  async getStreakData(userId: string): Promise<{ currentStreak: number; bestStreak: number; perfectDays: number }> {
    const logs = await db.dailyLog.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { date: 'desc' },
    })

    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0
    let perfectDays = 0
    let lastDate: Date | null = null

    for (const log of logs) {
      const completed = log.items.filter((i) => i.completed).length
      const total = log.items.length
      const isPerfect = total > 0 && completed === total

      if (isPerfect) {
        perfectDays++
      }

      if (total > 0 && completed / total >= 0.7) {
        if (lastDate) {
          const diffDays = Math.floor((lastDate.getTime() - log.date.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays === 1) {
            tempStreak++
          } else {
            bestStreak = Math.max(bestStreak, tempStreak)
            tempStreak = 1
          }
        } else {
          tempStreak = 1
        }
        lastDate = log.date
      } else {
        bestStreak = Math.max(bestStreak, tempStreak)
        tempStreak = 0
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak)

    // Calculate current streak (from today backwards)
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
          if (diffDays === 0 || diffDays === 1) {
            currentStreak++
            checkDate = new Date(logDate)
            checkDate.setDate(checkDate.getDate() - 1)
          }
        } else if (diffDays === 0) {
          // Today not complete yet, continue checking
          continue
        } else {
          break
        }
      } else {
        break
      }
    }

    return { currentStreak, bestStreak, perfectDays }
  }
}

export const reportRepository = new ReportRepository()
