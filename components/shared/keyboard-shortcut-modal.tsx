"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

const SHORTCUTS = [
  { keys: ["g", "d"], description: "Go to Dashboard / Spider HQ" },
  { keys: ["g", "t"], description: "Go to Missions" },
  { keys: ["g", "s"], description: "Go to City Intel" },
  { keys: ["g", "r"], description: "Go to Case Files" },
  { keys: ["n"], description: "Create new mission" },
  { keys: ["Ctrl/Cmd", "S"], description: "Save" },
  { keys: ["?"], description: "Show this help" },
  { keys: ["Esc"], description: "Close modal" },
]

export function KeyboardShortcutModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("dayflow:show-help", handler)
    return () => window.removeEventListener("dayflow:show-help", handler)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E11D48]/10">
              <Keyboard className="h-5 w-5 text-[#E11D48]" />
            </div>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.description} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={i} className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white">
                    {key}
                  </span>
                ))}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
