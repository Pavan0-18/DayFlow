import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { taskRepository, dailyLogRepository } from "@/lib/repositories"
import { updateTaskSchema } from "@/lib/validations/task.schema"
import { startOfDay } from "date-fns"

export const GET = withAuth(withRateLimit(async (_req, { userId, params }) => {
  const task = await taskRepository.findById(params.id, userId)
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
  return NextResponse.json({ data: task })
}))

export const PATCH = withAuth(withRateLimit(withValidation(updateTaskSchema, async (req, { userId, params, body }) => {
  const { id: _id, ...updateData } = body
  const task = await taskRepository.update(params.id, updateData, userId)
  if (updateData.isActive !== false) {
    const today = startOfDay(new Date())
    const log = await dailyLogRepository.findOrCreate(userId, today)
    await dailyLogRepository.syncActiveTasks(userId, today, log)
  }
  return NextResponse.json({ data: task })
})))

export const DELETE = withAuth(withRateLimit(async (_req, { userId, params }) => {
  await taskRepository.delete(params.id, userId)
  return NextResponse.json({ success: true })
}))
