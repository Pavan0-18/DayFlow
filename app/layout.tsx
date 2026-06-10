import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProviders } from "@/components/providers/root-providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "DayFlow - Daily Habit Tracker",
  description: "Build habits that stick, every day. Track your daily activities, maintain streaks, and achieve your goals with AI-powered insights.",
  keywords: ["habit tracker", "daily routine", "productivity", "goals", "streaks"],
  authors: [{ name: "DayFlow" }],
  openGraph: {
    title: "DayFlow - Daily Habit Tracker",
    description: "Build habits that stick, every day.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
