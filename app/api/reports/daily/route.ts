import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { reportRepository } from "@/lib/repositories"
import { reportService } from "@/lib/services"
import { startOfDay } from "date-fns"

export const GET = withAuth(withRateLimit(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get("date")
  if (!dateParam) {
    const stats = await reportService.getDashboardStats(userId)
    return NextResponse.json({ data: stats })
  }
  const date = new Date(dateParam)
  const normalizedDate = startOfDay(date)
  const report = await reportRepository.getDailyReport(userId, normalizedDate)
  return NextResponse.json({ data: report })
}))
