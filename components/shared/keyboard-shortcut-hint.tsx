"use client"

import { cn } from "@/lib/utils"

interface KeyboardShortcutHintProps {
  shortcut: string
  className?: string
}

export function KeyboardShortcutHint({
  shortcut,
  className,
}: KeyboardShortcutHintProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className
      )}
    >
      {shortcut}
    </kbd>
  )
}
