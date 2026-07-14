import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { scheduleRepository } from "@/lib/repositories"
import { updateScheduledTaskSchema } from "@/lib/validations/schedule.schema"

export const PATCH = withAuth(withRateLimit(withValidation(updateScheduledTaskSchema, async (req, { userId, params, body }) => {
  const { id: _id, ...updateData } = body
  const scheduledTask = await scheduleRepository.update(params.id, updateData, userId)
  return NextResponse.json({ data: scheduledTask })
})))

export const DELETE = withAuth(withRateLimit(async (_req, { userId, params }) => {
  await scheduleRepository.delete(params.id, userId)
  return NextResponse.json({ success: true })
}))
