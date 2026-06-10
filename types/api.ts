// API Response types
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// API Error types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// Query params types
export interface DateRangeParams {
  startDate: string
  endDate: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

// Webhook types (if needed in future)
export interface WebhookPayload<T> {
  event: string
  data: T
  timestamp: string
}
