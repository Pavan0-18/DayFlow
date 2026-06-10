'use client'

import { useState, useCallback } from 'react'

interface UseOptimisticToggleOptions {
  onToggle: (completed: boolean) => Promise<void>
  initialState?: boolean
}

export function useOptimisticToggle({ onToggle, initialState = false }: UseOptimisticToggleOptions) {
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const currentState = optimisticState ?? initialState

  const toggle = useCallback(async () => {
    const newState = !currentState
    
    // Optimistically update UI
    setOptimisticState(newState)
    setIsPending(true)
    setError(null)

    try {
      await onToggle(newState)
      // Success - keep the new state
      setOptimisticState(null)
    } catch (err) {
      // Error - revert to original state
      setOptimisticState(null)
      setError(err instanceof Error ? err : new Error('Toggle failed'))
      throw err
    } finally {
      setIsPending(false)
    }
  }, [currentState, onToggle])

  return {
    completed: currentState,
    isPending,
    error,
    toggle,
  }
}
