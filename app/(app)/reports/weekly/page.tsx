"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useWeeklyReport } from "@/hooks/use-reports"
import { GlassPanel } from "@/components/spider/glass-panel"
import { Button } from "@/components/ui/button"
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { addWeeks, subWeeks, format } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function WeeklyReportPage() {
  const [date, setDate] = useState(new Date())
  const { data: report, isLoading } = useWeeklyReport(date)

  const chartData = useMemo(() => {
    if (!report) return []
    return report.dailyRates.map((day) => ({
      day: format(day.date, "EEE"),
      rate: day.rate,
      fullDate: format(day.date, "MMM d"),
    }))
  }, [report])

  const tooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs shadow-xl">
        <p className="text-white font-medium">{d.fullDate}</p>
        <p className="text-[#22D3EE]">{d.rate}%</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 to-[#A855F7]/20 border border-white/10">
          <TrendingUp className="h-6 w-6 text-[#1D4ED8]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Intelligence Brief</h1>
          <p className="text-sm text-muted-foreground">Analyze your weekly trends</p>
        </div>
      </motion.div>

      <GlassPanel variant="default" className="p-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => subWeeks(d, 1))} className="text-muted-foreground hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-base font-semibold text-white">
            {report ? `${format(report.weekStart, "MMM d")} - ${format(report.weekEnd, "MMM d, yyyy")}` : "Loading..."}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => addWeeks(d, 1))} className="text-muted-foreground hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : report ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <GlassPanel variant="holographic" className="p-6 space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Average rate</span>
              <span className="text-sm font-semibold text-white">{report.averageRate}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Total completed</span>
              <span className="text-sm font-semibold text-white">{report.totalCompleted}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Consistency</span>
              <span className="text-sm font-semibold text-white">{report.consistencyScore}%</span>
            </div>
            {report.bestDay && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best day</span>
                <span className="text-sm font-semibold text-green-400">{format(report.bestDay.date, "EEE")} ({report.bestDay.rate}%)</span>
              </div>
            )}
            {report.worstDay && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Worst day</span>
                <span className="text-sm font-semibold text-red-400">{format(report.worstDay.date, "EEE")} ({report.worstDay.rate}%)</span>
              </div>
            )}
          </GlassPanel>

          <GlassPanel variant="strong" className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Daily breakdown</h3>
            <div className="space-y-2 mb-6">
              {report.dailyRates.map((day) => (
                <div key={day.date.toISOString()} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-muted-foreground">{format(day.date, "EEE")}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#E11D48] to-[#22D3EE] transition-all" style={{ width: `${day.rate}%` }} />
                  </div>
                  <span className="w-8 text-xs text-right text-white">{day.rate}%</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-white mb-2">Chart view</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {chartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.rate >= 70 ? "#22D3EE" : entry.rate >= 40 ? "#E11D48" : "#6B7280"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </div>
      ) : null}
    </div>
  )
}
