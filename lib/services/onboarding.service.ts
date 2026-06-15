import { taskRepository, settingsRepository } from '../repositories'
import { CreateTaskInput } from '../validations/task.schema'
import { db } from '../db'

const STARTER_TASKS: CreateTaskInput[] = [
  {
    title: 'Morning Patrol',
    description: 'Swing into action and start your day with purpose',
    category: 'Health',
    color: '#E11D48',
    icon: '🕷️',
    isActive: true,
  },
  {
    title: 'Web Fluid Hydration',
    description: 'Stay hydrated for maximum web-slinging performance',
    category: 'Health',
    color: '#3B82F6',
    icon: '💧',
    isActive: true,
  },
  {
    title: 'Hero Training',
    description: '30 minutes of exercise to stay in crime-fighting shape',
    category: 'Fitness',
    color: '#22C55E',
    icon: '💪',
    isActive: true,
  },
  {
    title: 'Daily Bugle Briefing',
    description: 'Read and stay informed about city activity',
    category: 'Learning',
    color: '#8B5CF6',
    icon: '📰',
    isActive: true,
  },
  {
    title: 'Spider-Sense Calibration',
    description: 'Meditate and sharpen your reflexes',
    category: 'Mindfulness',
    color: '#EC4899',
    icon: '🧘',
    isActive: true,
  },
  {
    title: 'Patrol Route Planning',
    description: 'Review your daily missions and set priorities',
    category: 'Personal',
    color: '#6366F1',
    icon: '🗺️',
    isActive: true,
  },
  {
    title: 'Ally Check-In',
    description: 'Connect with someone in your network',
    category: 'Social',
    color: '#14B8A6',
    icon: '💬',
    isActive: true,
  },
  {
    title: 'Night Patrol Debrief',
    description: 'Log your heroics and plan tomorrow',
    category: 'Personal',
    color: '#64748B',
    icon: '🌙',
    isActive: true,
  },
]

export class OnboardingService {
  async isNewUser(userId: string): Promise<boolean> {
    const tasks = await taskRepository.findAllByUser(userId)
    return tasks.length === 0
  }

  async setupNewUser(userId: string): Promise<void> {
    const isNew = await this.isNewUser(userId)
    if (!isNew) return

    await db.$transaction(async (tx) => {
      // Create user settings
      await settingsRepository.findOrCreate(userId)

      // Create starter tasks
      for (const task of STARTER_TASKS) {
        const maxOrder = await tx.task.findFirst({
          where: { userId },
          orderBy: { sortOrder: 'desc' },
          select: { sortOrder: true },
        })
        await tx.task.create({
          data: {
            ...task,
            userId,
            sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
          },
        })
      }
    })
  }

  async getStarterTasks(): Promise<CreateTaskInput[]> {
    return STARTER_TASKS
  }
}

export const onboardingService = new OnboardingService()
