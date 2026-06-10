"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "./theme-provider"
import { SessionProvider } from "./session-provider"
import { QueryProvider } from "./query-provider"
import { NotificationProvider } from "./notification-provider"
import { Toaster } from "sonner"

interface RootProvidersProps {
  children: ReactNode
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            {children}
          </NotificationProvider>
          <Toaster
            position="top-right"
            expand
            richColors
            closeButton
            offset={16}
            toastOptions={{
              classNames: {
                toast:
                  "group toast backdrop-blur-md border shadow-xl rounded-xl",
                title: "font-semibold",
                description: "text-muted-foreground",
                actionButton: "bg-primary text-primary-foreground",
                cancelButton: "bg-muted text-muted-foreground",
                closeButton: "bg-background border",
              },
            }}
          />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
