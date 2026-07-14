import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { settingsRepository } from "@/lib/repositories"

export const GET = withAuth(withRateLimit(async (_req, { userId }) => {
  const settings = await settingsRepository.findOrCreate(userId)
  return NextResponse.json({ data: settings })
}))

export const PATCH = withAuth(withRateLimit(async (req, { userId }) => {
  const body = await req.json()
  const settings = await settingsRepository.update(userId, body)
  return NextResponse.json({ data: settings })
}))
