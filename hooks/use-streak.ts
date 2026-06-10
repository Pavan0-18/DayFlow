'use client'

import { useQuery } from '@tanstack/react-query'

const STREAK_KEY = 'streaks'

interface StreakData {
  currentStreak: number
  bestStreak: number
  perfectDays: number
}

async function fetchStreaks(): Promise<StreakData> {
  const response = await fetch('/api/reports/streaks')
  if (!response.ok) throw new Error('Failed to fetch streaks')
  const { data } = await response.json()
  return data
}

export function useStreaks() {
  return useQuery({
    queryKey: [STREAK_KEY],
    queryFn: fetchStreaks,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
