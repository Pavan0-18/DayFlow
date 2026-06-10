"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonTaskCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
