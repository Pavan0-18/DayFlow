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
        "flex flex-col border-r border-border/50 bg-card/90 backdrop-blur-xl transition-all duration-300 relative h-screen sticky top-0 self-start",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Decorative skyline at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-30">
        <NySkyline variant="night" />
      </div>

      {/* Logo / Spider-HQ */}
      <div className="relative z-10 flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg shadow-lg group-hover:shadow-[#E11D48]/30 transition-shadow">
              <img
                src="/spiderman.jpeg"
                alt="Spider-Verse"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="block text-xs font-semibold text-foreground tracking-wider">SPIDER-VERSE</span>
              <span className="block text-[10px] text-muted-foreground">Command Center</span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg shadow-lg">
            <img
              src="/spiderman.jpeg"
              alt="SV"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-7 w-7 text-muted-foreground hover:text-foreground", collapsed && "mx-auto")}
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
          className="relative z-10 mx-4 mt-3 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              {streaks.currentStreak} day streak 🔥
            </span>
          </div>
        </motion.div>
      )}

      {/* Spider Navigation */}
      <ScrollArea className="relative z-10 flex-1 py-4">
        <SpiderNav collapsed={collapsed} />
      </ScrollArea>

      {/* Bottom spacer (SpiderSense status is inside SpiderNav) */}
      <div className="relative z-10" />
    </div>
  )
}
