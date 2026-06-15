import { generateAIText, isAIEnabled } from './client'
import { reportService } from '../services'
import { reportRepository } from '../repositories'
import { CATEGORIES } from '../constants/categories'
import type { DashboardStats, CategoryBreakdown } from '../services/report.service'

export interface AIInsight {
  type: 'performance' | 'streak' | 'risk' | 'recommendation'
  title: string
  insight: string
}

export async function generateInsights(userId: string): Promise<AIInsight[]> {
  const stats = await reportService.getDashboardStats(userId)
  const categoryBreakdown = await reportService.getCategoryBreakdown(userId, 30)
  const mostSkipped = await reportService.getMostSkippedTasks(userId, 30)
  const dayOfWeek = await reportService.getDayOfWeekPerformance(userId)
  const streakData = await reportRepository.getStreakData(userId)

  if (!isAIEnabled()) {
    return getFallbackInsights(stats, categoryBreakdown, mostSkipped, dayOfWeek, streakData)
  }

  try {
    const prompt = `You are a personal productivity coach analyzing someone's daily habit tracking data.

User data:
- Current streak: ${stats.currentStreak} days
- Best streak: ${stats.bestStreak} days
- Today's completion: ${stats.todayPercentage}%
- Weekly average: ${stats.weeklyAverage}%
- Total active tasks: ${stats.totalTasks}

Category breakdown (last 30 days):
${categoryBreakdown.map(c => `- ${c.category}: ${c.rate}% (${c.completed}/${c.total})`).join('\n')}

Most skipped tasks (last 30 days):
${mostSkipped.map(t => `- ${t.title}: ${t.skips} skips`).join('\n')}

Day of week performance:
${Object.entries(dayOfWeek).map(([day, pct]) => `- ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(day)]}: ${pct}%`).join('\n')}

Perfect days: ${streakData.perfectDays}

Generate exactly 4 insight cards. Return ONLY a JSON array:
[
  {
    "type": "performance" | "streak" | "risk" | "recommendation",
    "title": "Short punchy title",
    "insight": "2 sentence insight with specific data points"
  }
]

Be specific, data-driven, and actionable. Avoid generic advice.`

    const text = await generateAIText({
      prompt,
      maxTokens: 1000,
    })

    if (!text) {
      return getFallbackInsights(stats, categoryBreakdown, mostSkipped, dayOfWeek, streakData)
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return getFallbackInsights(stats, categoryBreakdown, mostSkipped, dayOfWeek, streakData)
    }

    const insights: AIInsight[] = JSON.parse(jsonMatch[0])
    return insights
  } catch (error) {
    console.error('AI insights generation failed:', error)
    return getFallbackInsights(stats, categoryBreakdown, mostSkipped, dayOfWeek, streakData)
  }
}

function getFallbackInsights(
  stats: DashboardStats,
  categoryBreakdown: CategoryBreakdown[],
  mostSkipped: { taskId: string; title: string; skips: number }[],
  dayOfWeek: Record<number, number>,
  streakData: { currentStreak: number; bestStreak: number; perfectDays: number },
): AIInsight[] {
  const insights: AIInsight[] = []

  const bestCategory = categoryBreakdown[0]
  const worstCategory = categoryBreakdown[categoryBreakdown.length - 1]
  const bestDay = Object.entries(dayOfWeek).sort((a, b) => b[1] - a[1])[0]
  const worstDay = Object.entries(dayOfWeek).sort((a, b) => a[1] - b[1])[0]

  if (bestCategory && bestCategory.rate >= 70) {
    insights.push({
      type: 'performance',
      title: `${bestCategory.category} is your strongest suit`,
      insight: `You're crushing it in ${bestCategory.category} with a ${bestCategory.rate}% completion rate over the last 30 days. Keep that momentum going into other areas.`,
    })
  } else {
    insights.push({
      type: 'performance',
      title: 'Room to grow',
      insight: `Your weekly average is ${stats.weeklyAverage}%. Try focusing on one category at a time to build consistency.`,
    })
  }

  if (stats.currentStreak >= 3) {
    insights.push({
      type: 'streak',
      title: `${stats.currentStreak}-day streak active`,
      insight: `You're on a ${stats.currentStreak}-day streak! Best so far is ${stats.bestStreak} days. Every day you show up builds the habit.`,
    })
  } else {
    insights.push({
      type: 'streak',
      title: 'Build your streak',
      insight: stats.bestStreak > 0
        ? `Your best streak is ${stats.bestStreak} days. Focus on completing at least one task daily to start a new streak.`
        : `Every hero starts somewhere. Complete at least one task today to begin your first streak.`,
    })
  }

  if (mostSkipped.length > 0) {
    const topSkip = mostSkipped[0]
    insights.push({
      type: 'risk',
      title: `Watch out for "${topSkip.title}"`,
      insight: `"${topSkip.title}" has been skipped ${topSkip.skips} times recently. Consider rescheduling it to a time when you have more energy.`,
    })
  } else if (stats.todayPercentage < 50) {
    insights.push({
      type: 'risk',
      title: 'Slow start today',
      insight: `You're at ${stats.todayPercentage}% today. Break the ice by tackling your easiest task first.`,
    })
  } else {
    insights.push({
      type: 'risk',
      title: 'Watch for gaps',
      insight: `Missing consecutive days can drop your average. You've had ${streakData.perfectDays} perfect days total — aim to add another today.`,
    })
  }

  if (worstCategory && worstCategory.rate < 50) {
    insights.push({
      type: 'recommendation',
      title: `Give ${worstCategory.category} some love`,
      insight: `${worstCategory.category} is at ${worstCategory.rate}%. Even 5 minutes a day can turn this around.`,
    })
  } else if (bestDay && worstDay && bestDay[0] !== worstDay[0]) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    insights.push({
      type: 'recommendation',
      title: `${dayNames[parseInt(bestDay[0])]} is your day`,
      insight: `You perform best on ${dayNames[parseInt(bestDay[0])]} (${bestDay[1]}%) and weakest on ${dayNames[parseInt(worstDay[0])]} (${worstDay[1]}%). Plan harder tasks on your strong days.`,
    })
  } else {
    insights.push({
      type: 'recommendation',
      title: 'Start small, stay consistent',
      insight: `With ${stats.totalTasks} active tasks, pick the 3 most important each day. Quality consistency beats sporadic perfection.`,
    })
  }

  return insights
}
