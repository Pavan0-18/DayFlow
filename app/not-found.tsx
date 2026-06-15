import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Compass } from "lucide-react"
import { NySkyline } from "@/components/spider/ny-skyline"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617] p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <NySkyline variant="night" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-6 text-8xl">
          🕸️
        </div>
        <h1 className="text-6xl font-bold text-white">Dimension Lost</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          404 — This universe doesn&apos;t exist
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          The page you&apos;re looking for seems to have been pulled into another dimension. 
          Maybe it&apos;s with Spider-Man 2099.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button className="gap-2 bg-gradient-to-r from-[#E11D48] to-[#1D4ED8] text-white">
              <Home className="h-4 w-4" />
              Return to Spider HQ
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2 border-white/10 text-muted-foreground">
              <Compass className="h-4 w-4" />
              Explore
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative spider */}
      <div className="pointer-events-none absolute bottom-10 right-10 text-6xl opacity-10">
        🕷️
      </div>
    </div>
  )
}
