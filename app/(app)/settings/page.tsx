"use client"

import { useState, useTransition, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { useSettings } from "@/hooks/use-settings"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { GlassPanel } from "@/components/spider/glass-panel"
import { ThreatLevel } from "@/components/spider/threat-level"
import {
  Bell,
  Moon,
  Sun,
  Monitor,
  User,
  Palette,
  Trash2,
  LogOut,
  Download,
  BellRing,
  Clock,
  Sparkles,
  Shield,
  Radio,
  Settings2,
  Lock,
} from "lucide-react"
import { Theme } from "@prisma/client"
import { showInfoToast, showSuccessToast, showErrorToast } from "@/lib/notifications/show-toasts"
import {
  getNotificationPermission,
  isBrowserNotificationSupported,
  requestNotificationPermission,
  showBrowserNotification,
} from "@/lib/notifications/browser-notifications"
import { cn } from "@/lib/utils"

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
}

function NotificationToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  delay = 0,
  accent = "red",
}: {
  label: string
  description: string
  checked?: boolean
  onCheckedChange: (checked: boolean) => void
  delay?: number
  accent?: string
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.35, delay }}
      className={cn(
        "flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-colors",
        "border-white/5 bg-white/5 hover:bg-white/10"
      )}
    >
      <div>
        <Label className="text-white">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-[#E11D48]"
      />
    </motion.div>
  )
}

