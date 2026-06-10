'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DailyLogWithItems, UserSettings } from '@/types'
import { toDateKey } from '@/lib/date-utils'
import {
  showAchievementToasts,
  showErrorToast,
  UnlockedAchievement,
} from '@/lib/notifications/show-toasts'

const LOG_KEY = 'daily-log'

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json()
    return body.error ?? fallback
  } catch {
    return fallback
  }
}

async function fetchLog(date: Date): Promise<DailyLogWithItems> {
  const dateKey = toDateKey(date)
  const response = await fetch(`/api/logs?date=${encodeURIComponent(dateKey)}`)
  if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch daily log'))
  const { data } = await response.json()
  return data
}

async function toggleTaskApi({
  taskId,
  date,
  completed,
}: {
  taskId: string
  date: Date
  completed: boolean
}): Promise<UnlockedAchievement[]> {
  const response = await fetch('/api/logs/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId,
      date: toDateKey(date),
      completed,
    }),
  })
  if (!response.ok) throw new Error(await parseError(response, 'Failed to update task'))
  const body = await response.json()
  return body.achievements ?? []
}

export function useDailyLog(date: Date) {
  const queryClient = useQueryClient()
  const queryKey = [LOG_KEY, toDateKey(date)]

  const { data: log, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchLog(date),
    staleTime: 1000 * 30,
  })

  const toggleTask = useMutation({
    mutationFn: toggleTaskApi,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<DailyLogWithItems>(queryKey)

      if (previous) {
        queryClient.setQueryData<DailyLogWithItems>(queryKey, {
          ...previous,
          items: previous.items.map((item) =>
            item.task.id === variables.taskId
              ? {
                  ...item,
                  completed: variables.completed,
                  completedAt: variables.completed ? new Date() : null,
                }
              : item
          ),
        })
      }

      return { previous }
    },
    onError: (err: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      showErrorToast('Could not update task', err.message)
    },
    onSuccess: (achievements) => {
      const settings = queryClient.getQueryData<UserSettings>(['settings'])
      if (settings?.achievementAlerts !== false && achievements.length > 0) {
        showAchievementToasts(achievements)
      }
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['streaks'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const completedCount = log?.items.filter((i) => i.completed).length ?? 0
  const totalCount = log?.items.length ?? 0
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return {
    log,
    items: log?.items ?? [],
    completedCount,
    totalCount,
    completionPercentage,
    isLoading,
    error,
    toggleTask,
  }
}
