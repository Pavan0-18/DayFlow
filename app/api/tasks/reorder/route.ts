import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { taskRepository } from "@/lib/repositories"
import { reorderTasksSchema } from "@/lib/validations/task.schema"
import { checkRateLimit } from "@/lib/rate-limit"

// POST /api/tasks/reorder - Reorder tasks
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
    const parsed = reorderTasksSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await taskRepository.reorder(parsed.data.taskIds, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering tasks:", error)
    return NextResponse.json(
      { error: "Failed to reorder tasks" },
      { status: 500 }
    )
  }
}
