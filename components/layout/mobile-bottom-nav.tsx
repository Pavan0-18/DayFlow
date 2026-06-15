"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Target,
  Calendar,
  FileBarChart,
  Settings2,
} from "lucide-react"
import { motion } from "framer-motion"

interface MobileBottomNavProps {
  className?: string
}

const navItems = [
  { href: "/dashboard", label: "Spider HQ", icon: LayoutDashboard },
  { href: "/tasks", label: "Missions", icon: Target },
  { href: "/schedule", label: "Patrol", icon: Calendar },
  { href: "/reports", label: "Case Files", icon: FileBarChart },
  { href: "/settings", label: "Suit Lab", icon: Settings2 },
]

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-200",
                isActive
                  ? "text-[#E11D48]"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute -top-[1px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#E11D48]"
                />
              )}
              <Icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "font-bold" : ""
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
