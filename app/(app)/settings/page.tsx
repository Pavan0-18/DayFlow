"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { useSettings } from "@/hooks/use-settings"
import { PageHeader } from "@/components/shared/page-header"
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
} from "lucide-react"
import { Theme } from "@prisma/client"
import { showInfoToast } from "@/lib/notifications/show-toasts"
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
}: {
  label: string
  description: string
  checked?: boolean
  onCheckedChange: (checked: boolean) => void
  delay?: number
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.35, delay }}
      className="flex items-center justify-between rounded-xl border bg-card/50 p-4 backdrop-blur-sm transition-colors hover:bg-accent/30"
    >
      <div>
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </motion.div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const { settings, updateSettings } = useSettings()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
        title: 'DayFlow notifications enabled',
        body: 'You will receive reminders and achievement alerts.',
        tag: 'dayflow-enabled',
      })
    }
  }

  const handleTestNotification = () => {
    if (permission !== 'granted') {
      showInfoToast('Enable browser notifications first')
      return
    }
    showBrowserNotification({
      title: 'DayFlow test notification',
      body: 'Notifications are working correctly!',
      tag: 'dayflow-test',
    })
  }

  const handleExportData = () => {
    showInfoToast("Data export coming soon!")
  }

  const handleDeleteAccount = () => {
    showInfoToast("Account deletion coming soon!")
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-xl p-1">
          <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">Appearance</TabsTrigger>
          <TabsTrigger value="danger" className="rounded-lg">Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <motion.div {...fadeUp}>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className="text-lg bg-primary/10">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Account Provider</Label>
                  <Badge variant="secondary">Google</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {isBrowserNotificationSupported() && permission !== 'granted' && (
            <motion.div {...fadeUp}>
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <BellRing className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Enable browser notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Required for daily reminders, evening summaries, and achievement alerts.
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleEnableNotifications} className="shrink-0">
                    Enable notifications
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </div>
                  <Badge
                    variant={permission === 'granted' ? 'default' : 'secondary'}
                    className={cn(permission === 'granted' && 'bg-green-600')}
                  >
                    {permission === 'granted' ? 'Active' : permission === 'denied' ? 'Blocked' : 'Off'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <NotificationToggleRow
                  label="Daily Reminder"
                  description="Get reminded to complete your tasks"
                  checked={settings?.reminderEnabled}
                  onCheckedChange={(checked) => updateSettings.mutate({ reminderEnabled: checked })}
                />

                {settings?.reminderEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center justify-between rounded-xl border bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="reminderTime">Reminder time</Label>
                        <p className="text-xs text-muted-foreground">Local time on this device</p>
                      </div>
                    </div>
                    <Input
                      id="reminderTime"
                      type="time"
                      className="w-32"
                      value={settings?.reminderTime ?? '08:00'}
                      onChange={(e) => updateSettings.mutate({ reminderTime: e.target.value })}
                    />
                  </motion.div>
                )}

                <NotificationToggleRow
                  label="Evening Summary"
                  description="Receive a daily recap at 9:00 PM"
                  checked={settings?.eveningSummary}
                  onCheckedChange={(checked) => updateSettings.mutate({ eveningSummary: checked })}
                  delay={0.05}
                />

                <NotificationToggleRow
                  label="Achievement Alerts"
                  description="In-app and browser alerts when you unlock achievements"
                  checked={settings?.achievementAlerts}
                  onCheckedChange={(checked) => updateSettings.mutate({ achievementAlerts: checked })}
                  delay={0.1}
                />

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleTestNotification} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Send test notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <motion.div {...fadeUp}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize how DayFlow looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: Theme.LIGHT, label: 'Light', Icon: Sun },
                    { value: Theme.DARK, label: 'Dark', Icon: Moon },
                    { value: Theme.SYSTEM, label: 'System', Icon: Monitor },
                  ].map(({ value, label, Icon }) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleThemeChange(value)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                        settings?.theme === value
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                          : 'hover:bg-accent/50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <motion.div {...fadeUp}>
            <Card className="border-red-200 shadow-lg dark:border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions for your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <Label>Export Your Data</Label>
                    <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between rounded-xl border border-red-200 p-4 dark:border-red-900">
                  <div>
                    <Label className="text-red-600">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <Label>Sign Out</Label>
                    <p className="text-sm text-muted-foreground">Sign out of your account</p>
                  </div>
                  <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        confirmText="Delete Account"
        isDestructive
      />
    </div>
  )
}
