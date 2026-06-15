"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SpiderNav } from "@/components/spider/spider-nav"
import { RankBadge, getRankFromXp } from "@/components/spider/rank-badge"
import { NySkyline } from "@/components/spider/ny-skyline"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useStreaks } from "@/hooks/use-streak"
import { motion } from "framer-motion"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: streaks } = useStreaks()
  const { rank } = getRankFromXp((streaks?.currentStreak || 0) * 50)

  return (
    <div
      className={cn(
        "flex flex-col border-r border-white/5 bg-[#0A0F1E]/90 backdrop-blur-xl transition-all duration-300 relative overflow-hidden",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Decorative skyline at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-30">
        <NySkyline variant="night" />
      </div>

      {/* Logo / Spider-HQ */}
      <div className="relative z-10 flex h-16 items-center justify-between border-b border-white/5 px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E11D48] to-[#1D4ED8] text-white font-bold text-sm shadow-lg group-hover:shadow-[#E11D48]/30 transition-shadow">
              SV
            </div>
            <div>
              <span className="block text-xs font-semibold text-white tracking-wider">SPIDER-VERSE</span>
              <span className="block text-[10px] text-muted-foreground">Command Center</span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E11D48] to-[#1D4ED8] text-white font-bold text-sm shadow-lg">
            SV
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-7 w-7 text-muted-foreground hover:text-white", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Rank Badge */}
      {!collapsed && (
        <div className="relative z-10 px-4 pt-4">
          <RankBadge
            rank={rank}
            xp={(streaks?.currentStreak || 0) * 50}
            nextRankXp={500}
          />
        </div>
      )}

      {!collapsed && streaks && streaks.currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-4 mt-3 rounded-lg border border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent p-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-400">
              {streaks.currentStreak} day streak 🔥
            </span>
          </div>
        </motion.div>
      )}

      {/* Spider Navigation */}
      <ScrollArea className="relative z-10 flex-1 py-4">
        <SpiderNav collapsed={collapsed} />
      </ScrollArea>

      {/* Bottom indicator */}
      <div className="relative z-10 border-t border-white/5 p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground">
              Spider Sense: <span className="text-green-400">Active</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
