import { z } from 'zod'
import { CATEGORIES } from '../constants/categories'
import { isValidHexColor } from '../constants/colors'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(60, 'Title must be 60 characters or less'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  category: z.enum([...CATEGORIES] as [string, ...string[]]),
  color: z.string().refine(isValidHexColor, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required').max(8, 'Icon is too long'),
  isActive: z.boolean().default(true),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string(),
})

export const reorderTasksSchema = z.object({
  taskIds: z.array(z.string()),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>
