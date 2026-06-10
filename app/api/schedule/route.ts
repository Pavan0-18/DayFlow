import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scheduleRepository } from "@/lib/repositories"
import { createScheduledTaskSchema } from "@/lib/validations/schedule.schema"
import { checkRateLimit } from "@/lib/rate-limit"
import { startOfDay } from "date-fns"

// GET /api/schedule?date=... - Get schedule for a specific date
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")
    const date = dateParam ? new Date(dateParam) : new Date()
    const normalizedDate = startOfDay(date)

    const scheduledTasks = await scheduleRepository.findByDate(session.user.id, normalizedDate)
    return NextResponse.json({ data: scheduledTasks })
  } catch (error) {
    console.error("Error fetching schedule:", error)
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    )
  }
}

// POST /api/schedule - Create a scheduled task
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
    const parsed = createScheduledTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Check for conflicts
    const conflicts = await scheduleRepository.checkConflicts(
      session.user.id,
      startOfDay(new Date(parsed.data.date)),
      parsed.data.startTime,
      parsed.data.endTime
    )

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: "Time conflict with existing task", conflicts },
        { status: 409 }
      )
    }

    const scheduledTask = await scheduleRepository.create(parsed.data, session.user.id)
    return NextResponse.json({ data: scheduledTask }, { status: 201 })
  } catch (error) {
    console.error("Error creating scheduled task:", error)
    return NextResponse.json(
      { error: "Failed to create scheduled task" },
      { status: 500 }
    )
  }
}
