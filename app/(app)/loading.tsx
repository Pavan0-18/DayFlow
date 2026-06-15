import { SpiderLoader } from "@/components/spider/spider-loader"
import { GlassPanel } from "@/components/spider/glass-panel"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white/5 animate-pulse" />
        <div>
          <div className="h-6 w-48 rounded bg-white/10 animate-pulse" />
          <div className="mt-1 h-4 w-32 rounded bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Default fallback */}
      <div className="flex justify-center py-12">
        <SpiderLoader variant="radar" label="Loading command center..." />
      </div>
    </div>
  )
}
