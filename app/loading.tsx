import { SpiderLoader } from "@/components/spider/spider-loader"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SpiderLoader variant="web-spin" label="Connecting to Spider-Verse..." />
    </div>
  )
}
