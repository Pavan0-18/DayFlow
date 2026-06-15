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

const FALLBACK_SUGGESTIONS_BY_CATEGORY: Record<string, TaskSuggestion[]> = {
  Mindfulness: [
    { title: 'Practice deep breathing', description: '5 minutes of focused breathing reduces stress and improves clarity', category: 'Mindfulness', icon: '🌬️', color: CATEGORY_COLORS.Mindfulness },
    { title: 'Body scan meditation', description: 'Check in with each part of your body for 10 minutes', category: 'Mindfulness', icon: '🧘', color: CATEGORY_COLORS.Mindfulness },
  ],
  Learning: [
    { title: 'Read a chapter', description: 'Spend 15 minutes reading a book on a topic you enjoy', category: 'Learning', icon: '📖', color: CATEGORY_COLORS.Learning },
    { title: 'Learn something new', description: 'Spend 15 minutes on a tutorial or documentary', category: 'Learning', icon: '🧠', color: CATEGORY_COLORS.Learning },
  ],
  Social: [
    { title: 'Connect with a friend', description: 'Reach out to someone you care about today', category: 'Social', icon: '💬', color: CATEGORY_COLORS.Social },
    { title: 'Write a thank-you note', description: 'Express gratitude to someone who helped you', category: 'Social', icon: '✉️', color: CATEGORY_COLORS.Social },
  ],
  Finance: [
    { title: 'Review your budget', description: 'Check your spending and track expenses for 5 minutes', category: 'Finance', icon: '💰', color: CATEGORY_COLORS.Finance },
    { title: 'Check your subscriptions', description: 'Review recurring charges and cancel unused ones', category: 'Finance', icon: '📋', color: CATEGORY_COLORS.Finance },
  ],
  Creative: [
    { title: 'Create something', description: 'Spend time on a creative hobby or project', category: 'Creative', icon: '🎨', color: CATEGORY_COLORS.Creative },
    { title: 'Write a journal entry', description: 'Free-write for 10 minutes about anything on your mind', category: 'Creative', icon: '📝', color: CATEGORY_COLORS.Creative },
  ],
  Health: [
    { title: 'Drink a glass of water', description: 'Hydrate first thing in the morning', category: 'Health', icon: '💧', color: CATEGORY_COLORS.Health },
    { title: 'Take a short walk', description: '10 minute walk to get your blood flowing', category: 'Health', icon: '🚶', color: CATEGORY_COLORS.Health },
  ],
  Fitness: [
    { title: 'Do 10 push-ups', description: 'Quick bodyweight exercise to build strength', category: 'Fitness', icon: '💪', color: CATEGORY_COLORS.Fitness },
    { title: 'Stretch for 5 minutes', description: 'Improve flexibility and prevent stiffness', category: 'Fitness', icon: '🤸', color: CATEGORY_COLORS.Fitness },
  ],
  Work: [
    { title: 'Plan your workday', description: 'List your top 3 priorities before starting', category: 'Work', icon: '📋', color: CATEGORY_COLORS.Work },
    { title: 'Clean your workspace', description: 'A tidy desk leads to a tidy mind', category: 'Work', icon: '🧹', color: CATEGORY_COLORS.Work },
  ],
  Personal: [
    { title: 'Review your goals', description: 'Check in with your weekly and monthly goals', category: 'Personal', icon: '🎯', color: CATEGORY_COLORS.Personal },
    { title: 'Plan tomorrow', description: 'Spend 5 minutes setting up tomorrow\'s priorities', category: 'Personal', icon: '📅', color: CATEGORY_COLORS.Personal },
  ],
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

  const suggestions: TaskSuggestion[] = []
  for (const cat of missingCategories) {
    const catSuggestions = FALLBACK_SUGGESTIONS_BY_CATEGORY[cat]
    if (catSuggestions) {
      suggestions.push(catSuggestions[0])
    }
  }

  const allKeys = Object.keys(FALLBACK_SUGGESTIONS_BY_CATEGORY) as Array<keyof typeof FALLBACK_SUGGESTIONS_BY_CATEGORY>
  for (const cat of allKeys) {
    if (!missingCategories.includes(cat as any) && suggestions.length < 5) {
      const catSuggestions = FALLBACK_SUGGESTIONS_BY_CATEGORY[cat]
      if (catSuggestions) {
        suggestions.push(catSuggestions[1] ?? catSuggestions[0])
      }
    }
  }

  return suggestions.slice(0, 5)
}
