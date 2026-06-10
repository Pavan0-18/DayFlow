import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Page not found
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link href="/dashboard">
        <Button className="mt-6 gap-2">
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Button>
      </Link>
    </div>
  )
}
