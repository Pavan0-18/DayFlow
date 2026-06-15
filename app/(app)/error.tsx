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
      title="⚠️ Symbiote Corruption Detected"
      description={error.message || "The system has encountered a symbiote-level threat. Your connection to the Spider-Verse may be compromised. Try again or contact the command center."}
      onRetry={reset}
    />
  )
}
