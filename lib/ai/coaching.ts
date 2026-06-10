import { generateAIText, isAIEnabled } from './client'
import { dailyLogRepository, taskRepository } from '../repositories'
import { streakService } from '../services'
import { subDays } from 'date-fns'

export async function generateDailyCoaching(userId: string): Promise<string> {
  if (!isAIEnabled()) {
    return getFallbackCoaching()
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = subDays(today, 1)

    // Get yesterday's data
    const yesterdayLog = await dailyLogRepository.findByDate(userId, yesterday)
    const yesterdayCompleted = yesterdayLog?.items.filter((i) => i.completed) ?? []
    const yesterdayTotal = yesterdayLog?.items.length ?? 0
    const yesterdayRate = yesterdayTotal > 0 ? Math.round((yesterdayCompleted.length / yesterdayTotal) * 100) : 0
    const missedTasks = yesterdayLog?.items.filter((i) => !i.completed).map((i) => i.task.title) ?? []

    // Get streak info
    const streakInfo = await streakService.getStreakInfo(userId)

    // Get consistently skipped tasks (last 7 days)
    const lastWeek = await dailyLogRepository.findByDateRange(userId, subDays(today, 7), yesterday)
    const skipCounts: Record<string, number> = {}
    lastWeek.forEach((log) => {
      log.items.forEach((item) => {
        if (!item.completed) {
          skipCounts[item.task.title] = (skipCounts[item.task.title] ?? 0) + 1
        }
      })
    })
    const consistentlySkipped = Object.entries(skipCounts)
      .filter(([, count]) => count >= 3)
      .map(([title]) => title)

    const prompt = `You are an encouraging but honest daily coach. Give ONE punchy coaching message (max 2 sentences) for today based on:
- Yesterday: ${yesterdayRate}% complete, missed: ${missedTasks.join(', ') || 'none'}
- Current streak: ${streakInfo.currentStreak} days
- Consistently skipped: ${consistentlySkipped.join(', ') || 'none'}

Be specific (mention actual task names). Be motivating but real. No fluff.
Return ONLY the message text, nothing else.`

    const text = await generateAIText({
      prompt,
      maxTokens: 200,
    })

    if (!text) {
      return getFallbackCoaching()
    }

    return text
  } catch (error) {
    console.error('AI coaching generation failed:', error)
    return getFallbackCoaching()
  }
}

function getFallbackCoaching(): string {
  const messages = [
    "Today is a fresh start. Focus on completing your most important tasks first.",
    "Small steps lead to big changes. You've got this!",
    "Consistency is key. Try to complete at least one task today.",
    "Remember why you started. Every completed task is progress.",
    "Your future self will thank you for the habits you build today.",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}
