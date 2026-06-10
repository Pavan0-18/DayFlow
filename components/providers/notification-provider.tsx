'use client'

import { ReactNode } from 'react'
import { useNotificationScheduler } from '@/hooks/use-notification-scheduler'

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  useNotificationScheduler()
  return <>{children}</>
}
