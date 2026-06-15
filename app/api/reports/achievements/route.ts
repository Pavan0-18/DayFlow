import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { achievementRepository } from "@/lib/repositories"
import { achievementService } from "@/lib/services"
import { checkRateLimit } from "@/lib/rate-limit"

// GET /api/reports/achievements - Get user achievements
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const achievements = await achievementRepository.findAllByUser(session.user.id)
    const enriched = await Promise.all(
      achievements.map(async (a) => ({
        ...a,
        progress: await achievementService.getProgress(session.user.id, a.achievementId),
      }))
    )
    return NextResponse.json({ data: enriched })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    )
  }
}
