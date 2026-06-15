"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { SpiderSense } from "@/components/spider/spider-sense"
import { Keyboard } from "lucide-react"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const today = new Date()

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-white/5 bg-[#0A0F1E]/60 backdrop-blur-xl px-4 lg:px-8 relative z-10",
        className
      )}
    >
      {/* Left: Spider Sense + Date */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <SpiderSense />
        </div>
        <div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {format(today, "EEEE, MMMM d")}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block h-1 w-1 rounded-full bg-green-400 animate-pulse" />
            City Status: <span className="text-green-400 font-medium">Secure</span>
            <span className="mx-1">·</span>
            {format(today, "yyyy")}
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('dayflow:show-help'))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
          title="Keyboard shortcuts"
        >
          <Keyboard className="h-3.5 w-3.5" />
        </button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
