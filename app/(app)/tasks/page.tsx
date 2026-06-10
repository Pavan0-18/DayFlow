"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Task } from "@prisma/client"
import { useTasks } from "@/hooks/use-tasks"
import { TaskRow } from "@/components/molecules/task-row"
import { TaskFormSheet } from "@/components/molecules/task-form-sheet"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, CheckSquare } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CATEGORIES } from "@/lib/constants/categories"
import { CreateTaskInput } from "@/lib/validations/task.schema"

export default function TasksPage() {
  const {
    activeTasks,
    inactiveTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    activeTaskCount,
  } = useTasks()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredActiveTasks = activeTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? task.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const filteredInactiveTasks = inactiveTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? task.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const openCreateSheet = () => {
    setEditingTask(null)
    setSheetOpen(true)
  }

  const openEditSheet = (task: Task) => {
    setEditingTask(task)
    setSheetOpen(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = filteredActiveTasks.findIndex((t) => t.id === active.id)
      const newIndex = filteredActiveTasks.findIndex((t) => t.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(filteredActiveTasks, oldIndex, newIndex)
        reorderTasks.mutate(newOrder.map((t) => t.id))
      }
    }
  }

  const handleToggleActive = (taskId: string, isActive: boolean) => {
    updateTask.mutate({ id: taskId, isActive })
  }

  const handleSubmit = async (values: CreateTaskInput) => {
    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, ...values })
    } else {
      await createTask.mutateAsync(values)
    }
    setSheetOpen(false)
    setEditingTask(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteTask.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
    setSheetOpen(false)
    setEditingTask(null)
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load tasks"
        description="There was an error loading your tasks."
        onRetry={() => window.location.reload()}
      />
    )
  }

  const isNearLimit = activeTaskCount >= 19
  const isAtLimit = activeTaskCount >= 20

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        description={`${activeTaskCount} active tasks`}
        action={{
          label: "Add Task",
          icon: Plus,
          onClick: openCreateSheet,
        }}
      />

      {isNearLimit && !isAtLimit && (
        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-600 dark:bg-amber-950/20">
          You&apos;re approaching the limit of 20 active tasks ({activeTaskCount}/20)
        </div>
      )}
      {isAtLimit && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20">
          You&apos;ve reached the limit of 20 active tasks. Deactivate some tasks to add more.
        </div>
      )}

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Active Tasks</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted" />
            ))}
          </div>
        ) : filteredActiveTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No active tasks"
            description="Add some tasks to get started with your daily routine."
            action={{
              label: "Add Task",
              onClick: openCreateSheet,
            }}
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredActiveTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {filteredActiveTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <TaskRow
                      id={task.id}
                      title={task.title}
                      icon={task.icon}
                      category={task.category}
                      color={task.color}
                      isActive={task.isActive}
                      onToggleActive={(isActive) => handleToggleActive(task.id, isActive)}
                      onEdit={() => openEditSheet(task)}
                    />
                  </motion.div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {filteredInactiveTasks.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            onClick={() => setShowInactive(!showInactive)}
          >
            Inactive Tasks ({filteredInactiveTasks.length})
            <span>{showInactive ? "▼" : "▶"}</span>
          </button>
          {showInactive && (
            <div className="space-y-2">
              {filteredInactiveTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <TaskRow
                    id={task.id}
                    title={task.title}
                    icon={task.icon}
                    category={task.category}
                    color={task.color}
                    isActive={task.isActive}
                    onToggleActive={(isActive) => handleToggleActive(task.id, isActive)}
                    onEdit={() => openEditSheet(task)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <TaskFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={editingTask}
        onSubmit={handleSubmit}
        onDelete={
          editingTask
            ? async () => {
                setSheetOpen(false)
                setDeleteTarget(editingTask)
              }
            : undefined
        }
        isSubmitting={createTask.isPending || updateTask.isPending}
        isDeleting={deleteTask.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete task?"
        description="This will permanently remove the task and its history."
        confirmText="Delete"
        isDestructive
        isLoading={deleteTask.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
