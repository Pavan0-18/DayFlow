import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dailyLogRepository } from "@/lib/repositories"
import { checkRateLimit } from "@/lib/rate-limit"
import { fromDateKey, toDateKey } from "@/lib/date-utils"

// GET /api/logs?date=... - Get daily log for a specific date
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")
    const normalizedDate = dateParam ? fromDateKey(dateParam) : fromDateKey(toDateKey(new Date()))

    const log = await dailyLogRepository.findOrCreate(session.user.id, normalizedDate)
    return NextResponse.json({ data: log })
  } catch (error) {
    console.error("Error fetching daily log:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily log" },
      { status: 500 }
    )
  }
}
