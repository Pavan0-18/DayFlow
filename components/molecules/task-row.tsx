"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"
import { CategoryBadge } from "@/components/atoms/category-badge"
import { Switch } from "@/components/ui/switch"

interface TaskRowProps {
  id: string
  title: string
  icon: string
  category: string
  color: string
  isActive: boolean
  onToggleActive: (isActive: boolean) => void
  onEdit: () => void
  className?: string
}

export function TaskRow({
  id,
  title,
  icon,
  category,
  color,
  isActive,
  onToggleActive,
  onEdit,
  className,
}: TaskRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-card p-3 transition-all",
        isDragging && "opacity-50 shadow-lg",
        !isActive && "opacity-60",
        className
      )}
    >
      {/* Drag handle */}
      <button
        className="cursor-grab text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Color indicator */}
      <div
        className="h-8 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <span className="text-xl">{icon}</span>

      {/* Title */}
      <span
        className={cn(
          "flex-1 font-medium",
          !isActive && "text-muted-foreground"
        )}
        onClick={onEdit}
        role="button"
      >
        {title}
      </span>

      {/* Category */}
      <CategoryBadge category={category} />

      {/* Active toggle */}
      <Switch checked={isActive} onCheckedChange={onToggleActive} />
    </div>
  )
}
