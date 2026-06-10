"use client"

import { ErrorState } from "@/components/shared/error-state"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Something went wrong"
      description={error.message || "An unexpected error occurred."}
      onRetry={reset}
    />
  )
}
