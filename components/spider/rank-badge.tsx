"use client"

import { cn } from "@/lib/utils"

type Rank =
  | "new-recruit"
  | "neighborhood-hero"
  | "spider-operative"
  | "web-master"
  | "spider-elite"
  | "spider-legend"

interface RankBadgeProps {
  rank: Rank
  xp?: number
  nextRankXp?: number
  className?: string
  showProgress?: boolean
}

const rankConfig: Record<Rank, { label: string; icon: string; xpRequired: number }> = {
  "new-recruit": { label: "New Recruit", icon: "🕷️", xpRequired: 0 },
  "neighborhood-hero": { label: "Neighborhood Hero", icon: "🏆", xpRequired: 500 },
  "spider-operative": { label: "Spider Operative", icon: "🕸️", xpRequired: 2000 },
  "web-master": { label: "Web Master", icon: "⚡", xpRequired: 5000 },
  "spider-elite": { label: "Spider Elite", icon: "🌟", xpRequired: 10000 },
  "spider-legend": { label: "Spider Legend", icon: "👑", xpRequired: 25000 },
}

export function RankBadge({
  rank,
  xp,
  nextRankXp,
  className,
  showProgress = true,
}: RankBadgeProps) {
  const config = rankConfig[rank]
  const progress = xp && nextRankXp ? Math.min((xp / nextRankXp) * 100, 100) : 0

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg",
          `rank-${rank}`,
          "border-current bg-black/40",
        )}
      >
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-bold tracking-wide", `rank-${rank}`)}>
          {config.label}
        </p>
        {showProgress && xp !== undefined && nextRankXp && (
          <div className="mt-1 space-y-0.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="xp-bar-fill h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {xp === nextRankXp ? `MAX · ${xp} XP` : `${xp} / ${nextRankXp} XP`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function getRankFromXp(xp: number): { rank: Rank; nextRankXp: number } {
  const ranks = Object.entries(rankConfig) as [Rank, typeof rankConfig[Rank]][]
  let currentRank: Rank = "new-recruit"
  let nextXp = 500

  for (const [rank, config] of ranks) {
    if (xp >= config.xpRequired) {
      currentRank = rank
    }
  }

  const currentIndex = ranks.findIndex(([r]) => r === currentRank)
  if (currentIndex < ranks.length - 1) {
    nextXp = ranks[currentIndex + 1][1].xpRequired
  } else {
    nextXp = rankConfig[currentRank].xpRequired
  }

  const isMaxRank = currentIndex === ranks.length - 1
  return { rank: currentRank, nextRankXp: isMaxRank ? xp : nextXp }
}
