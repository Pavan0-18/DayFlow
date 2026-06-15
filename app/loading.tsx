import { SpiderLoader } from "@/components/spider/spider-loader"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617]">
      <SpiderLoader variant="web-spin" label="Connecting to Spider-Verse..." />
    </div>
  )
}
