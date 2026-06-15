"use client"

import { useState } from "react"
import { useTasks } from "@/hooks/use-tasks"
import { useSchedule } from "@/hooks/use-schedule"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassPanel } from "@/components/spider/glass-panel"
import { Plus, Clock, Search, Target } from "lucide-react"
import { Priority } from "@prisma/client"
import { showSuccessToast, showErrorToast } from "@/lib/notifications/show-toasts"
import { format, addMinutes, parseISO } from "date-fns"
import { EmptyState } from "@/components/shared/empty-state"

interface PatrolStopSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
}

export function PatrolStopSheet({ open, onOpenChange, date }: PatrolStopSheetProps) {
  const { activeTasks } = useTasks()
  const { createSchedule } = useSchedule(date)
  const [search, setSearch] = useState("")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [startTime, setStartTime] = useState("09:00")
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM)

  const filtered = activeTasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSchedule = async () => {
    if (!selectedTask) return
    const [h, m] = startTime.split(":").map(Number)
    const startMinutes = h * 60 + m
    const endMinutes = startMinutes + 30
    const endH = Math.floor(endMinutes / 60)
    const endM = endMinutes % 60
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`

    createSchedule.mutate(
      {
        taskId: selectedTask,
        date,
        startTime,
        endTime,
        priority,
        duration: 30,
      },
      {
        onSuccess: () => {
          showSuccessToast("Patrol stop added")
          onOpenChange(false)
          setSelectedTask(null)
        },
        onError: (err) => {
          showErrorToast("Failed to add stop", err.message)
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg border-l border-white/10 bg-black/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-[#E11D48]" />
            Add Patrol Stop
          </SheetTitle>
          <SheetDescription>
            Select a mission to schedule for {format(date, "MMM d, yyyy")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {selectedTask ? (
            <div className="space-y-4">
              <GlassPanel variant="default" className="p-4">
                <div className="text-sm text-muted-foreground mb-2">Selected mission</div>
                <p className="text-white font-medium">
                  {activeTasks.find((t) => t.id === selectedTask)?.icon}{" "}
                  {activeTasks.find((t) => t.id === selectedTask)?.title}
                </p>
              </GlassPanel>

              <div className="space-y-2">
                <Label className="text-white text-sm">Patrol time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-32 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Priority level</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High — Critical threat</SelectItem>
                    <SelectItem value="MEDIUM">Medium — Standard patrol</SelectItem>
                    <SelectItem value="LOW">Low — Routine check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedTask(null)} className="border-white/10">
                  Back
                </Button>
                <Button
                  onClick={handleSchedule}
                  disabled={createSchedule.isPending}
                  className="bg-[#E11D48] hover:bg-[#E11D48]/80"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {createSchedule.isPending ? "Scheduling..." : "Add to Patrol"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search missions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1">
                {filtered.length === 0 ? (
                  <EmptyState
                    icon={Target}
                    title="No missions available"
                    description="Create a mission first from the Mission Board"
                  />
                ) : (
                  filtered.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className="w-full text-left rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{task.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.category}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
