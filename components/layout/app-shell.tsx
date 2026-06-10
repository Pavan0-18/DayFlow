"use client"

import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MobileBottomNav } from "./mobile-bottom-nav"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background app-gradient-bg">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        <Header />
        
        <main className={cn("flex-1 p-4 pb-24 lg:p-8", className)}>
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav className="lg:hidden" />
      </div>
    </div>
  )
}
