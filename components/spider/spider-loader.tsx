"use client"

import { cn } from "@/lib/utils"

interface SpiderLoaderProps {
  variant?: "swing" | "web-spin" | "radar"
  label?: string
  className?: string
}

export function SpiderLoader({
  variant = "swing",
  label,
  className,
}: SpiderLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {variant === "swing" && (
        <div className="relative">
          <svg width="60" height="80" viewBox="0 0 60 80" className="animate-web-swing">
            <line x1="30" y1="0" x2="30" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="30" cy="40" r="12" fill="none" stroke="#E11D48" strokeWidth="2" />
            <line x1="22" y1="48" x2="18" y2="58" stroke="#E11D48" strokeWidth="1.5" />
            <line x1="38" y1="48" x2="42" y2="58" stroke="#E11D48" strokeWidth="1.5" />
            <line x1="22" y1="48" x2="30" y2="55" stroke="#E11D48" strokeWidth="1.5" />
            <line x1="38" y1="48" x2="30" y2="55" stroke="#E11D48" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {variant === "web-spin" && (
        <div className="relative flex items-center justify-center">
          <svg width="60" height="60" viewBox="0 0 60 60" className="animate-spin">
            <defs>
              <linearGradient id="webSpinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="50%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <path
              d="M30 5 A25 25 0 0 1 55 30"
              fill="none"
              stroke="url(#webSpinGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1="30"
                y1="30"
                x2={30 + 25 * Math.cos((angle * Math.PI) / 180)}
                y2={30 + 25 * Math.sin((angle * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            ))}
            <circle cx="30" cy="30" r="4" fill="#E11D48" />
          </svg>
        </div>
      )}

      {variant === "radar" && (
        <div className="relative flex items-center justify-center">
          <div className="radar-grid h-20 w-20 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border border-cyan-400/30 animate-pulse-radar" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border border-cyan-400/20" />
          </div>
          <svg className="absolute inset-0 h-20 w-20 animate-spin" viewBox="0 0 80 80">
            <path
              d="M40 40 L40 0 A40 40 0 0 1 80 40 Z"
              fill="rgba(34, 211, 238, 0.08)"
            />
          </svg>
        </div>
      )}

      {label && (
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
    </div>
  )
}
