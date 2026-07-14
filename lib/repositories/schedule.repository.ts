import { db } from '../db'
import { ScheduledTask, Priority } from '@prisma/client'
import { CreateScheduledTaskInput, UpdateScheduledTaskInput } from '../validations/schedule.schema'
import { taskRepository } from './task.repository'

export interface ScheduledTaskWithTask extends ScheduledTask {
  task: {
    id: string
    title: string
    color: string
    icon: string
    category: string
  }
}

export class ScheduleRepository {
  async findByDate(userId: string, date: Date): Promise<ScheduledTaskWithTask[]> {
    const tasks = await db.scheduledTask.findMany({
      where: { userId, date },
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
        startTime: 'asc',
      },
    })
    return tasks
  }

  async findById(id: string, userId: string): Promise<ScheduledTask | null> {
    const task = await db.scheduledTask.findFirst({
      where: { id, userId },
    })
    return task
  }

  async create(data: Omit<CreateScheduledTaskInput, 'priority'> & { priority?: Priority }, userId: string): Promise<ScheduledTask> {
    const task = await taskRepository.findById(data.taskId, userId)
    if (!task) throw new Error('Task not found or unauthorized')

    const scheduled = await db.scheduledTask.create({
      data: {
        ...data,
        userId,
        priority: data.priority ?? Priority.MEDIUM,
      },
    })
    return scheduled
  }

  async update(id: string, data: Omit<UpdateScheduledTaskInput, 'id'>, userId: string): Promise<ScheduledTask> {
    const task = await db.scheduledTask.update({
      where: { id, userId },
      data,
    })
    return task
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.scheduledTask.delete({
      where: { id, userId },
    })
  }

  async deleteByDate(userId: string, date: Date): Promise<void> {
    await db.scheduledTask.deleteMany({
      where: { userId, date },
    })
  }

  async checkConflicts(
    userId: string,
    date: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<ScheduledTask[]> {
    const conflicts = await db.scheduledTask.findMany({
      where: {
        userId,
        date,
        NOT: excludeId ? { id: excludeId } : undefined,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    })
    return conflicts
  }

  async createMany(data: (Omit<CreateScheduledTaskInput, 'priority'> & { priority?: Priority })[], userId: string): Promise<number> {
    const result = await db.scheduledTask.createMany({
      data: data.map((item) => ({ ...item, userId })),
    })
    return result.count
  }
}

export const scheduleRepository = new ScheduleRepository()
