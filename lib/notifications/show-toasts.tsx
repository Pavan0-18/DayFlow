'use client'

import { toast } from 'sonner'
import { CheckCircle2, Info, Sparkles, Trophy, XCircle } from 'lucide-react'

export interface UnlockedAchievement {
  id: string
  emoji: string
  name: string
  description: string
}

export function showSuccessToast(title: string, description?: string) {
  toast.success(title, {
    description,
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    className: 'toast-success',
  })
}

export function showErrorToast(title: string, description?: string) {
  toast.error(title, {
    description,
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    className: 'toast-error',
  })
}

export function showInfoToast(title: string, description?: string) {
  toast.info(title, {
    description,
    icon: <Info className="h-4 w-4 text-blue-500" />,
    className: 'toast-info',
  })
}

export function showAchievementToasts(achievements: UnlockedAchievement[]) {
  achievements.forEach((achievement, index) => {
    setTimeout(() => {
      toast.custom(
        () => (
          <div className="flex w-full max-w-sm items-start gap-3 rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-lg dark:border-amber-900/40 dark:from-amber-950/80 dark:to-orange-950/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-2xl animate-bounce-subtle">
              {achievement.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                <Trophy className="h-3.5 w-3.5" />
                Achievement unlocked
              </p>
              <p className="mt-0.5 font-semibold text-foreground">{achievement.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        ),
        { duration: 6000, className: 'toast-achievement' }
      )
    }, index * 400)
  })
}

export function showTaskCompletedToast(title: string) {
  toast.custom(
    () => (
      <div className="flex items-center gap-3 rounded-xl border border-green-200/60 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 shadow-lg dark:border-green-900/40 dark:from-green-950/80 dark:to-emerald-950/60">
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        <div>
          <p className="text-sm font-medium">Task completed!</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
        <Sparkles className="h-4 w-4 text-amber-500" />
      </div>
    ),
    { duration: 3000 }
  )
}

export function showBrowserNotificationToast(title: string, body: string) {
  toast(title, {
    description: body,
    icon: <Sparkles className="h-4 w-4 text-primary" />,
    duration: 5000,
  })
}
