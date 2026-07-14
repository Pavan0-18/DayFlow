import { NextResponse } from "next/server"
import { withAuth, withRateLimit } from "@/lib/api-middleware"
import { taskRepository } from "@/lib/repositories"

export const POST = withAuth(withRateLimit(async (req, { userId }) => {
  const { taskIds } = await req.json()
  await taskRepository.reorder(taskIds, userId)
  return NextResponse.json({ success: true })
}))
