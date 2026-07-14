import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { autoScheduleService } from "@/lib/services"
import { scheduleRepository } from "@/lib/repositories"
import { autoScheduleSchema } from "@/lib/validations/schedule.schema"
import { startOfDay } from "date-fns"

export const POST = withAuth(withRateLimit(withValidation(autoScheduleSchema, async (req, { userId, body }) => {
  const normalizedDate = startOfDay(new Date(body.date))
  const suggestions = await autoScheduleService.generateSchedule(userId, normalizedDate)
  await autoScheduleService.applySchedule(userId, normalizedDate, suggestions)
  const scheduledTasks = await scheduleRepository.findByDate(userId, normalizedDate)
  return NextResponse.json({ data: scheduledTasks })
})))
