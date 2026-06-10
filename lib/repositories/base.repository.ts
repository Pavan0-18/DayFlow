import { db } from '../db'

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected abstract get model(): any

  async findById(id: string, userId: string): Promise<T | null> {
    const result = await this.model.findFirst({
      where: { id, userId },
    })
    return result
  }

  async findAllByUser(userId: string): Promise<T[]> {
    const results = await this.model.findMany({
      where: { userId },
    })
    return results
  }

  async create(data: CreateInput, userId: string): Promise<T> {
    const result = await this.model.create({
      data: { ...data, userId },
    })
    return result
  }

  async update(id: string, data: UpdateInput, userId: string): Promise<T> {
    const result = await this.model.update({
      where: { id },
      data,
    })
    return result
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.model.delete({
      where: { id },
    })
  }
}
