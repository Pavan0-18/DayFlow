import { generateAIText, isAIEnabled } from './client'
import { reportService } from '../services'
import { reportRepository } from '../repositories'
import { CATEGORIES } from '../constants/categories'

export interface AIInsight {
  type: 'performance' | 'streak' | 'risk' | 'recommendation'
  title: string
  insight: string
}

export async function generateInsights(userId: string): Promise<AIInsight[]> {
  if (!isAIEnabled()) {
    return getFallbackInsights()
  }

  try {
    const stats = await reportService.getDashboardStats(userId)
    const categoryBreakdown = await reportService.getCategoryBreakdown(userId, 30)
    const mostSkipped = await reportService.getMostSkippedTasks(userId, 30)
    const dayOfWeek = await reportService.getDayOfWeekPerformance(userId)
    const streakData = await reportRepository.getStreakData(userId)

    const prompt = `You are a personal productivity coach analyzing someone's daily habit tracking data.

User data:
- Current streak: ${stats.currentStreak} days
- Best streak: ${stats.bestStreak} days
- Today's completion: ${stats.todayPercentage}%
- Weekly average: ${stats.weeklyAverage}%
- Total active tasks: ${stats.totalTasks}

Category breakdown (last 30 days):
${categoryBreakdown.map(c => `- ${c.category}: ${c.percentage}% (${c.completed}/${c.total})`).join('\n')}

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
      return getFallbackInsights()
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return getFallbackInsights()
    }

    const insights: AIInsight[] = JSON.parse(jsonMatch[0])
    return insights
  } catch (error) {
    console.error('AI insights generation failed:', error)
    return getFallbackInsights()
  }
}

function getFallbackInsights(): AIInsight[] {
  return [
    {
      type: 'performance',
      title: 'Keep the momentum going',
      insight: 'Your weekly average shows consistent effort. Focus on maintaining your current routine to see long-term improvements.',
    },
    {
      type: 'streak',
      title: 'Build your streak',
      insight: 'Every day counts toward building lasting habits. Try to complete at least one task daily to maintain momentum.',
    },
    {
      type: 'risk',
      title: 'Watch for gaps',
      insight: 'Missing multiple days can break your momentum. Set reminders to stay on track with your daily goals.',
    },
    {
      type: 'recommendation',
      title: 'Start small',
      insight: 'Focus on completing your most important tasks first. Quality consistency beats sporadic perfection.',
    },
  ]
}
