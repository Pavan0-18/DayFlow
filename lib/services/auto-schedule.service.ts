import { Priority } from '@prisma/client'
import { taskRepository, scheduleRepository } from '../repositories'

export interface ScheduledTaskSuggestion {
  taskId: string
  title: string
  startTime: string
  endTime: string
  priority: Priority
  duration: number
}

export class AutoScheduleService {
  private readonly MORNING_START = 8
  private readonly MORNING_END = 12
  private readonly AFTERNOON_START = 12
  private readonly AFTERNOON_END = 17
  private readonly EVENING_START = 17
  private readonly EVENING_END = 21
  private readonly BUFFER_MINUTES = 15

  async generateSchedule(userId: string, date: Date): Promise<ScheduledTaskSuggestion[]> {
    const activeTasks = await taskRepository.findActiveByUser(userId)
    
    // Sort by priority (HIGH -> MEDIUM -> LOW) then by sortOrder
    const sortedTasks = activeTasks.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
      return priorityOrder[a.sortOrder > b.sortOrder ? 'HIGH' : 'LOW'] - priorityOrder[b.sortOrder > a.sortOrder ? 'HIGH' : 'LOW']
    })

    const scheduled: ScheduledTaskSuggestion[] = []
    const timeSlots: { start: number; end: number; used: boolean }[] = []

    // Initialize time slots (in minutes from midnight)
    for (let hour = this.MORNING_START; hour < this.EVENING_END; hour++) {
      timeSlots.push({ start: hour * 60, end: hour * 60 + 30, used: false })
      timeSlots.push({ start: hour * 60 + 30, end: (hour + 1) * 60, used: false })
    }

    for (const task of sortedTasks) {
      const priority = this.inferPriority(task.sortOrder, sortedTasks.length)
      const duration = 30 // Default 30 minutes
      const slotsNeeded = Math.ceil(duration / 30)

      const startSlot = this.findAvailableSlot(timeSlots, priority, slotsNeeded)
      
      if (startSlot !== -1) {
        const startMinutes = timeSlots[startSlot].start
        const endMinutes = startMinutes + duration

        // Mark slots as used
        for (let i = startSlot; i < startSlot + slotsNeeded && i < timeSlots.length; i++) {
          timeSlots[i].used = true
        }

        scheduled.push({
          taskId: task.id,
          title: task.title,
          startTime: this.minutesToTime(startMinutes),
          endTime: this.minutesToTime(endMinutes),
          priority,
          duration,
        })
      }
    }

    return scheduled
  }

  private inferPriority(sortOrder: number, totalTasks: number): Priority {
    const percentile = sortOrder / totalTasks
    if (percentile < 0.33) return Priority.HIGH
    if (percentile < 0.66) return Priority.MEDIUM
    return Priority.LOW
  }

  private findAvailableSlot(
    slots: { start: number; end: number; used: boolean }[],
    priority: Priority,
    slotsNeeded: number
  ): number {
    let searchStart = 0
    let searchEnd = slots.length

    // Define time ranges based on priority
    switch (priority) {
      case Priority.HIGH:
        searchEnd = this.getSlotIndex(this.MORNING_END * 60)
        break
      case Priority.MEDIUM:
        searchStart = this.getSlotIndex(this.AFTERNOON_START * 60)
        searchEnd = this.getSlotIndex(this.AFTERNOON_END * 60)
        break
      case Priority.LOW:
        searchStart = this.getSlotIndex(this.EVENING_START * 60)
        searchEnd = this.getSlotIndex(this.EVENING_END * 60)
        break
    }

    // Find consecutive available slots
    for (let i = searchStart; i < searchEnd - slotsNeeded + 1; i++) {
      let allAvailable = true
      for (let j = i; j < i + slotsNeeded; j++) {
        if (j >= slots.length || slots[j].used) {
          allAvailable = false
          break
        }
      }
      if (allAvailable) return i
    }

    // If no slot in preferred range, search all slots
    for (let i = 0; i < slots.length - slotsNeeded + 1; i++) {
      let allAvailable = true
      for (let j = i; j < i + slotsNeeded; j++) {
        if (j >= slots.length || slots[j].used) {
          allAvailable = false
          break
        }
      }
      if (allAvailable) return i
    }

    return -1
  }

  private getSlotIndex(minutes: number): number {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const slotInHour = minute < 30 ? 0 : 1
    return (hour - this.MORNING_START) * 2 + slotInHour
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  async applySchedule(userId: string, date: Date, suggestions: ScheduledTaskSuggestion[]): Promise<void> {
    // Clear existing schedule for the date
    await scheduleRepository.deleteByDate(userId, date)

    // Create new scheduled tasks
    for (const suggestion of suggestions) {
      await scheduleRepository.create(
        {
          taskId: suggestion.taskId,
          date: date.toISOString(),
          startTime: suggestion.startTime,
          endTime: suggestion.endTime,
          priority: suggestion.priority,
          duration: suggestion.duration,
        },
        userId
      )
    }
  }
}

export const autoScheduleService = new AutoScheduleService()
