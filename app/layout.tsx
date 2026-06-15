import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProviders } from "@/components/providers/root-providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Spider-Verse OS — Hero Command Center",
  description: "The city is counting on you. Manage missions, track threats, and become a legend in the Spider-Verse.",
  keywords: ["spider-man", "spider-verse", "hero", "missions", "productivity", "command center"],
  authors: [{ name: "Spider-Verse OS" }],
  openGraph: {
    title: "Spider-Verse OS — Hero Command Center",
    description: "With great power comes great responsibility.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
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
