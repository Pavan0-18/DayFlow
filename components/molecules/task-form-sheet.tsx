"use client"

import { useEffect, useState } from "react"
import { Task } from "@prisma/client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CATEGORIES, CATEGORY_COLORS, Category } from "@/lib/constants/categories"
import { PRESET_COLORS } from "@/lib/constants/colors"
import { ALL_EMOJIS } from "@/lib/constants/emojis"
import { CreateTaskInput } from "@/lib/validations/task.schema"
import { Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const UNIQUE_EMOJIS = Array.from(new Set(ALL_EMOJIS))

export interface TaskFormValues {
  title: string
  description: string
  category: Category
  color: string
  icon: string
  isActive: boolean
}

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  category: "Personal",
  color: CATEGORY_COLORS.Personal,
  icon: "✅",
  isActive: true,
}

interface TaskFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  onSubmit: (values: CreateTaskInput) => Promise<void>
  onDelete?: () => Promise<void>
  isSubmitting?: boolean
  isDeleting?: boolean
}

export function TaskFormSheet({
  open,
  onOpenChange,
  task,
  onSubmit,
  onDelete,
  isSubmitting,
  isDeleting,
}: TaskFormSheetProps) {
  const [values, setValues] = useState<TaskFormValues>(defaultValues)
  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description ?? "",
        category: task.category as Category,
        color: task.color,
        icon: task.icon,
        isActive: task.isActive,
      })
    } else {
      setValues(defaultValues)
    }
  }, [task, open])

  const handleCategoryChange = (category: Category) => {
    setValues((prev) => ({
      ...prev,
      category,
      color: CATEGORY_COLORS[category],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      category: values.category,
      color: values.color,
      icon: values.icon,
      isActive: values.isActive,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Edit Task" : "Add Task"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update your habit details."
                : "Create a new habit to track each day."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={values.title}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Morning workout"
                maxLength={60}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={values.description}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Optional details..."
                maxLength={200}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={values.category}
                onValueChange={(v) => handleCategoryChange(v as Category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                      values.color === color
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setValues((prev) => ({ ...prev, color }))}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border p-2">
                {UNIQUE_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted",
                      values.icon === emoji && "bg-primary/10 ring-2 ring-primary"
                    )}
                    onClick={() => setValues((prev) => ({ ...prev, icon: emoji }))}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="isActive">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Active tasks appear on your daily dashboard
                </p>
              </div>
              <Switch
                id="isActive"
                checked={values.isActive}
                onCheckedChange={(checked) =>
                  setValues((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button type="submit" disabled={isSubmitting || !values.title.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
