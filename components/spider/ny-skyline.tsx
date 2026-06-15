"use client"

import { cn } from "@/lib/utils"

interface NySkylineProps {
  className?: string
  variant?: "day" | "night" | "sunset"
}

export function NySkyline({ className, variant = "night" }: NySkylineProps) {
  const buildings = [
    { h: 40, w: 20, x: 0 },
    { h: 55, w: 15, x: 22 },
    { h: 35, w: 18, x: 39 },
    { h: 70, w: 22, x: 59 },
    { h: 45, w: 16, x: 83 },
    { h: 30, w: 20, x: 101 },
    { h: 60, w: 18, x: 123 },
    { h: 85, w: 20, x: 143 },
    { h: 50, w: 14, x: 165 },
    { h: 65, w: 20, x: 181 },
    { h: 40, w: 16, x: 203 },
    { h: 75, w: 18, x: 221 },
    { h: 38, w: 15, x: 241 },
    { h: 55, w: 20, x: 258 },
    { h: 45, w: 14, x: 280 },
    { h: 90, w: 22, x: 296 },
    { h: 35, w: 16, x: 320 },
    { h: 60, w: 15, x: 338 },
    { h: 70, w: 18, x: 355 },
    { h: 42, w: 20, x: 375 },
    { h: 50, w: 14, x: 397 },
    { h: 80, w: 20, x: 413 },
    { h: 55, w: 16, x: 435 },
    { h: 65, w: 18, x: 453 },
    { h: 38, w: 22, x: 473 },
  ]

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Sky gradient */}
      <div
        className={cn(
          "absolute inset-0",
          variant === "night" && "bg-gradient-to-b from-[#020617] via-[#0F172A] to-[#1e293b]",
          variant === "day" && "bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700",
          variant === "sunset" && "bg-gradient-to-b from-purple-900 via-orange-800 to-red-900",
        )}
      />

      {/* Stars */}
      {variant === "night" && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `city-lights ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Moon */}
      {variant === "night" && (
        <div className="absolute right-[20%] top-[20%] h-6 w-6 rounded-full bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="absolute right-1 top-0.5 h-5 w-5 rounded-full bg-[#020617]" />
        </div>
      )}

      {/* Buildings */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end px-4">
        {buildings.map((b, i) => (
          <div
            key={i}
            className="relative"
            style={{
              height: `${b.h}px`,
              width: `${b.w}px`,
              marginRight: i < buildings.length - 1 ? `${b.x - (buildings[i + 1]?.x || 0) + (buildings[i - 1] ? 0 : b.w)}px` : undefined,
            }}
          >
            {/* Building body */}
            <div
              className={cn(
                "h-full w-full rounded-t-sm",
                variant === "night"
                  ? "bg-slate-900/60"
                  : "bg-slate-800/60",
              )}
            />

            {/* Windows */}
            {i % 3 !== 0 && (
              <div className="absolute inset-0 p-0.5">
                {Array.from({ length: Math.floor(b.h / 8) }).map((_, row) => (
                  <div key={row} className="flex gap-0.5" style={{ marginTop: row * 8 }}>
                    {Array.from({ length: Math.floor(b.w / 5) }).map((_, col) => (
                      <div
                        key={col}
                        className={cn(
                          "h-1 w-1 rounded-[0.5px]",
                          Math.random() > 0.4
                            ? variant === "night"
                              ? Math.random() > 0.3
                                ? "bg-yellow-400/40"
                                : "bg-cyan-400/30"
                              : "bg-yellow-400/60"
                            : "bg-transparent",
                        )}
                        style={{
                          animation: Math.random() > 0.7
                            ? `city-lights ${Math.random() * 2 + 1}s ease-in-out infinite`
                            : "none",
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Spider-Man Silhouette */}
      <div className="absolute bottom-[55px] right-[60px] text-[30px] opacity-20 select-none">
        🕷️
      </div>
    </div>
  )
}
