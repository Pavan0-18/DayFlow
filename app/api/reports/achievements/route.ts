import { NextResponse } from "next/server"
import { authenticated } from "@/lib/api-middleware"
import { achievementRepository } from "@/lib/repositories"

export const GET = authenticated(async (_req, { userId }) => {
  const achievements = await achievementRepository.findAllByUser(userId)
  return NextResponse.json({ data: achievements })
})
