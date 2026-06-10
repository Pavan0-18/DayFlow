"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"
import { NotificationBell } from "@/components/notifications/notification-bell"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const today = new Date()

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-md lg:px-8",
        className
      )}
    >
      {/* Date display */}
      <div>
        <h1 className="text-lg font-semibold">
          {format(today, "EEEE, MMMM d")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(today, "yyyy")}
        </p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
