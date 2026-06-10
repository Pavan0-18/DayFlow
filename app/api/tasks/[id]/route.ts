import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { taskRepository, dailyLogRepository } from "@/lib/repositories"
import { startOfDay } from "date-fns"
import { updateTaskSchema } from "@/lib/validations/task.schema"
import { checkRateLimit } from "@/lib/rate-limit"

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const task = await taskRepository.findById(params.id, session.user.id)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ data: task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const parsed = updateTaskSchema.safeParse({ ...body, id: params.id })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Check if trying to activate when at limit
    if (body.isActive === true) {
      const existingTask = await taskRepository.findById(params.id, session.user.id)
      if (existingTask && !existingTask.isActive) {
        const activeCount = await taskRepository.countActive(session.user.id)
        if (activeCount >= 20) {
          return NextResponse.json(
            { error: "Maximum of 20 active tasks allowed" },
            { status: 400 }
          )
        }
      }
    }

    const { id: _id, ...updateData } = parsed.data
    const task = await taskRepository.update(params.id, updateData, session.user.id)

    if (updateData.isActive !== false) {
      const today = startOfDay(new Date())
      const log = await dailyLogRepository.findOrCreate(session.user.id, today)
      await dailyLogRepository.syncActiveTasks(session.user.id, today, log)
    }

    return NextResponse.json({ data: task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(session.user.id)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    await taskRepository.delete(params.id, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
