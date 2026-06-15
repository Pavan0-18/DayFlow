import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { autoScheduleService } from "@/lib/services"
import { checkRateLimit } from "@/lib/rate-limit"
import { autoScheduleSchema } from "@/lib/validations/schedule.schema"
import { startOfDay } from "date-fns"

// POST /api/schedule/auto - Auto-generate schedule
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await req.json()
    const parsed = autoScheduleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid date", details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const date = parsed.data.date ? new Date(parsed.data.date) : new Date()
    const normalizedDate = startOfDay(date)

    // Generate schedule suggestions
    const suggestions = await autoScheduleService.generateSchedule(session.user.id, normalizedDate)

    // Apply the schedule
    await autoScheduleService.applySchedule(session.user.id, normalizedDate, suggestions)

    // Fetch the newly created schedule
    const { scheduleRepository } = await import("@/lib/repositories")
    const scheduledTasks = await scheduleRepository.findByDate(session.user.id, normalizedDate)

    return NextResponse.json({ data: scheduledTasks })
  } catch (error) {
    console.error("Error auto-scheduling:", error)
    return NextResponse.json(
      { error: "Failed to auto-schedule" },
      { status: 500 }
    )
  }
}
