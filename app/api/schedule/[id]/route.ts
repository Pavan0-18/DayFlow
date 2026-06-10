import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scheduleRepository } from "@/lib/repositories"
import { updateScheduledTaskSchema } from "@/lib/validations/schedule.schema"
import { checkRateLimit } from "@/lib/rate-limit"

// PATCH /api/schedule/[id] - Update a scheduled task
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
    const parsed = updateScheduledTaskSchema.safeParse({ ...body, id: params.id })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const scheduledTask = await scheduleRepository.update(params.id, parsed.data, session.user.id)
    return NextResponse.json({ data: scheduledTask })
  } catch (error) {
    console.error("Error updating scheduled task:", error)
    return NextResponse.json(
      { error: "Failed to update scheduled task" },
      { status: 500 }
    )
  }
}

// DELETE /api/schedule/[id] - Delete a scheduled task
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

    await scheduleRepository.delete(params.id, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting scheduled task:", error)
    return NextResponse.json(
      { error: "Failed to delete scheduled task" },
      { status: 500 }
    )
  }
}
