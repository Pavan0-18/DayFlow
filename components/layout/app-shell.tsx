"use client"

import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { ParticleField } from "@/components/spider/particle-field"
import { KeyboardShortcutModal } from "@/components/shared/keyboard-shortcut-modal"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[#020617] spider-web-bg">
      <KeyboardShortcutModal />
      {/* Ambient particle field */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ParticleField count={20} color="rgba(225, 29, 72, 0.15)" speed={0.5} />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex relative z-10" />

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col">
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
