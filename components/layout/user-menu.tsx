"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, Shield, User } from "lucide-react"
import Link from "next/link"
import { useStreaks } from "@/hooks/use-streak"
import { getRankFromXp } from "@/components/spider/rank-badge"

export function UserMenu() {
  const { data: session } = useSession()
  const { data: streaks } = useStreaks()
  const user = session?.user
  const { rank } = getRankFromXp((streaks?.currentStreak || 0) * 50)
  const rankConfigMap: Record<string, { label: string }> = {
    "new-recruit": { label: "New Recruit" },
    "neighborhood-hero": { label: "Neighborhood Hero" },
    "spider-operative": { label: "Spider Operative" },
    "web-master": { label: "Web Master" },
    "spider-elite": { label: "Spider Elite" },
    "spider-legend": { label: "Spider Legend" },
  }

  if (!user) return null

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-[#E11D48]/30 hover:ring-[#E11D48]/50 transition-all">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback className="bg-gradient-to-br from-[#1D4ED8] to-[#E11D48] text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Active indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0A0F1E] bg-green-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 border-white/10 bg-[#0F172A]/95 backdrop-blur-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-[#E11D48]" />
              <span className="text-[10px] font-medium text-[#E11D48] uppercase tracking-wider">
                {rankConfigMap[rank]?.label || "Spider Operative"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <Link href="/settings">
          <DropdownMenuItem className="text-muted-foreground hover:text-white focus:text-white">
            <Settings className="mr-2 h-4 w-4" />
            Suit Configuration
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="text-muted-foreground hover:text-red-400 focus:text-red-400"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
