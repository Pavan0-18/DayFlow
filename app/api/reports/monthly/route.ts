import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { reportRepository } from "@/lib/repositories"
import { startOfDay } from "date-fns"

export const GET = withAuth(withRateLimit(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get("date")
  const date = dateParam ? new Date(dateParam) : new Date()
  const normalizedDate = startOfDay(date)
  const report = await reportRepository.getMonthlyReport(userId, normalizedDate)
  return NextResponse.json({ data: report })
}))
