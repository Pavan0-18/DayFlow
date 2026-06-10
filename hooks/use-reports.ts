'use client'

import { useQuery } from '@tanstack/react-query'
import { DashboardStats, DailyReportData, WeeklyReportData, MonthlyReportData } from '@/types'
import { formatISO, startOfDay } from 'date-fns'

const REPORTS_KEY = 'reports'

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/reports/daily')
  if (!response.ok) throw new Error('Failed to fetch dashboard stats')
  const { data } = await response.json()
  return data
}

async function fetchDailyReport(date: Date): Promise<DailyReportData> {
  const formattedDate = formatISO(startOfDay(date))
  const response = await fetch(`/api/reports/daily?date=${encodeURIComponent(formattedDate)}`)
  if (!response.ok) throw new Error('Failed to fetch daily report')
  const { data } = await response.json()
  return data
}

async function fetchWeeklyReport(date: Date): Promise<WeeklyReportData> {
  const formattedDate = formatISO(startOfDay(date))
  const response = await fetch(`/api/reports/weekly?date=${encodeURIComponent(formattedDate)}`)
  if (!response.ok) throw new Error('Failed to fetch weekly report')
  const { data } = await response.json()
  return data
}

async function fetchMonthlyReport(date: Date): Promise<MonthlyReportData> {
  const formattedDate = formatISO(startOfDay(date))
  const response = await fetch(`/api/reports/monthly?date=${encodeURIComponent(formattedDate)}`)
  if (!response.ok) throw new Error('Failed to fetch monthly report')
  const { data } = await response.json()
  return data
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [REPORTS_KEY, 'dashboard'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export function useDailyReport(date: Date) {
  return useQuery({
    queryKey: [REPORTS_KEY, 'daily', date.toISOString()],
    queryFn: () => fetchDailyReport(date),
    staleTime: 1000 * 60, // 1 minute
  })
}

export function useWeeklyReport(date: Date) {
  return useQuery({
    queryKey: [REPORTS_KEY, 'weekly', date.toISOString()],
    queryFn: () => fetchWeeklyReport(date),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useMonthlyReport(date: Date) {
  return useQuery({
    queryKey: [REPORTS_KEY, 'monthly', date.toISOString()],
    queryFn: () => fetchMonthlyReport(date),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
