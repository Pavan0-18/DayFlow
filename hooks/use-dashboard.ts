"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  Task,
  DailyLog,
  DailyLogItem,
  UserSettings,
  UserAchievement,
} from "@prisma/client"

type DashboardLogItem = DailyLogItem & {
  task: { id: string; title: string; color: string; icon: string; category: string }
}

type DashboardResponse = {
  log: (DailyLog & { items: DashboardLogItem[] }) | null
  items: DashboardLogItem[]
  completedCount: number
  totalCount: number
  completionPercentage: number
  tasks: Task[]
  activeTasks: Task[]
  inactiveTasks: Task[]
  streaks: { currentStreak: number; bestStreak: number; perfectDays: number }
  achievements: UserAchievement[]
  settings: UserSettings | null
  weeklyAverage: number
}

const DASHBOARD_KEY = ["dashboard"]

async function fetchDashboard(): Promise<DashboardResponse> {
  const res = await fetch("/api/dashboard")
  if (!res.ok) throw new Error("Failed to fetch dashboard data")
  const { data } = await res.json()
  return data
}

export function useDashboard() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: fetchDashboard,
    staleTime: 1000 * 30,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY })
  }

  return {
    ...data ?? {
      log: null,
      items: [],
      completedCount: 0,
      totalCount: 0,
      completionPercentage: 0,
      tasks: [],
      activeTasks: [],
      inactiveTasks: [],
      streaks: { currentStreak: 0, bestStreak: 0, perfectDays: 0 },
      achievements: [],
      settings: null,
      weeklyAverage: 0,
    },
    isLoading,
    error,
    invalidate,
  }
}
