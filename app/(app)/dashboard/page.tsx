"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useDailyLog } from "@/hooks/use-daily-log"
import { useDashboardStats } from "@/hooks/use-reports"
import { ProgressRing } from "@/components/molecules/progress-ring"
import { CompletionPercentage } from "@/components/atoms/completion-percentage"
import { TaskCard } from "@/components/molecules/task-card"
import { SkeletonTaskCard } from "@/components/molecules/skeleton-task-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { getMotivationalMessage } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Plus, CheckSquare } from "lucide-react"
import { addDays, subDays, isToday, isAfter, startOfDay } from "date-fns"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function DashboardPage() {
  const [date, setDate] = useState(new Date())
  const { log, items, completedCount, totalCount, completionPercentage, isLoading, error, toggleTask } = useDailyLog(date)
  const { data: stats } = useDashboardStats()

  const canGoForward = !isToday(date)
  const message = getMotivationalMessage(completionPercentage)

  // Trigger confetti on 100% completion
  useEffect(() => {
    if (completionPercentage === 100 && totalCount > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [completionPercentage, totalCount])

  const handlePreviousDay = () => {
    setDate((prev) => subDays(prev, 1))
  }

  const handleNextDay = () => {
    if (canGoForward) {
      setDate((prev) => addDays(prev, 1))
    }
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        description="There was an error loading your daily tasks."
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Date Navigator */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {isToday(date) ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextDay}
          disabled={!canGoForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Completion Hero */}
        <motion.div
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border bg-card/70 p-8 shadow-xl backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10" />
          <div className="relative flex flex-col items-center">
          <ProgressRing percentage={completionPercentage} size={200}>
            <div className="text-center">
              <span className="text-4xl font-bold">{completedCount}</span>
              <span className="text-muted-foreground">/{totalCount}</span>
              <p className="text-sm text-muted-foreground">tasks done</p>
            </div>
          </ProgressRing>
          
          <div className="mt-6 text-center">
            <p className={`text-lg font-medium ${message.color}`}>
              {message.emoji} {message.text}
            </p>
          </div>

          {stats && (
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span>🔥 {stats.currentStreak} day streak</span>
              <span>•</span>
              <span>{stats.weeklyAverage}% weekly avg</span>
            </div>
          )}
          </div>
        </motion.div>

        {/* Task Checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Your Tasks</h3>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} completed
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <SkeletonTaskCard />
              <SkeletonTaskCard />
              <SkeletonTaskCard />
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks for today"
              description="Add some tasks to get started with your daily routine."
              action={{
                label: "Add Task",
                onClick: () => { window.location.href = "/tasks" },
              }}
            />
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskCard
                    id={item.task.id}
                    title={item.task.title}
                    color={item.task.color}
                    icon={item.task.icon}
                    category={item.task.category}
                    completed={item.completed}
                    onToggle={(completed) => toggleTask.mutate({ taskId: item.task.id, date, completed })}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add FAB */}
      <motion.div
        className="fixed bottom-24 right-4 lg:bottom-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => window.location.href = "/tasks"}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  )
}
