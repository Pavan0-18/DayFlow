import { db } from '../db'
import { Task, Prisma } from '@prisma/client'
import { CreateTaskInput, UpdateTaskInput } from '../validations/task.schema'

export class TaskRepository {
  async findAllByUser(userId: string): Promise<Task[]> {
    const tasks = await db.task.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
    })
    return tasks
  }

  async findActiveByUser(userId: string): Promise<Task[]> {
    const tasks = await db.task.findMany({
      where: { userId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return tasks
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await db.task.findFirst({
      where: { id, userId },
    })
    return task
  }

  async create(data: CreateTaskInput, userId: string): Promise<Task> {
    const maxOrder = await db.task.findFirst({
      where: { userId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const task = await db.task.create({
      data: {
        ...data,
        userId,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      },
    })
    return task
  }

  async update(id: string, data: Omit<UpdateTaskInput, 'id'>, userId: string): Promise<Task> {
    const existing = await this.findById(id, userId)
    if (!existing) {
      throw new Error('Task not found')
    }
    const task = await db.task.update({
      where: { id },
      data,
    })
    return task
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.task.delete({
      where: { id },
    })
  }

  async reorder(taskIds: string[], userId: string): Promise<void> {
    const updates = taskIds.map((id, index) =>
      db.task.update({
        where: { id, userId },
        data: { sortOrder: index },
      })
    )
    await db.$transaction(updates)
  }

  async countActive(userId: string): Promise<number> {
    const count = await db.task.count({
      where: { userId, isActive: true },
    })
    return count
  }
}

export const taskRepository = new TaskRepository()