export default function SuitLabPage() {
  const { data: session } = useSession()
  const { settings, updateSettings } = useSettings()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isExporting, startExportTransition] = useTransition()
  const [permission, setPermission] = useState(getNotificationPermission())

  const user = session?.user
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0].toUpperCase() || "U"

  const handleThemeChange = (theme: Theme) => {
    updateSettings.mutate({ theme })
  }

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
    if (result === 'granted') {
      showBrowserNotification({
        title: 'Spider Sense Enabled',
        body: 'You will receive threat alerts and mission notifications.',
        tag: 'spider-sense-enabled',
      })
    }
  }

  const handleTestNotification = () => {
    if (permission !== 'granted') {
      showInfoToast('Enable Spider Sense first')
      return
    }
    showBrowserNotification({
      title: 'Spider Sense Test',
      body: 'Neural interface connection established successfully!',
      tag: 'spider-sense-test',
    })
  }

  const handleExportData = () => {
    startExportTransition(async () => {
      try {
        const response = await fetch("/api/export")
        if (!response.ok) throw new Error("Export failed")
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `dayflow-export-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        showSuccessToast("Hero data exported")
      } catch {
        showErrorToast("Export failed", "Try again later")
      }
    })
  }

  const handleDeleteAccount = () => {
    startDeleteTransition(async () => {
      try {
        const response = await fetch("/api/settings/delete-account", { method: "DELETE" })
        if (!response.ok) throw new Error("Deletion failed")
        showSuccessToast("Account deleted")
        setTimeout(() => signOut({ callbackUrl: "/" }), 1500)
      } catch {
        showErrorToast("Decommission failed", "Try again later")
      } finally {
        setShowDeleteDialog(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#1D4ED8]/20 border border-white/10">
            <Settings2 className="h-6 w-6 text-[#22D3EE]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Suit Lab</h1>
            <p className="text-sm text-muted-foreground">
              Configure your hero equipment and systems
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-white/5 p-1 border border-white/5">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-[#1D4ED8]/20 data-[state=active]:text-[#1D4ED8] text-xs">
            <Shield className="h-3.5 w-3.5 mr-1" />
            Hero Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-[#E11D48]/20 data-[state=active]:text-[#E11D48] text-xs">
            <Radio className="h-3.5 w-3.5 mr-1" />
            Spider Sense
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-[#A855F7]/20 data-[state=active]:text-[#A855F7] text-xs">
            <Palette className="h-3.5 w-3.5 mr-1" />
            Suit Customization
          </TabsTrigger>
          <TabsTrigger value="danger" className="rounded-lg data-[state=active]:bg-[#E11D48]/20 data-[state=active]:text-[#E11D48] text-xs">
            <Lock className="h-3.5 w-3.5 mr-1" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <motion.div {...fadeUp}>
            <GlassPanel variant="holographic" className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 ring-2 ring-[#1D4ED8]/50">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-[#1D4ED8] to-[#E11D48] text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-white">{user?.name || "Hero"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-1 border-[#1D4ED8]/30 text-[#1D4ED8] text-[10px]">
                    <Shield className="h-3 w-3 mr-1" />
                    Spider Operative
                  </Badge>
                </div>
              </div>
              <Separator className="bg-white/5" />
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Authentication</Label>
                <Badge variant="outline" className="border-white/10 text-muted-foreground">Google Identity</Badge>
              </div>
            </GlassPanel>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {isBrowserNotificationSupported() && permission !== 'granted' && (
            <motion.div {...fadeUp}>
              <GlassPanel variant="strong" className="p-4 border-l-4 border-l-[#E11D48]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#E11D48]/10 p-2">
                      <Radio className="h-5 w-5 text-[#E11D48]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Enable Spider Sense</p>
                      <p className="text-sm text-muted-foreground">
                        Required for threat alerts, mission notifications, and hero updates.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleEnableNotifications}
                    className="shrink-0 bg-[#E11D48] hover:bg-[#E11D48]/80"
                  >
                    Enable
                  </Button>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
            <GlassPanel variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Spider Sense Calibration</h3>
                  <p className="text-sm text-muted-foreground">Configure your neural threat detection</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    permission === 'granted' ? 'border-green-500/30 text-green-400' : 'border-white/10 text-muted-foreground'
                  )}
                >
                  {permission === 'granted' ? '🟢 Active' : permission === 'denied' ? '🔴 Blocked' : '⚪ Off'}
                </Badge>
              </div>

              <div className="space-y-3">
                <NotificationToggleRow
                  label="Threat Alerts"
                  description="Get notified when threats are detected"
                  checked={settings?.reminderEnabled}
                  onCheckedChange={(checked) => updateSettings.mutate({ reminderEnabled: checked })}
                />

                {settings?.reminderEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="reminderTime" className="text-white">Alert time</Label>
                        <p className="text-xs text-muted-foreground">Local patrol time</p>
                      </div>
                    </div>
                    <Input
                      id="reminderTime"
                      type="time"
                      className="w-32 bg-white/5 border-white/10 text-white"
                      value={settings?.reminderTime ?? '08:00'}
                      onChange={(e) => updateSettings.mutate({ reminderTime: e.target.value })}
                    />
                  </motion.div>
                )}

                <NotificationToggleRow
                  label="End-of-Patrol Report"
                  description="Receive a daily recap at 21:00 hours"
                  checked={settings?.eveningSummary}
                  onCheckedChange={(checked) => updateSettings.mutate({ eveningSummary: checked })}
                  delay={0.05}
                />

                <NotificationToggleRow
                  label="Hero Achievement Alerts"
                  description="Notifications when you unlock new awards"
                  checked={settings?.achievementAlerts}
                  onCheckedChange={(checked) => updateSettings.mutate({ achievementAlerts: checked })}
                  delay={0.1}
                />

                <Separator className="bg-white/5 my-4" />

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleTestNotification} className="gap-2 border-white/10 text-muted-foreground hover:text-white">
                    <Sparkles className="h-4 w-4" />
                    Test Spider Sense
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <motion.div {...fadeUp}>
            <GlassPanel variant="strong" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Suit Color Scheme</h3>
              <p className="text-sm text-muted-foreground mb-6">Choose your hero suit appearance</p>
              <Label className="text-sm text-muted-foreground mb-3 block">Suit Variant</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: Theme.LIGHT, label: 'Classic', Icon: Sun, color: "from-blue-500 to-red-500" },
                  { value: Theme.DARK, label: 'Stealth', Icon: Moon, color: "from-gray-800 to-black" },
                  { value: Theme.SYSTEM, label: 'Adaptive', Icon: Monitor, color: "from-purple-500 to-cyan-500" },
                ].map(({ value, label, Icon, color }) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleThemeChange(value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                      settings?.theme === value
                        ? 'border-[#1D4ED8]/50 bg-[#1D4ED8]/10 shadow-md'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br", color)} />
                    <span className="text-sm font-medium text-white">{label}</span>
                    {value === Theme.DARK && <span className="text-[10px] text-muted-foreground">Default</span>}
                  </motion.button>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <motion.div {...fadeUp}>
            <GlassPanel
              variant="strong"
              className="p-6 border-l-4 border-l-red-500"
            >
              <h3 className="text-lg font-semibold text-red-400 mb-2">Security Protocols</h3>
              <p className="text-sm text-muted-foreground mb-6">Irreversible actions — handle with care</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                  <div>
                    <Label className="text-white">Export Hero Data</Label>
                    <p className="text-sm text-muted-foreground">Download a copy of all mission data</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData} disabled={isExporting} className="border-white/10 text-muted-foreground hover:text-white">
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export"}
                  </Button>
                </div>

                <Separator className="bg-white/5" />

                <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <div>
                    <Label className="text-red-400">Decommission Suit</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all hero data</p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Decommission
                  </Button>
                </div>

                <Separator className="bg-white/5" />

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                  <div>
                    <Label className="text-white">Sign Out</Label>
                    <p className="text-sm text-muted-foreground">End your hero session</p>
                  </div>
                  <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} className="border-white/10 text-muted-foreground hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Decommission Suit?"
        description="Are you sure you want to permanently decommission your hero suit? This action cannot be undone — all mission data, achievements, and hero progression will be lost."
        confirmText="Decommission"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  )
}
