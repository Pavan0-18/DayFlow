"use client"

import { useState } from "react"
import { useSchedule } from "@/hooks/use-schedule"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, Sparkles, Plus } from "lucide-react"
import { addDays, subDays, format, isToday, startOfDay } from "date-fns"
import { PriorityIndicator } from "@/components/atoms/priority-indicator"
import { TimeChip } from "@/components/atoms/time-chip"
import { EmptyState } from "@/components/shared/empty-state"
import { motion } from "framer-motion"

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 6 AM to 10 PM

export default function SchedulePage() {
  const [date, setDate] = useState(new Date())
  const { scheduledTasks, isLoading, autoSchedule } = useSchedule(date)

  const canGoForward = !isToday(date)

  const handlePreviousDay = () => {
    setDate((prev) => subDays(prev, 1))
  }

  const handleNextDay = () => {
    if (canGoForward) {
      setDate((prev) => addDays(prev, 1))
    }
  }

  const handleAutoSchedule = () => {
    autoSchedule.mutate(date)
  }

  // Group tasks by hour
  const tasksByHour = HOURS.map((hour) => {
    const hourStr = `${hour.toString().padStart(2, "0")}:00`
    const tasks = scheduledTasks.filter((t) => {
      const taskHour = parseInt(t.startTime.split(":")[0])
      return taskHour === hour
    })
    return { hour, hourStr, tasks }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Plan your day hour by hour"
      />

      {/* Date Navigator */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {isToday(date) ? "Today" : format(date, "EEEE")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {format(date, "MMMM d, yyyy")}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={handleNextDay} disabled={!canGoForward}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleAutoSchedule}
          disabled={autoSchedule.isPending}
        >
          <Sparkles className="h-4 w-4" />
          Auto-Schedule
        </Button>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {tasksByHour.map(({ hour, hourStr, tasks }) => (
          <div key={hour} className="flex gap-4">
            <div className="w-16 flex-shrink-0 text-right text-sm text-muted-foreground">
              {format(new Date().setHours(hour, 0), "h a")}
            </div>
            <div className="flex-1 min-h-[60px] rounded-lg border bg-card p-2">
              {tasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                  Free
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-lg p-2"
                      style={{ backgroundColor: `${task.task.color}20` }}
                    >
                      <div className="flex items-center gap-2">
                        <span>{task.task.icon}</span>
                        <span className="font-medium text-sm">{task.task.title}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <TimeChip time={task.startTime} />
                        <PriorityIndicator priority={task.priority} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {scheduledTasks.length === 0 && !isLoading && (
        <EmptyState
          icon={Calendar}
          title="No tasks scheduled"
          description="Use Auto-Schedule or add tasks manually to plan your day."
          action={{
            label: "Auto-Schedule",
            onClick: handleAutoSchedule,
          }}
        />
      )}
    </div>
  )
}
