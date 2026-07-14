import { NextResponse } from "next/server"
import { authenticated } from "@/lib/api-middleware"
import { db } from "@/lib/db"
import { startOfDay, startOfWeek, endOfWeek } from "date-fns"

export const GET = authenticated(async (_req, { userId }) => {
  const today = startOfDay(new Date())

  const [dailyLog, tasks, streaks, achievements, settings] = await Promise.all([
    db.dailyLog.findUnique({
      where: { userId_date: { userId, date: today } },
      include: {
        items: {
          include: {
            task: { select: { id: true, title: true, color: true, icon: true, category: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    db.task.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    }),
    getStreakData(userId),
    db.userAchievement.findMany({ where: { userId } }),
    db.userSettings.findUnique({ where: { userId } }),
  ])

  const completedCount = dailyLog?.items.filter((i) => i.completed).length ?? 0
  const totalCount = dailyLog?.items.length ?? 0
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const activeTasks = tasks.filter((t) => t.isActive)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weeklyLogs = await db.dailyLog.findMany({
    where: { userId, date: { gte: weekStart, lte: weekEnd } },
    include: { items: true },
  })
  const weeklyRates = weeklyLogs.map((log) => {
    const c = log.items.filter((i) => i.completed).length
    const t = log.items.length
    return t > 0 ? (c / t) * 100 : 0
  })
  const weeklyAverage = weeklyRates.length > 0
    ? Math.round(weeklyRates.reduce((a, b) => a + b, 0) / weeklyRates.length)
    : 0

  return NextResponse.json({
    data: {
      log: dailyLog ?? null,
      items: dailyLog?.items ?? [],
      completedCount,
      totalCount,
      completionPercentage,
      tasks,
      activeTasks,
      inactiveTasks: tasks.filter((t) => !t.isActive),
      streaks,
      achievements,
      settings,
      weeklyAverage,
    },
  })
})

async function getStreakData(userId: string) {
  const logs = await db.dailyLog.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { date: "desc" },
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
    if (isPerfect) perfectDays++

    if (total > 0 && completed / total >= 0.7) {
      if (lastDate) {
        const diffDays = Math.floor((lastDate.getTime() - log.date.getTime()) / (1000 * 60 * 60 * 24))
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
  for (const log of logs) {
    const logDate = startOfDay(new Date(log.date))
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
      } else if (diffDays === 0) continue
      else break
    } else break
  }

  return { currentStreak, bestStreak, perfectDays }
}
