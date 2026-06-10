'use client'

import { Bell, BellOff, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  getNotificationPermission,
  isBrowserNotificationSupported,
  requestNotificationPermission,
  showBrowserNotification,
} from '@/lib/notifications/browser-notifications'
import { showBrowserNotificationToast, showInfoToast } from '@/lib/notifications/show-toasts'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function NotificationBell() {
  const [mounted, setMounted] = useState(false)
  const [permission, setPermission] = useState<
    ReturnType<typeof getNotificationPermission>
  >('unsupported')

  useEffect(() => {
    setMounted(true)
    setPermission(getNotificationPermission())
  }, [])

  if (!mounted || !isBrowserNotificationSupported()) return null

  const handleClick = async () => {
    if (permission === 'granted') {
      const sent = showBrowserNotification({
        title: 'DayFlow notifications are active',
        body: 'You will receive reminders and achievement alerts.',
        tag: 'dayflow-test',
      })
      if (sent) {
        showBrowserNotificationToast('Notifications working', 'Test notification sent successfully.')
      }
      return
    }

    if (permission === 'denied') {
      showInfoToast(
        'Notifications blocked',
        'Enable notifications for this site in your browser settings.'
      )
      return
    }

    const result = await requestNotificationPermission()
    setPermission(result)

    if (result === 'granted') {
      showBrowserNotification({
        title: 'DayFlow notifications enabled',
        body: 'You will get daily reminders and achievement alerts.',
        tag: 'dayflow-enabled',
      })
      showBrowserNotificationToast('Notifications enabled', 'Reminders and alerts are now active.')
    }
  }

  const Icon =
    permission === 'granted' ? BellRing : permission === 'denied' ? BellOff : Bell

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={cn(
              'relative transition-all',
              permission === 'granted' && 'text-primary hover:text-primary'
            )}
            aria-label="Notification settings"
          >
            <Icon className="h-5 w-5" />
            {permission === 'granted' && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {permission === 'granted'
            ? 'Notifications on — click to test'
            : permission === 'denied'
              ? 'Notifications blocked in browser'
              : 'Enable notifications'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
