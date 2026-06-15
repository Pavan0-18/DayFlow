"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useDailyReport } from "@/hooks/use-reports"
import { GlassPanel } from "@/components/spider/glass-panel"
import { ProgressRing } from "@/components/molecules/progress-ring"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ScrollText, ChevronLeft, ChevronRight, FileSearch } from "lucide-react"
import { addDays, subDays, isToday, format } from "date-fns"

export default function DailyReportPage() {
  const [date, setDate] = useState(new Date())
  const { data: report, isLoading } = useDailyReport(date)
  const canGoForward = !isToday(date)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E11D48]/20 to-[#1D4ED8]/20 border border-white/10">
          <ScrollText className="h-6 w-6 text-[#E11D48]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Patrol Log</h1>
          <p className="text-sm text-muted-foreground">Review your daily completion metrics</p>
        </div>
      </motion.div>

      <GlassPanel variant="default" className="p-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => subDays(d, 1))} className="text-muted-foreground hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-base font-semibold text-white">{format(date, "MMMM d, yyyy")}</span>
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => addDays(d, 1))} disabled={!canGoForward} className="text-muted-foreground hover:text-white disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-32 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
      ) : report ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <GlassPanel variant="holographic" className="p-6 flex flex-col items-center">
            <ProgressRing percentage={report.completionRate} size={160}>
              <div className="text-center">
                <span className="text-2xl font-bold text-white">{report.completionRate}%</span>
                <p className="text-xs text-muted-foreground">completion</p>
              </div>
            </ProgressRing>
          </GlassPanel>
          <GlassPanel variant="strong" className="p-6 space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-semibold text-white">{report.completedTasks}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Total tasks</span>
              <span className="text-sm font-semibold text-white">{report.totalTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Day score</span>
              <span className="text-sm font-semibold text-white">{report.dayScore}</span>
            </div>
          </GlassPanel>
        </div>
      ) : (
        <EmptyState
          icon={FileSearch}
          title="No patrol data"
          description="No missions were scheduled or completed on this date."
        />
      )}
    </div>
  )
}
