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

  async findActiveIdsByUser(userId: string): Promise<{ id: string }[]> {
    return db.task.findMany({
      where: { userId, isActive: true },
      select: { id: true },
      orderBy: { sortOrder: 'asc' },
    })
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
    const task = await db.task.update({
      where: { id, userId },
      data,
    })
    return task
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.task.delete({
      where: { id, userId },
    })
  }

  async reorder(taskIds: string[], userId: string): Promise<void> {
    await db.$transaction(
      taskIds.map((id, index) =>
        db.task.update({
          where: { id, userId },
          data: { sortOrder: index },
        })
      )
    )
  }

  async countActive(userId: string): Promise<number> {
    const count = await db.task.count({
      where: { userId, isActive: true },
    })
    return count
  }
}

export const taskRepository = new TaskRepository()
