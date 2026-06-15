"use client"

import { useEffect, useRef } from "react"

interface ParticleFieldProps {
  count?: number
  color?: string
  speed?: number
  className?: string
}

export function ParticleField({
  count = 30,
  color = "rgba(255,255,255,0.3)",
  speed = 1,
  className,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Track if the canvas is in view and tab is visible
    let isVisible = true
    let animationId: number

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && !document.hidden
        // Restart animation when scrolling back into view
        if (isVisible && !animationId) {
          animationId = requestAnimationFrame(animate)
        }
      },
      { threshold: 0 }
    )
    observer.observe(container)

    const onVisibilityChange = () => {
      if (!isVisible) return // observer handles scroll visibility
      if (document.hidden && animationId) {
        cancelAnimationFrame(animationId)
        animationId = 0
      } else if (!document.hidden && !animationId) {
        animationId = requestAnimationFrame(animate)
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * speed,
        vy: (Math.random() - 0.5) * 0.3 * speed,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const context = ctx as CanvasRenderingContext2D

    function animate() {
      if (!isVisible || document.hidden) {
        animationId = 0
        return
      }

      context.clearRect(0, 0, w, h)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        context.beginPath()
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        context.fillStyle = color
        context.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [count, color, speed])

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
