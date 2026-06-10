import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dailyLogRepository } from "@/lib/repositories"
import { toggleLogItemSchema } from "@/lib/validations/log.schema"
import { checkRateLimit } from "@/lib/rate-limit"
import { fromDateKey } from "@/lib/date-utils"
import { achievementService } from "@/lib/services"

// POST /api/logs/toggle - Toggle a task completion
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await req.json()
    const parsed = toggleLogItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { taskId, date, completed } = parsed.data
    const normalizedDate = fromDateKey(date)

    const log = await dailyLogRepository.findOrCreate(session.user.id, normalizedDate)
    await dailyLogRepository.toggleItem(session.user.id, log.id, taskId, completed)

    let unlockedAchievements: Awaited<
      ReturnType<typeof achievementService.checkAndUnlockAchievements>
    > = []
    try {
      unlockedAchievements = await achievementService.checkAndUnlockAchievements(
        session.user.id
      )
    } catch (achievementError) {
      console.error("Achievement check failed:", achievementError)
    }

    return NextResponse.json({
      data: { success: true },
      achievements: unlockedAchievements,
    })
  } catch (error) {
    console.error("Error toggling task:", error)
    return NextResponse.json(
      { error: "Failed to toggle task" },
      { status: 500 }
    )
  }
}
