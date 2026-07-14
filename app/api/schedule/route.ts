import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { scheduleRepository } from "@/lib/repositories"
import { createScheduledTaskSchema } from "@/lib/validations/schedule.schema"
import { startOfDay } from "date-fns"

export const GET = withAuth(withRateLimit(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get("date")
  const date = dateParam ? new Date(dateParam) : new Date()
  const normalizedDate = startOfDay(date)
  const scheduledTasks = await scheduleRepository.findByDate(userId, normalizedDate)
  return NextResponse.json({ data: scheduledTasks })
}))

export const POST = withAuth(withRateLimit(withValidation(createScheduledTaskSchema, async (req, { userId, body }) => {
  const normalizedDate = startOfDay(new Date(body.date))
  const conflicts = await scheduleRepository.checkConflicts(
    userId,
    normalizedDate,
    body.startTime,
    body.endTime
  )
  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: "Time conflict with existing task", conflicts },
      { status: 409 }
    )
  }
  const scheduledTask = await scheduleRepository.create(body, userId)
  return NextResponse.json({ data: scheduledTask }, { status: 201 })
})))
