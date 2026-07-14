import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { taskRepository, dailyLogRepository } from "@/lib/repositories"
import { bulkTaskSchema } from "@/lib/validations/task.schema"
import { fromDateKey } from "@/lib/date-utils"
import { startOfDay } from "date-fns"

export const POST = withAuth(withRateLimit(withValidation(bulkTaskSchema, async (req, { userId, body }) => {
  const { action, taskIds, date } = body
  let affected = 0

  switch (action) {
    case "delete": {
      affected = await taskRepository.bulkDelete(taskIds, userId)
      break
    }
    case "activate": {
      affected = await taskRepository.bulkUpdate(taskIds, { isActive: true }, userId)
      break
    }
    case "deactivate": {
      affected = await taskRepository.bulkUpdate(taskIds, { isActive: false }, userId)
      break
    }
    case "complete": {
      affected = await taskRepository.bulkUpdate(taskIds, { isActive: false }, userId)
      const targetDate = date ? fromDateKey(date) : startOfDay(new Date())
      const log = await dailyLogRepository.findOrCreate(userId, targetDate)
      for (const taskId of taskIds) {
        try {
          await dailyLogRepository.toggleItem(userId, log.id, taskId, true)
        } catch {
          // task might not be in today's log yet, skip
        }
      }
      break
    }
  }

  return NextResponse.json({ data: { affected } })
})))
