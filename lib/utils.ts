import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isYesterday, isSameDay, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d, yyyy')
}

export function formatShortDate(date: Date | string): string {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  return format(d, 'MMM d')
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const start = startOfWeek(date, { weekStartsOn })
  const end = endOfWeek(date, { weekStartsOn })
  return eachDayOfInterval({ start, end })
}

export function getCompletionColor(percentage: number): string {
  if (percentage <= 30) return '#EF4444'
  if (percentage <= 60) return '#F59E0B'
  return '#22C55E'
}

export function getMotivationalMessage(percentage: number): { text: string; emoji: string; color: string } {
  if (percentage === 0) return { text: 'Ready to make today great?', emoji: '💪', color: 'text-slate-500' }
  if (percentage <= 10) return { text: "You've started — that's the hardest part!", emoji: '🚀', color: 'text-blue-500' }
  if (percentage <= 25) return { text: 'Great momentum, keep it going!', emoji: '⚡', color: 'text-blue-500' }
  if (percentage <= 50) return { text: "Halfway there — you're on fire!", emoji: '🔥', color: 'text-orange-500' }
  if (percentage <= 75) return { text: 'Almost there, stay focused!', emoji: '🎯', color: 'text-orange-500' }
  if (percentage < 100) return { text: 'So close to a perfect day!', emoji: '🌟', color: 'text-yellow-500' }
  return { text: 'PERFECT DAY! You crushed it!', emoji: '🎉', color: 'text-green-500' }
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime())
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const date of sortedDates) {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
      currentDate = checkDate
    } else if (diffDays > streak) {
      break
    }
  }

  return streak
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
