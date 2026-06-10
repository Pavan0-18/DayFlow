'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UserAchievementWithProgress } from '@/types'

const ACHIEVEMENTS_KEY = 'achievements'

async function fetchAchievements(): Promise<UserAchievementWithProgress[]> {
  const response = await fetch('/api/reports/achievements')
  if (!response.ok) throw new Error('Failed to fetch achievements')
  const { data } = await response.json()
  return data
}

export function useAchievements() {
  const queryClient = useQueryClient()

  const { data: achievements = [], isLoading, error } = useQuery({
    queryKey: [ACHIEVEMENTS_KEY],
    queryFn: fetchAchievements,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt !== null)
  const lockedAchievements = achievements.filter((a) => a.unlockedAt === null)
  const unlockedCount = unlockedAchievements.length
  const totalCount = achievements.length
  const progressPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [ACHIEVEMENTS_KEY] })
  }

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    unlockedCount,
    totalCount,
    progressPercentage,
    isLoading,
    error,
    refresh,
  }
}
