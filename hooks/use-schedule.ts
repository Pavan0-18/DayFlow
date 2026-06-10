'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ScheduledTaskWithTask, Priority } from '@/types'
import { formatISO, startOfDay } from 'date-fns'

const SCHEDULE_KEY = 'schedule'

async function fetchSchedule(date: Date): Promise<ScheduledTaskWithTask[]> {
  const formattedDate = formatISO(startOfDay(date))
  const response = await fetch(`/api/schedule?date=${encodeURIComponent(formattedDate)}`)
  if (!response.ok) throw new Error('Failed to fetch schedule')
  const { data } = await response.json()
  return data
}

interface CreateScheduleInput {
  taskId: string
  date: Date
  startTime: string
  endTime: string
  priority: Priority
  duration: number
}

async function createScheduleApi(input: CreateScheduleInput): Promise<ScheduledTaskWithTask> {
  const response = await fetch('/api/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      date: formatISO(startOfDay(input.date)),
    }),
  })
  if (!response.ok) throw new Error('Failed to create schedule')
  const { data } = await response.json()
  return data
}

async function updateScheduleApi({
  id,
  ...input
}: Partial<CreateScheduleInput> & { id: string }): Promise<ScheduledTaskWithTask> {
  const response = await fetch(`/api/schedule/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      date: input.date ? formatISO(startOfDay(input.date)) : undefined,
    }),
  })
  if (!response.ok) throw new Error('Failed to update schedule')
  const { data } = await response.json()
  return data
}

async function deleteScheduleApi(id: string): Promise<void> {
  const response = await fetch(`/api/schedule/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete schedule')
}

async function autoScheduleApi(date: Date): Promise<ScheduledTaskWithTask[]> {
  const response = await fetch('/api/schedule/auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: formatISO(startOfDay(date)) }),
  })
  if (!response.ok) throw new Error('Failed to auto-schedule')
  const { data } = await response.json()
  return data
}

export function useSchedule(date: Date) {
  const queryClient = useQueryClient()

  const { data: scheduledTasks = [], isLoading, error } = useQuery({
    queryKey: [SCHEDULE_KEY, date.toISOString()],
    queryFn: () => fetchSchedule(date),
    staleTime: 1000 * 60, // 1 minute
  })

  const createSchedule = useMutation({
    mutationFn: createScheduleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, date.toISOString()] })
    },
  })

  const updateSchedule = useMutation({
    mutationFn: updateScheduleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, date.toISOString()] })
    },
  })

  const deleteSchedule = useMutation({
    mutationFn: deleteScheduleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, date.toISOString()] })
    },
  })

  const autoSchedule = useMutation({
    mutationFn: autoScheduleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, date.toISOString()] })
    },
  })

  return {
    scheduledTasks,
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    autoSchedule,
  }
}
