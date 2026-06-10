import { taskRepository, settingsRepository } from '../repositories'
import { CreateTaskInput } from '../validations/task.schema'

const STARTER_TASKS: CreateTaskInput[] = [
  {
    title: 'Morning Routine',
    description: 'Start your day with a consistent routine',
    category: 'Health',
    color: '#F59E0B',
    icon: '🌅',
    isActive: true,
  },
  {
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'Health',
    color: '#3B82F6',
    icon: '💧',
    isActive: true,
  },
  {
    title: 'Exercise 30 minutes',
    description: 'Move your body and stay active',
    category: 'Fitness',
    color: '#22C55E',
    icon: '🏃',
    isActive: true,
  },
  {
    title: 'Read for 20 minutes',
    description: 'Expand your knowledge and relax',
    category: 'Learning',
    color: '#8B5CF6',
    icon: '📚',
    isActive: true,
  },
  {
    title: 'Meditate',
    description: 'Take time to clear your mind',
    category: 'Mindfulness',
    color: '#EC4899',
    icon: '🧘',
    isActive: true,
  },
  {
    title: 'Review daily goals',
    description: 'Check in with your priorities',
    category: 'Personal',
    color: '#6366F1',
    icon: '📝',
    isActive: true,
  },
  {
    title: 'Gratitude journal',
    description: 'Write down things you are grateful for',
    category: 'Mindfulness',
    color: '#F97316',
    icon: '🙏',
    isActive: true,
  },
  {
    title: 'Evening review',
    description: 'Reflect on your day and plan tomorrow',
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

    // Create user settings
    await settingsRepository.findOrCreate(userId)

    // Create starter tasks
    for (const task of STARTER_TASKS) {
      await taskRepository.create(task, userId)
    }
  }

  async getStarterTasks(): Promise<CreateTaskInput[]> {
    return STARTER_TASKS
  }
}

export const onboardingService = new OnboardingService()
