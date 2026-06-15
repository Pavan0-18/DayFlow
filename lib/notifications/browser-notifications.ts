export type NotificationPermission = 'default' | 'granted' | 'denied' | 'unsupported'

export interface BrowserNotificationPayload {
  title: string
  body: string
  tag?: string
  icon?: string
}

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission {
  if (!isBrowserNotificationSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isBrowserNotificationSupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

export function showBrowserNotification(payload: BrowserNotificationPayload): boolean {
  if (!isBrowserNotificationSupported() || Notification.permission !== 'granted') {
    return false
  }

  try {
    new Notification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: payload.icon ?? '/favicon.ico',
    })
    return true
  } catch {
    return false
  }
}

export function parseReminderTime(time: string): { hours: number; minutes: number } | null {
  const match = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.exec(time)
  if (!match) return null
  return { hours: Number(match[1]), minutes: Number(match[2]) }
}

export function hasFiredToday(storageKey: string): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(storageKey) === new Date().toDateString()
}

export function markFiredToday(storageKey: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey, new Date().toDateString())
}

export const STORAGE_KEYS = {
  dailyReminder: 'dayflow-last-daily-reminder',
  eveningSummary: 'dayflow-last-evening-summary',
} as const
