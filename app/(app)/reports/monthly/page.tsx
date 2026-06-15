"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useMonthlyReport } from "@/hooks/use-reports"
import { GlassPanel } from "@/components/spider/glass-panel"
import { Button } from "@/components/ui/button"
import { Shield, ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, subMonths, format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

export default function MonthlyReportPage() {
  const [date, setDate] = useState(new Date())
  const { data: report, isLoading } = useMonthlyReport(date)

  const chartData = useMemo(() => {
    if (!report) return []
    return report.dailyRates.map((day) => ({
      day: format(day.date, "d"),
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
        <p className="text-[#A855F7]">{d.rate}%</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#F59E0B]/20 border border-white/10">
          <Shield className="h-6 w-6 text-[#A855F7]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Monthly Hero Dossier</h1>
          <p className="text-sm text-muted-foreground">See your monthly impact</p>
        </div>
      </motion.div>

      <GlassPanel variant="default" className="p-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => subMonths(d, 1))} className="text-muted-foreground hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-base font-semibold text-white">{format(date, "MMMM yyyy")}</span>
          <Button variant="ghost" size="icon" onClick={() => setDate((d) => addMonths(d, 1))} className="text-muted-foreground hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}</div>
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
            {report.bestWeek && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best week</span>
                <span className="text-sm font-semibold text-green-400">{format(report.bestWeek.start, "MMM d")} ({report.bestWeek.rate}%)</span>
              </div>
            )}

            <div className="h-48 pt-4">
              <h3 className="text-sm font-semibold text-white mb-2">Daily trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Area type="monotone" dataKey="rate" stroke="#A855F7" strokeWidth={2} fill="url(#monthlyGradient)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <GlassPanel variant="strong" className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Top completed tasks</h3>
              {report.topCompleted.length > 0 ? (
                <div className="space-y-2">
                  {report.topCompleted.map((t) => (
                    <div key={t.taskId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">{t.title}</span>
                      <span className="text-white font-semibold">{t.count}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No completed tasks this month</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Most missed tasks</h3>
              {report.topMissed.length > 0 ? (
                <div className="space-y-2">
                  {report.topMissed.map((t) => (
                    <div key={t.taskId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">{t.title}</span>
                      <span className="text-red-400 font-semibold">{t.count}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No missed tasks tracked</p>
              )}
            </div>
          </GlassPanel>
        </div>
      ) : null}
    </div>
  )
}
