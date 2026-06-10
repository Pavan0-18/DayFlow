'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ShortcutConfig {
  key: string
  handler: () => void
  modifier?: 'ctrl' | 'meta' | 'alt' | 'shift'
}

export function useKeyboardShortcuts() {
  const router = useRouter()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    // Navigation shortcuts with 'g' prefix
    if (event.key === 'g') {
      const handleNextKey = (e: KeyboardEvent) => {
        switch (e.key.toLowerCase()) {
          case 'd':
            router.push('/dashboard')
            break
          case 't':
            router.push('/tasks')
            break
          case 's':
            router.push('/schedule')
            break
          case 'r':
            router.push('/reports')
            break
        }
        document.removeEventListener('keydown', handleNextKey)
      }
      document.addEventListener('keydown', handleNextKey, { once: true })
      return
    }

    // New task shortcut
    if (event.key === 'n') {
      // Dispatch custom event that components can listen for
      window.dispatchEvent(new CustomEvent('dayflow:new-task'))
      return
    }

    // Save shortcut (Ctrl+S or Cmd+S)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      window.dispatchEvent(new CustomEvent('dayflow:save'))
      return
    }

    // Help shortcut
    if (event.key === '?') {
      window.dispatchEvent(new CustomEvent('dayflow:show-help'))
      return
    }

    // Escape to close modals
    if (event.key === 'Escape') {
      window.dispatchEvent(new CustomEvent('dayflow:close-modal'))
      return
    }
  }, [router])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export function useShortcutHandler(eventName: string, handler: () => void) {
  useEffect(() => {
    const handleEvent = () => handler()
    window.addEventListener(`dayflow:${eventName}`, handleEvent)
    return () => window.removeEventListener(`dayflow:${eventName}`, handleEvent)
  }, [eventName, handler])
}
