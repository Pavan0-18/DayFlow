import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { scheduleRepository } from "@/lib/repositories"

export const PATCH = withAuth(withRateLimit(async (req, { userId, params }) => {
  const body = await req.json()
  const scheduledTask = await scheduleRepository.update(params.id, body, userId)
  return NextResponse.json({ data: scheduledTask })
}))

export const DELETE = withAuth(withRateLimit(async (_req, { userId, params }) => {
  await scheduleRepository.delete(params.id, userId)
  return NextResponse.json({ success: true })
}))
