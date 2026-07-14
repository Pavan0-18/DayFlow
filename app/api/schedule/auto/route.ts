import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { autoScheduleService } from "@/lib/services"
import { scheduleRepository } from "@/lib/repositories"
import { startOfDay } from "date-fns"

export const POST = withAuth(withRateLimit(async (req, { userId }) => {
  const { date: dateParam } = await req.json()
  const date = dateParam ? new Date(dateParam) : new Date()
  const normalizedDate = startOfDay(date)
  const suggestions = await autoScheduleService.generateSchedule(userId, normalizedDate)
  await autoScheduleService.applySchedule(userId, normalizedDate, suggestions)
  const scheduledTasks = await scheduleRepository.findByDate(userId, normalizedDate)
  return NextResponse.json({ data: scheduledTasks })
}))
