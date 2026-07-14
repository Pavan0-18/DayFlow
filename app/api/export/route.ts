import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { db } from "@/lib/db"

export const GET = withAuth(withRateLimit(async (_req, { userId }) => {
  const [tasks, dailyLogs, achievements, settings, user] = await Promise.all([
    db.task.findMany({ where: { userId }, orderBy: { sortOrder: "asc" } }),
    db.dailyLog.findMany({
      where: { userId },
      include: {
        items: {
          include: { task: { select: { id: true, title: true, category: true } } },
        },
      },
      orderBy: { date: "asc" },
    }),
    db.userAchievement.findMany({ where: { userId }, orderBy: { unlockedAt: "asc" } }),
    db.userSettings.findUnique({ where: { userId } }),
    db.user.findUnique({ where: { id: userId }, select: { email: true } }),
  ])

  let csv = "=== DayFlow Export ===\n\n"
  csv += `Exported: ${new Date().toISOString()}\n`
  csv += `User: ${user?.email ?? userId}\n\n`
  csv += "--- Tasks ---\n"
  csv += "id,title,description,category,color,icon,isActive,sortOrder\n"
  for (const t of tasks) {
    csv += `${t.id},"${t.title}","${(t.description ?? "").replace(/"/g, '""')}",${t.category},${t.color},${t.icon},${t.isActive},${t.sortOrder}\n`
  }
  csv += "\n--- Daily Logs ---\n"
  csv += "date,taskId,taskTitle,category,completed,completedAt\n"
  for (const log of dailyLogs) {
    for (const item of log.items) {
      csv += `${log.date.toISOString().split("T")[0]},${item.taskId},"${item.task.title}",${item.task.category},${item.completed},${item.completedAt?.toISOString() ?? ""}\n`
    }
  }
  csv += "\n--- Achievements ---\n"
  csv += "achievementId,unlockedAt\n"
  for (const a of achievements) {
    csv += `${a.achievementId},${a.unlockedAt.toISOString()}\n`
  }
  if (settings) {
    csv += `\n--- Settings ---\n`
    csv += `theme,${settings.theme}\n`
    csv += `weekStartDay,${settings.weekStartDay}\n`
    csv += `reminderTime,${settings.reminderTime}\n`
    csv += `reminderEnabled,${settings.reminderEnabled}\n`
    csv += `eveningSummary,${settings.eveningSummary}\n`
    csv += `achievementAlerts,${settings.achievementAlerts}\n`
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="dayflow-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}))
