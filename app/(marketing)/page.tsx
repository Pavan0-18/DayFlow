import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Calendar,
  BarChart3,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react"

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white lg:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
            <Sparkles className="mr-2 h-4 w-4" />
            Now with AI-powered insights
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build habits that{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              stick
            </span>
            , every day.
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            DayFlow helps you track your daily activities, maintain streaks, and achieve your goals 
            with beautiful analytics and AI-powered coaching.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="gap-2 bg-indigo-500 hover:bg-indigo-600">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                See how it works
              </Button>
            </Link>
          </div>
          
          <p className="mt-4 text-sm text-slate-500">
            No credit card required · Free forever
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to build better habits
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, powerful tools to help you stay consistent and reach your goals.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={CheckCircle}
              title="Daily Task Tracking"
              description="Create and organize your daily tasks. Check them off as you complete them throughout the day."
            />
            <FeatureCard
              icon={Calendar}
              title="Smart Scheduling"
              description="Plan your day with our intuitive scheduler. Drag and drop tasks to allocate your time effectively."
            />
            <FeatureCard
              icon={BarChart3}
              title="Beautiful Analytics"
              description="Track your progress with detailed reports, streaks, and completion statistics."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Insights"
              description="Get personalized recommendations and coaching based on your activity patterns."
            />
            <FeatureCard
              icon={Star}
              title="Achievements"
              description="Unlock badges and celebrate milestones as you build consistent habits."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Cross-Device Sync"
              description="Access your tasks and progress from anywhere, on any device."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start building better habits?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of people using DayFlow to transform their daily routines.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 gap-2"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DayFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
