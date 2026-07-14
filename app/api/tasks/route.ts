import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { taskRepository, dailyLogRepository } from "@/lib/repositories"
import { startOfDay } from "date-fns"
import { createTaskSchema } from "@/lib/validations/task.schema"

export const GET = withAuth(withRateLimit(async (_req, { userId }) => {
  const tasks = await taskRepository.findAllByUser(userId)
  return NextResponse.json({ data: tasks })
}))

export const POST = withAuth(withRateLimit(withValidation(createTaskSchema, async (_req, { userId, body }) => {
  const activeCount = await taskRepository.countActive(userId)
  if (activeCount >= 20) {
    return NextResponse.json(
      { error: "Maximum of 20 active tasks allowed" },
      { status: 400 }
    )
  }
  const task = await taskRepository.create({ ...body, isActive: body.isActive ?? true }, userId)
  if (task.isActive) {
    const today = startOfDay(new Date())
    const log = await dailyLogRepository.findOrCreate(userId, today)
    await dailyLogRepository.syncActiveTasks(userId, today, log)
  }
  return NextResponse.json({ data: task }, { status: 201 })
})))
