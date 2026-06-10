"use client"

import { cn } from "@/lib/utils"
import { CATEGORY_COLORS } from "@/lib/constants/categories"

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#64748B"
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {category}
    </span>
  )
}
