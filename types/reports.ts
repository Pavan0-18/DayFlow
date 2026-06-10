export interface CategoryBreakdown {
  category: string
  completed: number
  total: number
  rate: number
}

export interface DashboardStats {
  todayCompleted: number
  todayTotal: number
  todayPercentage: number
  currentStreak: number
  bestStreak: number
  weeklyAverage: number
  totalTasks: number
}

export interface StreakData {
  currentStreak: number
  bestStreak: number
  perfectDays: number
}

export interface ReportFilters {
  startDate?: Date
  endDate?: Date
  category?: string
}

export interface HeatmapData {
  date: Date
  value: number
}

export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface ComparisonData {
  current: number
  previous: number
  change: number
  changePercentage: number
}
