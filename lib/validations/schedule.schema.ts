import { z } from 'zod'
import { Priority } from '@prisma/client'

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const createScheduledTaskSchema = z.object({
  taskId: z.string(),
  date: z.string().datetime(),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  duration: z.number().min(15).max(480), // 15 min to 8 hours
})

export const updateScheduledTaskSchema = createScheduledTaskSchema.partial().extend({
  id: z.string(),
})

export const autoScheduleSchema = z.object({
  date: z.string().datetime(),
})

export type CreateScheduledTaskInput = z.infer<typeof createScheduledTaskSchema>
export type UpdateScheduledTaskInput = z.infer<typeof updateScheduledTaskSchema>
export type AutoScheduleInput = z.infer<typeof autoScheduleSchema>
