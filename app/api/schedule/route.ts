import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { scheduleRepository } from "@/lib/repositories"
import { startOfDay } from "date-fns"

export const GET = withAuth(withRateLimit(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get("date")
  const date = dateParam ? new Date(dateParam) : new Date()
  const normalizedDate = startOfDay(date)
  const scheduledTasks = await scheduleRepository.findByDate(userId, normalizedDate)
  return NextResponse.json({ data: scheduledTasks })
}))

export const POST = withAuth(withRateLimit(async (req, { userId }) => {
  const body = await req.json()
  const conflicts = await scheduleRepository.checkConflicts(
    userId,
    startOfDay(new Date(body.date)),
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
}))
