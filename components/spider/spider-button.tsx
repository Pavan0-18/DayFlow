"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

interface SpiderButtonProps extends React.ComponentProps<typeof Button> {
  webEffect?: boolean
}

export function SpiderButton({
  children,
  className,
  webEffect = false,
  onClick,
  ...props
}: SpiderButtonProps) {
  const [showWeb, setShowWeb] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (webEffect) {
      setShowWeb(true)
      setTimeout(() => setShowWeb(false), 600)
    }
    onClick?.(e)
  }

  return (
    <div className="relative inline-flex">
      <Button
        className={cn(
          "web-shoot-btn relative overflow-hidden",
          "bg-gradient-to-r from-[#E11D48] to-[#1D4ED8]",
          "hover:from-[#E11D48] hover:to-[#2563EB]",
          "shadow-[0_0_20px_rgba(225,29,72,0.3)]",
          "hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]",
          "transition-all duration-300",
          "font-bold tracking-wide uppercase",
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>

      {/* Web-shoot effect */}
      {showWeb && webEffect && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <motion.div
              key={angle}
              className="absolute top-1/2 left-1/2 h-[1px] origin-left"
              style={{
                background: `linear-gradient(90deg, rgba(255,255,255,0.8), transparent)`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                width: 0,
              }}
              initial={{ width: 0, opacity: 0.8 }}
              animate={{
                width: [0, 60, 0],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
