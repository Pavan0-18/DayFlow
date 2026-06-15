import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    await db.$transaction(async (tx) => {
      await tx.dailyLogItem.deleteMany({
        where: { dailyLog: { userId } },
      })
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
  } catch (error) {
    console.error("Account deletion failed:", error)
    return NextResponse.json({ error: "Account deletion failed" }, { status: 500 })
  }
}
