import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { dailyLogRepository } from "@/lib/repositories"
import { achievementService } from "@/lib/services"
import { toggleLogItemSchema } from "@/lib/validations/log.schema"
import { fromDateKey } from "@/lib/date-utils"

export const POST = withAuth(withRateLimit(withValidation(toggleLogItemSchema, async (req, { userId, body }) => {
  const { taskId, date, completed } = body
  const normalizedDate = fromDateKey(date)
  const log = await dailyLogRepository.findOrCreate(userId, normalizedDate)
  await dailyLogRepository.toggleItem(userId, log.id, taskId, completed)
  let unlockedAchievements: Awaited<ReturnType<typeof achievementService.checkAndUnlockAchievements>> = []
  try {
    unlockedAchievements = await achievementService.checkAndUnlockAchievements(userId)
  } catch (achievementError) {
    console.error("Achievement check failed:", achievementError)
  }
  return NextResponse.json({
    data: { success: true },
    achievements: unlockedAchievements,
  })
})))
