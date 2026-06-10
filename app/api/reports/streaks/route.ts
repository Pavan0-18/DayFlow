import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { reportRepository } from "@/lib/repositories"
import { checkRateLimit } from "@/lib/rate-limit"

// GET /api/reports/streaks - Get streak data
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

    const streakData = await reportRepository.getStreakData(session.user.id)
    return NextResponse.json({ data: streakData })
  } catch (error) {
    console.error("Error fetching streaks:", error)
    return NextResponse.json(
      { error: "Failed to fetch streaks" },
      { status: 500 }
    )
  }
}
