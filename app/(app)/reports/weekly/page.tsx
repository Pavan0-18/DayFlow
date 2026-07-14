"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWeeklyReport } from "@/hooks/use-reports"
import { GlassPanel } from "@/components/spider/glass-panel"
import { Button } from "@/components/ui/button"
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { addWeeks, subWeeks, format } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function WeeklyReportPage() {
  const [date, setDate] = useState(new Date())
  const [showShare, setShowShare] = useState(false)
  const { data: report, isLoading } = useWeeklyReport(date)

  const shareText = useMemo(() => {
    if (!report) return ""
    return [
      `🕷️ DayFlow Weekly Report`,
      `Week of ${format(report.weekStart, "MMM d")} - ${format(report.weekEnd, "MMM d, yyyy")}`,
      ``,
      `📊 Average completion: ${report.averageRate}%`,
      `✅ Tasks completed: ${report.totalCompleted}`,
      `🎯 Consistency score: ${report.consistencyScore}%`,
      report.bestDay ? `🏆 Best day: ${format(report.bestDay.date, "EEEE")} (${report.bestDay.rate}%)` : "",
      report.worstDay ? `⚠️ Worst day: ${format(report.worstDay.date, "EEEE")} (${report.worstDay.rate}%)` : "",
      ``,
      `Built with DayFlow — day-flow-beige.vercel.app`,
    ].filter(Boolean).join("\n")
  }, [report])

  const copyShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setShowShare(false)
    } catch {
      // fallback
    }
  }, [shareText])

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
      <div className="rounded-lg border border-border/30 bg-card/90 px-3 py-2 text-xs shadow-xl">
        <p className="text-foreground font-medium">{d.fullDate}</p>
        <p className="text-[#22D3EE]">{d.rate}%</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-[#A855F7]/20 border border-border/30">
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Weekly Intelligence Brief</h1>
            <p className="text-sm text-muted-foreground">Analyze your weekly trends</p>
          </div>
        </div>
        {report && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShare(true)}
            className="gap-2 border-border/30 text-muted-foreground hover:text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share Report
          </Button>
        )}
      </motion.div>

      <GlassPanel variant="default" className="p-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => subWeeks(d, 1))} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-base font-semibold text-foreground">
            {report ? `${format(report.weekStart, "MMM d")} - ${format(report.weekEnd, "MMM d, yyyy")}` : "Loading..."}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => addWeeks(d, 1))} className="text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse" />)}
        </div>
      ) : report ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <GlassPanel variant="holographic" className="p-6 space-y-4">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Average rate</span>
              <span className="text-sm font-semibold text-foreground">{report.averageRate}%</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Total completed</span>
              <span className="text-sm font-semibold text-foreground">{report.totalCompleted}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Consistency</span>
              <span className="text-sm font-semibold text-foreground">{report.consistencyScore}%</span>
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
            <h3 className="text-sm font-semibold text-foreground mb-4">Daily breakdown</h3>
            <div className="space-y-2 mb-6">
              {report.dailyRates.map((day) => (
                <div key={day.date.toISOString()} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-muted-foreground">{format(day.date, "EEE")}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#E11D48] to-[#22D3EE] transition-all" style={{ width: `${day.rate}%` }} />
                  </div>
                  <span className="w-8 text-xs text-right text-foreground">{day.rate}%</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-2">Chart view</h3>
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

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && report && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/90 p-6 shadow-2xl"
            >
              {/* Card preview */}
              <div className="rounded-xl border border-border/30 bg-gradient-to-br from-card via-card/90 to-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  DAYFLOW · WEEKLY REPORT
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(report.weekStart, "MMM d")} – {format(report.weekEnd, "MMM d, yyyy")}
                </p>
                <div className="grid grid-cols-3 gap-3 py-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{report.averageRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Avg Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{report.totalCompleted}</p>
                    <p className="text-[10px] text-muted-foreground">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{report.consistencyScore}%</p>
                    <p className="text-[10px] text-muted-foreground">Consistency</p>
                  </div>
                </div>
                {report.bestDay && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">🏆 Best day</span>
                    <span className="font-medium text-foreground">{format(report.bestDay.date, "EEEE")} ({report.bestDay.rate}%)</span>
                  </div>
                )}
                {report.worstDay && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">⚠️ Needs work</span>
                    <span className="font-medium text-foreground">{format(report.worstDay.date, "EEEE")} ({report.worstDay.rate}%)</span>
                  </div>
                )}
                <div className="pt-1 text-[10px] text-muted-foreground/60 text-center">
                  day-flow-beige.vercel.app
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShare(false)}
                  className="flex-1 border-border/30 text-muted-foreground"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={copyShare}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy to Clipboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
