import { db } from '../db'
import { UserSettings, Theme, WeekDay } from '@prisma/client'
import { UpdateSettingsInput } from '../validations/settings.schema'

export class SettingsRepository {
  async findByUserId(userId: string): Promise<UserSettings | null> {
    const settings = await db.userSettings.findUnique({
      where: { userId },
    })
    return settings
  }

  async findOrCreate(userId: string): Promise<UserSettings> {
    const existing = await this.findByUserId(userId)
    if (existing) return existing

    const settings = await db.userSettings.create({
      data: {
        userId,
        theme: Theme.SYSTEM,
        weekStartDay: WeekDay.MONDAY,
        reminderTime: '08:00',
        reminderEnabled: true,
        eveningSummary: true,
        achievementAlerts: true,
      },
    })
    return settings
  }

  async update(userId: string, data: UpdateSettingsInput): Promise<UserSettings> {
    const settings = await db.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        theme: data.theme ?? Theme.SYSTEM,
        weekStartDay: data.weekStartDay ?? WeekDay.MONDAY,
        reminderTime: data.reminderTime ?? '08:00',
        reminderEnabled: data.reminderEnabled ?? true,
        eveningSummary: data.eveningSummary ?? true,
        achievementAlerts: data.achievementAlerts ?? true,
      },
    })
    return settings
  }

  async deleteByUser(userId: string): Promise<void> {
    await db.userSettings.deleteMany({
      where: { userId },
    })
  }
}

export const settingsRepository = new SettingsRepository()
