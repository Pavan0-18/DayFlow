"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonChartProps {
  height?: number
}

export function SkeletonChart({ height = 200 }: SkeletonChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  )
}
