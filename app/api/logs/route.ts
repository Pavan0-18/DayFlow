import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { dailyLogRepository } from "@/lib/repositories"
import { fromDateKey, toDateKey } from "@/lib/date-utils"

export const GET = withAuth(withRateLimit(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get("date")
  const normalizedDate = dateParam ? fromDateKey(dateParam) : fromDateKey(toDateKey(new Date()))
  const log = await dailyLogRepository.findOrCreate(userId, normalizedDate)
  return NextResponse.json({ data: log })
}))
