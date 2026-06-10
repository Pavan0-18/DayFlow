import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { taskRepository, dailyLogRepository } from "@/lib/repositories"
import { startOfDay } from "date-fns"
import { createTaskSchema } from "@/lib/validations/task.schema"
import { checkRateLimit } from "@/lib/rate-limit"

// GET /api/tasks - Get all tasks for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const tasks = await taskRepository.findAllByUser(session.user.id)
    return NextResponse.json({ data: tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    // Check active task limit
    const activeCount = await taskRepository.countActive(session.user.id)
    if (activeCount >= 20) {
      return NextResponse.json(
        { error: "Maximum of 20 active tasks allowed" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const task = await taskRepository.create(parsed.data, session.user.id)

    if (task.isActive) {
      const today = startOfDay(new Date())
      const log = await dailyLogRepository.findOrCreate(session.user.id, today)
      await dailyLogRepository.syncActiveTasks(session.user.id, today, log)
    }

    return NextResponse.json({ data: task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
