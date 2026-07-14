"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Shield, Target, Calendar } from "lucide-react"

const STORAGE_KEY = "dayflow:onboarding-done"

interface Step {
  icon: React.ReactNode
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Welcome to Spider HQ",
    description: "Your command center for daily missions. Track tasks, maintain streaks, and earn achievements as you save the city — one completed task at a time.",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Create & Manage Missions",
    description: "Head to the Mission Board to create tasks organized by category. Each category maps to a NYC district. Drag to reorder, click to complete.",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Plan Your Patrol",
    description: "Use the City Intel schedule to auto-plan your day. Enable Auto-Pilot and DayFlow will arrange your missions for maximum efficiency.",
  },
]

export function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      const timer = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
    } else {
      dismiss()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30 mb-6">
                <div className="text-primary">{steps[step].icon}</div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{steps[step].title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {steps[step].description}
              </p>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 my-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-border",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={dismiss}
                className="text-xs text-muted-foreground"
              >
                Skip tour
              </Button>
              <Button
                size="sm"
                onClick={next}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                {step < steps.length - 1 ? "Next" : "Get Started"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
