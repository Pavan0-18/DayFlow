import { NextResponse } from "next/server"
import { withAuth } from "@/lib/api-middleware"
import { db } from "@/lib/db"

export const DELETE = withAuth(async (_req, { userId }) => {
  await db.$transaction(async (tx) => {
    await tx.dailyLogItem.deleteMany({ where: { dailyLog: { userId } } })
    await tx.dailyLog.deleteMany({ where: { userId } })
    await tx.scheduledTask.deleteMany({ where: { userId } })
    await tx.task.deleteMany({ where: { userId } })
    await tx.userAchievement.deleteMany({ where: { userId } })
    await tx.userSettings.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })
    await tx.account.deleteMany({ where: { userId } })
    await tx.user.delete({ where: { id: userId } })
  })
  return NextResponse.json({ success: true })
})
