'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserSettings, UpdateSettingsInput } from '@/types'
import { requestNotificationPermission } from '@/lib/notifications/browser-notifications'
import { showErrorToast, showSuccessToast } from '@/lib/notifications/show-toasts'

const SETTINGS_KEY = 'settings'

async function fetchSettings(): Promise<UserSettings> {
  const response = await fetch('/api/settings')
  if (!response.ok) throw new Error('Failed to fetch settings')
  const { data } = await response.json()
  return data
}

async function updateSettingsApi(input: UpdateSettingsInput): Promise<UserSettings> {
  const response = await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error('Failed to update settings')
  const { data } = await response.json()
  return data
}

export function useSettings() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading, error } = useQuery({
    queryKey: [SETTINGS_KEY],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 10,
  })

  const updateSettings = useMutation({
    mutationFn: updateSettingsApi,
    onSuccess: async (data, variables) => {
      queryClient.setQueryData([SETTINGS_KEY], data)

      if ('reminderEnabled' in variables && variables.reminderEnabled) {
        await requestNotificationPermission()
      }
      if ('eveningSummary' in variables && variables.eveningSummary) {
        await requestNotificationPermission()
      }
      if ('achievementAlerts' in variables && variables.achievementAlerts) {
        await requestNotificationPermission()
      }

      if ('theme' in variables) {
        showSuccessToast('Theme updated')
      } else if ('reminderTime' in variables) {
        showSuccessToast('Reminder time saved', `Daily reminder set for ${data.reminderTime}`)
      } else if ('reminderEnabled' in variables) {
        showSuccessToast(
          variables.reminderEnabled ? 'Daily reminders enabled' : 'Daily reminders disabled'
        )
      } else if ('eveningSummary' in variables) {
        showSuccessToast(
          variables.eveningSummary ? 'Evening summary enabled' : 'Evening summary disabled'
        )
      } else if ('achievementAlerts' in variables) {
        showSuccessToast(
          variables.achievementAlerts ? 'Achievement alerts enabled' : 'Achievement alerts disabled'
        )
      } else {
        showSuccessToast('Settings saved')
      }
    },
    onError: (err: Error) => {
      showErrorToast('Failed to save settings', err.message)
    },
  })

  return {
    settings,
    isLoading,
    error,
    updateSettings,
  }
}
