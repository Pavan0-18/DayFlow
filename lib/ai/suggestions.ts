import { generateAIText, isAIEnabled } from './client'
import { taskRepository } from '../repositories'
import { CATEGORIES, CATEGORY_COLORS } from '../constants/categories'

export interface TaskSuggestion {
  title: string
  description: string
  category: string
  icon: string
  color: string
}

export async function generateTaskSuggestions(userId: string): Promise<TaskSuggestion[]> {
  const tasks = await taskRepository.findActiveByUser(userId)
  
  if (!isAIEnabled()) {
    return getFallbackSuggestions(tasks)
  }

  try {
    const categories = Array.from(new Set(tasks.map((t) => t.category)))
    const categoryCounts = categories.map((cat) => ({
      category: cat,
      count: tasks.filter((t) => t.category === cat).length,
    }))
    const topCategories = categoryCounts.sort((a, b) => b.count - a.count).slice(0, 3)

    const prompt = `The user has these habit categories: ${categories.join(', ')}.
Their top categories are: ${topCategories.map((c) => c.category).join(', ')}.

Suggest 5 new daily tasks that would complement their existing habits.
Return ONLY a JSON array:
[
  {
    "title": "Task name (max 60 chars)",
    "description": "Why this task helps (max 100 chars)",
    "category": "one of: Health/Work/Learning/Fitness/Personal/Mindfulness/Social/Finance/Creative",
    "icon": "one relevant emoji",
    "color": "hex color matching the category"
  }
]`

    const text = await generateAIText({
      prompt,
      maxTokens: 1000,
    })

    if (!text) {
      return getFallbackSuggestions(tasks)
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return getFallbackSuggestions(tasks)
    }

    const suggestions: TaskSuggestion[] = JSON.parse(jsonMatch[0])
    return suggestions
  } catch (error) {
    console.error('AI task suggestions failed:', error)
    return getFallbackSuggestions(tasks)
  }
}

function getFallbackSuggestions(existingTasks: { category: string }[]): TaskSuggestion[] {
  const existingCategories = new Set(existingTasks.map((t) => t.category))
  const missingCategories = CATEGORIES.filter((c) => !existingCategories.has(c))

  const suggestions: TaskSuggestion[] = [
    {
      title: 'Practice deep breathing',
      description: '5 minutes of focused breathing reduces stress and improves clarity',
      category: 'Mindfulness',
      icon: '🌬️',
      color: CATEGORY_COLORS.Mindfulness,
    },
    {
      title: 'Learn something new',
      description: 'Spend 15 minutes learning a new skill or concept',
      category: 'Learning',
      icon: '🧠',
      color: CATEGORY_COLORS.Learning,
    },
    {
      title: 'Connect with a friend',
      description: 'Reach out to someone you care about today',
      category: 'Social',
      icon: '💬',
      color: CATEGORY_COLORS.Social,
    },
    {
      title: 'Review your finances',
      description: 'Check your budget and track expenses for 5 minutes',
      category: 'Finance',
      icon: '💰',
      color: CATEGORY_COLORS.Finance,
    },
    {
      title: 'Create something',
      description: 'Spend time on a creative hobby or project',
      category: 'Creative',
      icon: '🎨',
      color: CATEGORY_COLORS.Creative,
    },
  ]

  // Prioritize suggestions from missing categories
  const prioritized = [
    ...suggestions.filter((s) => missingCategories.includes(s.category as any)),
    ...suggestions.filter((s) => !missingCategories.includes(s.category as any)),
  ]

  return prioritized.slice(0, 5)
}
