"use client"

import { cn } from "@/lib/utils"

interface RadarScanProps {
  className?: string
  dots?: { x: number; y: number; size: number; color: string; label?: string }[]
}

export function RadarScan({ className, dots = [] }: RadarScanProps) {
  return (
    <div className={cn("relative h-48 w-48", className)}>
      {/* Radar Grid */}
      <svg className="h-full w-full" viewBox="0 0 200 200">
        {/* Concentric circles */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(34, 211, 238, 0.06)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(34, 211, 238, 0.06)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(34, 211, 238, 0.06)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(34, 211, 238, 0.06)" strokeWidth="0.5" />

        {/* Crosshairs */}
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="0.5" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="0.5" />
        <line x1="36" y1="36" x2="164" y2="164" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="0.5" />
        <line x1="164" y1="36" x2="36" y2="164" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="0.5" />

        {/* Scanning line (rotating) */}
        <g className="animate-spin" style={{ transformOrigin: "100px 100px" }}>
          <path
            d="M100 100 L100 10 A90 90 0 0 1 190 100 Z"
            fill="rgba(34, 211, 238, 0.06)"
          />
        </g>

        {/* Threat Dots */}
        {dots.map((dot, i) => (
          <g key={i}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              fill={dot.color}
              className="animate-pulse"
            />
            {dot.label && (
              <text
                x={dot.x}
                y={dot.y - dot.size - 4}
                fill="rgba(255,255,255,0.6)"
                fontSize="8"
                textAnchor="middle"
              >
                {dot.label}
              </text>
            )}
            <circle
              cx={dot.x}
              cy={dot.y}
              r={dot.size + 4}
              fill="none"
              stroke={dot.color}
              strokeWidth="0.5"
              className="animate-pulse-radar"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
