import { z } from 'zod'
import { Theme, WeekDay } from '@prisma/client'

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const updateSettingsSchema = z.object({
  theme: z.nativeEnum(Theme).optional(),
  weekStartDay: z.nativeEnum(WeekDay).optional(),
  reminderTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  reminderEnabled: z.boolean().optional(),
  eveningSummary: z.boolean().optional(),
  achievementAlerts: z.boolean().optional(),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
