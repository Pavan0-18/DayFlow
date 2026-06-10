'use client'

import { useQuery } from '@tanstack/react-query'
import { AIInsight, TaskSuggestion } from '@/types'

const AI_KEY = 'ai'

async function fetchInsights(): Promise<AIInsight[]> {
  const response = await fetch('/api/ai/insights')
  if (!response.ok) throw new Error('Failed to fetch AI insights')
  const { data } = await response.json()
  return data
}

async function fetchTaskSuggestions(): Promise<TaskSuggestion[]> {
  const response = await fetch('/api/ai/suggest-tasks', {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to fetch task suggestions')
  const { data } = await response.json()
  return data
}

async function fetchDailyCoaching(): Promise<string> {
  const response = await fetch('/api/ai/coaching')
  if (!response.ok) throw new Error('Failed to fetch daily coaching')
  const { data } = await response.json()
  return data.message
}

export function useAIInsights() {
  return useQuery({
    queryKey: [AI_KEY, 'insights'],
    queryFn: fetchInsights,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

export function useTaskSuggestions(enabled: boolean = false) {
  return useQuery({
    queryKey: [AI_KEY, 'suggestions'],
    queryFn: fetchTaskSuggestions,
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useDailyCoaching(enabled: boolean = true) {
  return useQuery({
    queryKey: [AI_KEY, 'coaching', new Date().toDateString()],
    queryFn: fetchDailyCoaching,
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
