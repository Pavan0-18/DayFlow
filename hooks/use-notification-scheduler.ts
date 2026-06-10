'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSettings } from '@/hooks/use-settings'
import { useDashboardStats } from '@/hooks/use-reports'
import {
  getNotificationPermission,
  hasFiredToday,
  markFiredToday,
  parseReminderTime,
  showBrowserNotification,
  STORAGE_KEYS,
} from '@/lib/notifications/browser-notifications'
import { showBrowserNotificationToast } from '@/lib/notifications/show-toasts'

const CHECK_INTERVAL_MS = 30_000
const EVENING_SUMMARY_HOUR = 21
const EVENING_SUMMARY_MINUTE = 0

export function useNotificationScheduler() {
  const { data: session } = useSession()
  const { settings } = useSettings()
  const { data: stats } = useDashboardStats()
  const statsRef = useRef(stats)

  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  useEffect(() => {
    if (!session?.user || !settings) return

    const tick = () => {
      if (getNotificationPermission() !== 'granted') return

      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      if (settings.reminderEnabled) {
        const reminder = parseReminderTime(settings.reminderTime)
        if (
          reminder &&
          hours === reminder.hours &&
          minutes === reminder.minutes &&
          !hasFiredToday(STORAGE_KEYS.dailyReminder)
        ) {
          const sent = showBrowserNotification({
            title: 'DayFlow — Daily reminder',
            body: 'Time to check in on your habits for today!',
            tag: 'dayflow-daily-reminder',
          })
          if (sent) {
            markFiredToday(STORAGE_KEYS.dailyReminder)
            showBrowserNotificationToast(
              'Daily reminder',
              'Your habit check-in is ready on the dashboard.'
            )
          }
        }
      }

      if (settings.eveningSummary) {
        if (
          hours === EVENING_SUMMARY_HOUR &&
          minutes === EVENING_SUMMARY_MINUTE &&
          !hasFiredToday(STORAGE_KEYS.eveningSummary)
        ) {
          const s = statsRef.current
          const body = s
            ? `You completed ${s.todayCompleted}/${s.todayTotal} tasks today (${s.todayPercentage}%). Streak: ${s.currentStreak} days.`
            : 'Open DayFlow to review how your day went.'

          const sent = showBrowserNotification({
            title: 'DayFlow — Evening summary',
            body,
            tag: 'dayflow-evening-summary',
          })
          if (sent) {
            markFiredToday(STORAGE_KEYS.eveningSummary)
            showBrowserNotificationToast('Evening summary', body)
          }
        }
      }
    }

    tick()
    const interval = window.setInterval(tick, CHECK_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [session?.user, settings])
}
