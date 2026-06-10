import { db } from '../db'
import { DailyLog, DailyLogItem } from '@prisma/client'
import { taskRepository } from './task.repository'

export interface LogWithItems extends DailyLog {
  items: (DailyLogItem & { task: { id: string; title: string; color: string; icon: string; category: string } })[]
}

export class DailyLogRepository {
  async findByDate(userId: string, date: Date): Promise<LogWithItems | null> {
    const log = await db.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      include: {
        items: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
                color: true,
                icon: true,
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
    return log
  }

  async findOrCreate(userId: string, date: Date): Promise<LogWithItems> {
    let log = await this.findByDate(userId, date)

    if (!log) {
      log = await db.dailyLog.create({
        data: {
          userId,
          date,
        },
        include: {
          items: {
            include: {
              task: {
                select: {
                  id: true,
                  title: true,
                  color: true,
                  icon: true,
                  category: true,
                },
              },
            },
          },
        },
      })
    }

    return this.syncActiveTasks(userId, date, log)
  }

  /** Ensure all active tasks have log items for the given day */
  async syncActiveTasks(
    userId: string,
    date: Date,
    existingLog?: LogWithItems
  ): Promise<LogWithItems> {
    const log = existingLog ?? (await this.findOrCreate(userId, date))
    const activeTasks = await taskRepository.findActiveByUser(userId)
    const existingTaskIds = new Set(log.items.map((item) => item.taskId))

    const missingTasks = activeTasks.filter((task) => !existingTaskIds.has(task.id))
    if (missingTasks.length > 0) {
      await db.dailyLogItem.createMany({
        data: missingTasks.map((task) => ({
          dailyLogId: log.id,
          taskId: task.id,
          completed: false,
        })),
      })
    }

    const refreshed = await this.findByDate(userId, date)
    return refreshed ?? log
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<LogWithItems[]> {
    const logs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
                color: true,
                icon: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })
    return logs
  }

  async toggleItem(
    userId: string,
    dailyLogId: string,
    taskId: string,
    completed: boolean
  ): Promise<DailyLogItem> {
    const item = await db.dailyLogItem.upsert({
      where: {
        dailyLogId_taskId: {
          dailyLogId,
          taskId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        dailyLogId,
        taskId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    })
    return item
  }

  async getCompletionStats(userId: string, days: number): Promise<{ date: Date; completed: number; total: number }[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const logs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      include: {
        items: true,
      },
    })

    return logs.map((log) => ({
      date: log.date,
      completed: log.items.filter((i) => i.completed).length,
      total: log.items.length,
    }))
  }

  async deleteAllByUser(userId: string): Promise<void> {
    await db.dailyLog.deleteMany({
      where: { userId },
    })
  }
}

export const dailyLogRepository = new DailyLogRepository()
