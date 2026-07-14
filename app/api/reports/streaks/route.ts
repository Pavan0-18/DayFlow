import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { reportRepository } from "@/lib/repositories"

export const GET = withAuth(withRateLimit(async (_req, { userId }) => {
  const streakData = await reportRepository.getStreakData(userId)
  return NextResponse.json({ data: streakData })
}))
