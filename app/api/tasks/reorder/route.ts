import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { taskRepository } from "@/lib/repositories"
import { reorderTasksSchema } from "@/lib/validations/task.schema"

export const POST = withAuth(withRateLimit(withValidation(reorderTasksSchema, async (req, { userId, body }) => {
  await taskRepository.reorder(body.taskIds, userId)
  return NextResponse.json({ success: true })
})))
