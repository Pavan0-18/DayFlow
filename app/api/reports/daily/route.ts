import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { reportRepository } from "@/lib/repositories"
import { reportService } from "@/lib/services"
import { checkRateLimit } from "@/lib/rate-limit"
import { startOfDay } from "date-fns"

// GET /api/reports/daily?date=... - Get daily report
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

    if (!dateParam) {
      const stats = await reportService.getDashboardStats(session.user.id)
      return NextResponse.json({ data: stats })
    }

    const date = new Date(dateParam)
    const normalizedDate = startOfDay(date)
    const report = await reportRepository.getDailyReport(session.user.id, normalizedDate)
    return NextResponse.json({ data: report })
  } catch (error) {
    console.error("Error fetching daily report:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily report" },
      { status: 500 }
    )
  }
}
