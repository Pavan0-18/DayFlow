"use client"

import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "holographic"
  hover?: boolean
}

export function GlassPanel({
  children,
  className,
  variant = "default",
  hover = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        variant === "default" && "glass-panel",
        variant === "strong" && "glass-panel-strong",
        variant === "holographic" && "glass-panel holographic holographic-border",
        "rounded-xl",
        hover && "hover-glow transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
