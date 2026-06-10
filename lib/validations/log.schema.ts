import { z } from 'zod'

const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')

export const toggleLogItemSchema = z.object({
  taskId: z.string(),
  date: dateKeySchema,
  completed: z.boolean(),
})

export const getLogsRangeSchema = z.object({
  startDate: dateKeySchema,
  endDate: dateKeySchema,
})

export type ToggleLogItemInput = z.infer<typeof toggleLogItemSchema>
export type GetLogsRangeInput = z.infer<typeof getLogsRangeSchema>
