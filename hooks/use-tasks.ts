'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types'
import { showErrorToast, showSuccessToast } from '@/lib/notifications/show-toasts'

const TASKS_KEY = 'tasks'

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json()
    return body.error ?? fallback
  } catch {
    return fallback
  }
}

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks')
  if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch tasks'))
  const { data } = await response.json()
  return data
}

async function createTaskApi(input: CreateTaskInput): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error(await parseError(response, 'Failed to create task'))
  const { data } = await response.json()
  return data
}

async function updateTaskApi(input: UpdateTaskInput & { id: string }): Promise<Task> {
  const response = await fetch(`/api/tasks/${input.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error(await parseError(response, 'Failed to update task'))
  const { data } = await response.json()
  return data
}

async function deleteTaskApi(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error(await parseError(response, 'Failed to delete task'))
}

async function reorderTasksApi(taskIds: string[]): Promise<void> {
  const response = await fetch('/api/tasks/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskIds }),
  })
  if (!response.ok) throw new Error(await parseError(response, 'Failed to reorder tasks'))
}

function invalidateRelatedQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
  queryClient.invalidateQueries({ queryKey: ['daily-log'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
  queryClient.invalidateQueries({ queryKey: ['streaks'] })
}

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: [TASKS_KEY],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5,
  })

  const createTask = useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      invalidateRelatedQueries(queryClient)
      showSuccessToast('Task created')
    },
    onError: (err: Error) => showErrorToast('Failed to create task', err.message),
  })

  const updateTask = useMutation({
    mutationFn: updateTaskApi,
    onSuccess: () => {
      invalidateRelatedQueries(queryClient)
      showSuccessToast('Task updated')
    },
    onError: (err: Error) => showErrorToast('Failed to update task', err.message),
  })

  const deleteTask = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      invalidateRelatedQueries(queryClient)
      showSuccessToast('Task deleted')
    },
    onError: (err: Error) => showErrorToast('Failed to delete task', err.message),
  })

  const reorderTasks = useMutation({
    mutationFn: reorderTasksApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
    onError: (err: Error) => showErrorToast('Failed to reorder tasks', err.message),
  })

  const activeTasks = tasks.filter((t) => t.isActive)
  const inactiveTasks = tasks.filter((t) => !t.isActive)
  const activeTaskCount = activeTasks.length

  return {
    tasks,
    activeTasks,
    inactiveTasks,
    activeTaskCount,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
  }
}
