import { generateAIText, isAIEnabled } from './client'
import { dailyLogRepository, taskRepository } from '../repositories'
import { streakService } from '../services'
import { subDays } from 'date-fns'

const COACHING_TIPS = [
  (name: string) => `"${name}" — one small win compounds into big results.`,
  (name: string) => `Yesterday you skipped "${name}". Try it first thing today before your brain talks you out of it.`,
  (name: string) => `"${name}" keeps coming back unfinished. Maybe it needs a different time slot?`,
]

export async function generateDailyCoaching(userId: string): Promise<string> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = subDays(today, 1)
  const yesterdayLog = await dailyLogRepository.findByDate(userId, yesterday)
  const yesterdayCompleted = yesterdayLog?.items.filter((i) => i.completed) ?? []
  const yesterdayTotal = yesterdayLog?.items.length ?? 0
  const yesterdayRate = yesterdayTotal > 0 ? Math.round((yesterdayCompleted.length / yesterdayTotal) * 100) : 0
  const missedTasks = yesterdayLog?.items.filter((i) => !i.completed).map((i) => i.task.title) ?? []
  const streakInfo = await streakService.getStreakInfo(userId)

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

  if (!isAIEnabled()) {
    return getFallbackCoaching(yesterdayRate, missedTasks, streakInfo.currentStreak, consistentlySkipped)
  }

  try {
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
      return getFallbackCoaching(yesterdayRate, missedTasks, streakInfo.currentStreak, consistentlySkipped)
    }

    return text
  } catch (error) {
    console.error('AI coaching generation failed:', error)
    return getFallbackCoaching(yesterdayRate, missedTasks, streakInfo.currentStreak, consistentlySkipped)
  }
}

function getFallbackCoaching(
  yesterdayRate: number,
  missedTasks: string[],
  currentStreak: number,
  consistentlySkipped: string[],
): string {
  if (consistentlySkipped.length > 0) {
    const task = consistentlySkipped[0]
    const tip = COACHING_TIPS[Math.floor(Math.random() * COACHING_TIPS.length)]
    return tip(task)
  }

  if (missedTasks.length > 0) {
    return `You missed "${missedTasks[0]}" yesterday along with ${missedTasks.length - 1} other task${missedTasks.length > 1 ? 's' : ''}. Shake it off and get one of them done today.`
  }

  if (yesterdayRate >= 100) {
    return `Perfect score yesterday! 🎯 Now do it again. Consistency is how habits stick.`
  }

  if (yesterdayRate >= 70) {
    return `Solid day yesterday (${yesterdayRate}%). You're building real momentum — keep showing up.`
  }

  if (currentStreak > 0) {
    return `You're on a ${currentStreak}-day streak. Even when yesterday was ${yesterdayRate > 0 ? 'a so-so ' : ''}day, showing up is what matters.`
  }

  return `Today is a blank page. Pick one task and finish it before anything else.`
}
