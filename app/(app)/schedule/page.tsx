"use client"

import { useState } from "react"
import { useSchedule } from "@/hooks/use-schedule"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, Sparkles, Plus, Map, Radar, Shield } from "lucide-react"
import { addDays, subDays, format, isToday } from "date-fns"
import { PriorityIndicator } from "@/components/atoms/priority-indicator"
import { TimeChip } from "@/components/atoms/time-chip"
import { EmptyState } from "@/components/shared/empty-state"
import { motion } from "framer-motion"
import { GlassPanel } from "@/components/spider/glass-panel"
import { ThreatLevel } from "@/components/spider/threat-level"
import { SpiderButton } from "@/components/spider/spider-button"
import { PatrolStopSheet } from "@/components/molecules/patrol-stop-sheet"
import { priorityToThreatLevel, CATEGORY_DISTRICTS } from "@/lib/constants/spider-theme"

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 6 AM to 10 PM

export default function PatrolRoutePage() {
  const [date, setDate] = useState(new Date())
  const [sheetOpen, setSheetOpen] = useState(false)
  const { scheduledTasks, isLoading, autoSchedule } = useSchedule(date)

  const canGoForward = !isToday(date)

  const handlePreviousDay = () => setDate((prev) => subDays(prev, 1))
  const handleNextDay = () => { if (canGoForward) setDate((prev) => addDays(prev, 1)) }

  const handleAutoSchedule = () => autoSchedule.mutate(date)

  // Group tasks by hour
  const tasksByHour = HOURS.map((hour) => {
    const hourStr = `${hour.toString().padStart(2, "0")}:00`
    const tasks = scheduledTasks.filter((t) => {
      const taskHour = parseInt(t.startTime.split(":")[0])
      return taskHour === hour
    })
    return { hour, hourStr, tasks }
  })

  const totalScheduled = scheduledTasks.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#1D4ED8]/20 border border-white/10">
            <Radar className="h-6 w-6 text-[#22D3EE]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">City Intel</h1>
            <p className="text-sm text-muted-foreground">
              Patrol Route · {totalScheduled} {totalScheduled === 1 ? "stop" : "stops"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Date Navigator */}
      <GlassPanel variant="default" className="p-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handlePreviousDay} className="text-muted-foreground hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-base font-semibold text-white">
              {isToday(date) ? "Today's Patrol" : format(date, "EEEE")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {format(date, "MMMM d, yyyy")}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextDay} disabled={!canGoForward} className="text-muted-foreground hover:text-white disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>

      {/* Actions */}
      <div className="flex gap-3">
        <SpiderButton
          webEffect
          onClick={handleAutoSchedule}
          disabled={autoSchedule.isPending}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Auto-Route
        </SpiderButton>
        <Button
          variant="outline"
          className="gap-2 border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
          onClick={() => setSheetOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Patrol Stop
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 ml-auto"
        >
          <Map className="h-4 w-4" />
          Map View
        </Button>
      </div>

      {/* Patrol Timeline */}
      <div className="relative space-y-1">
        {/* Timeline vertical line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-[#E11D48]/50 via-[#1D4ED8]/30 to-transparent" />

        {tasksByHour.map(({ hour, hourStr, tasks }) => (
          <div key={hour} className="relative flex gap-4 py-2">
            {/* Time marker */}
            <div className="relative z-10 w-16 flex-shrink-0 text-right">
              <span className="text-xs font-medium text-muted-foreground">
                {format(new Date(2024, 0, 1, hour, 0), "h a")}
              </span>
            </div>

            {/* Dot on timeline */}
            <div className="relative z-10 flex-shrink-0">
              <div className={`h-3 w-3 rounded-full border-2 ${
                tasks.length > 0 ? "border-[#E11D48] bg-[#E11D48]/50" : "border-white/10 bg-transparent"
              }`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-h-[60px]">
              {tasks.length === 0 ? (
                <div className="flex h-full items-center text-xs text-muted-foreground/50 italic">
                  Free patrol — no stops scheduled
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task, idx) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GlassPanel
                        variant="default"
                        className="p-3 border-l-4"
                        style={{
                          borderLeftColor: task.task.color || "#E11D48",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{task.task.icon}</span>
                              <span className="font-medium text-sm text-white truncate">
                                {task.task.title}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-white/10 text-muted-foreground"
                              >
                                {CATEGORY_DISTRICTS[task.task.category] || "NYC"}
                              </Badge>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                              <TimeChip time={task.startTime} />
                              <PriorityIndicator priority={task.priority} />
                              <ThreatLevel level={priorityToThreatLevel(task.priority)} showLabel={false} />
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </GlassPanel>
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
          icon={Map}
          title="No Patrol Route Planned"
          description="Use Auto-Route to generate an optimized patrol schedule, or add stops manually."
          action={{
            label: "Auto-Route",
            onClick: handleAutoSchedule,
          }}
        />
      )}

      <PatrolStopSheet open={sheetOpen} onOpenChange={setSheetOpen} date={date} />
    </div>
  )
}
