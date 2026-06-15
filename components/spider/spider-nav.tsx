"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Target,
  Calendar,
  FileBarChart,
  Settings,
  Bell,
  Search,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  icon: React.ElementType
  label: string
  spiderLabel: string
  href: string
  badge?: string | number
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", spiderLabel: "Spider HQ", href: "/dashboard" },
  { icon: Target, label: "Tasks", spiderLabel: "Missions", href: "/tasks" },
  { icon: Calendar, label: "Schedule", spiderLabel: "City Intel", href: "/schedule" },
  { icon: FileBarChart, label: "Reports", spiderLabel: "Case Files", href: "/reports" },
  { icon: Bell, label: "Notifications", spiderLabel: "Spider Sense", href: "/settings?tab=notifications" },
  { icon: Search, label: "Search", spiderLabel: "City Scanner", href: "/tasks" },
  { icon: Settings, label: "Settings", spiderLabel: "Suit Config", href: "/settings" },
]

interface SpiderNavProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function SpiderNav({ collapsed, onToggle }: SpiderNavProps) {
  const pathname = usePathname()
  const [, setHoveredItem] = useState<string | null>(null)

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname.startsWith(item.href) && item.href !== "#"

        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-[#E11D48]/20 to-transparent text-[#E11D48]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-[#E11D48]"
              />
            )}

            <Icon className="h-4 w-4 shrink-0" />

            {!collapsed && (
              <span className="truncate">
                <span className="block text-[10px] leading-none opacity-50">{item.label}</span>
                <span className="block text-xs leading-tight">{item.spiderLabel}</span>
              </span>
            )}

            {/* Badge */}
            {!collapsed && item.badge && (
              <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E11D48] px-1.5 text-[10px] font-bold text-white animate-pulse">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}

      {/* Spider Sense Status */}
      <div className="mt-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          {!collapsed && (
            <span className="text-[10px] text-muted-foreground">
              Spider Sense: <span className="text-green-400">Calm</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
