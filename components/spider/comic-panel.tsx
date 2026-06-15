"use client"

import { cn } from "@/lib/utils"

interface ComicPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "red" | "blue" | "purple"
}

export function ComicPanel({
  children,
  className,
  variant = "default",
  ...props
}: ComicPanelProps) {
  return (
    <div
      className={cn(
        "comic-panel rounded-xl bg-[#0F172A]/80 backdrop-blur-sm p-4",
        variant === "red" && "comic-panel-red",
        variant === "blue" && "comic-panel-blue",
        variant === "purple" && "comic-panel-purple",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
