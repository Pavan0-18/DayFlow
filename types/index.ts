import {
  Task,
  DailyLog,
  DailyLogItem,
  ScheduledTask,
  UserSettings,
  Priority,
  Theme,
  WeekDay,
} from '@prisma/client'

// Re-export Prisma types
export type { Task, DailyLog, DailyLogItem, ScheduledTask, UserSettings, Priority }
export { Theme, WeekDay }

export type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task.schema'
export type { UpdateSettingsInput } from '@/lib/validations/settings.schema'
export type { AchievementWithProgress as UserAchievementWithProgress } from '@/lib/repositories/achievement.repository'
export type { DashboardStats } from '@/types/reports'

// Extended types with relations
export interface TaskWithLogs extends Task {
  logItems: DailyLogItem[]
}

export interface DailyLogWithItems extends DailyLog {
  items: (DailyLogItem & {
    task: {
      id: string
      title: string
      color: string
      icon: string
      category: string
    }
  })[]
}

export interface ScheduledTaskWithTask extends ScheduledTask {
  task: {
    id: string
    title: string
    color: string
    icon: string
    category: string
  }
}

// UI types
export interface CategoryOption {
  value: string
  label: string
  color: string
}

export interface EmojiOption {
  emoji: string
  category: string
}

export interface ColorOption {
  value: string
  label?: string
}

// Form types
export interface TaskFormData {
  title: string
  description: string
  category: string
  color: string
  icon: string
  isActive: boolean
}

export interface ScheduleFormData {
  taskId: string
  startTime: string
  endTime: string
  priority: Priority
  duration: number
}

// Stats types
export interface CompletionStats {
  date: Date
  completed: number
  total: number
  rate: number
}

export interface StreakStats {
  currentStreak: number
  bestStreak: number
  isAtRisk: boolean
}

// Achievement types
export interface Achievement {
  id: string
  emoji: string
  name: string
  description: string
  unlockedAt: Date | null
  progress: number
  target: number
}

export interface CategoryBreakdown {
  category: string
  completed: number
  total: number
  rate: number
}

// Report types
export interface DailyReportData {
  date: Date
  completionRate: number
  completedTasks: number
  totalTasks: number
  dayScore: number
}

export interface WeeklyReportData {
  weekStart: Date
  weekEnd: Date
  dailyRates: { date: Date; rate: number }[]
  averageRate: number
  bestDay: { date: Date; rate: number } | null
  worstDay: { date: Date; rate: number } | null
  totalCompleted: number
  consistencyScore: number
}

export interface MonthlyReportData {
  month: Date
  dailyRates: { date: Date; rate: number }[]
  averageRate: number
  totalCompleted: number
  bestWeek: { start: Date; rate: number } | null
  topCompleted: { taskId: string; title: string; count: number }[]
  topMissed: { taskId: string; title: string; count: number }[]
}

// AI types
export interface AIInsight {
  type: 'performance' | 'streak' | 'risk' | 'recommendation'
  title: string
  insight: string
}

export interface TaskSuggestion {
  title: string
  description: string
  category: string
  icon: string
  color: string
}
