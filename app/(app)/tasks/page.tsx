"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Task } from "@prisma/client"
import { useTasks } from "@/hooks/use-tasks"
import { TaskRow } from "@/components/molecules/task-row"
import { TaskFormSheet } from "@/components/molecules/task-form-sheet"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GlassPanel } from "@/components/spider/glass-panel"
import { MissionCard } from "@/components/spider/mission-card"
import { ThreatLevel } from "@/components/spider/threat-level"
import { SpiderButton } from "@/components/spider/spider-button"
import { cn } from "@/lib/utils"
import {
  getMissionStatus,
  categoryToPriority,
  categoryToThreatLevel,
  CATEGORY_DISTRICTS,
  CATEGORY_THREAT_TYPES,
} from "@/lib/constants/spider-theme"
import { Plus, Search, Target, Skull } from "lucide-react"
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



export default function MissionsPage() {
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
  const [viewMode, setViewMode] = useState<"mission" | "list">("mission")

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
        title="Mission Board Offline"
        description="Unable to retrieve mission data. The command center may be experiencing interference."
        onRetry={() => window.location.reload()}
      />
    )
  }

  const isNearLimit = activeTaskCount >= 19
  const isAtLimit = activeTaskCount >= 20

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#E11D48]/20 border border-white/10">
            <Target className="h-6 w-6 text-[#A855F7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Mission Board</h1>
            <p className="text-sm text-muted-foreground">
              {activeTaskCount} active {activeTaskCount === 1 ? "mission" : "missions"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "mission" ? "list" : "mission")}
            className="text-xs text-muted-foreground hover:text-white"
          >
            {viewMode === "mission" ? "📋 List View" : "🕷️ Mission View"}
          </Button>
          <SpiderButton webEffect onClick={openCreateSheet} disabled={isAtLimit}>
            <Plus className="h-4 w-4" />
            New Mission
          </SpiderButton>
        </div>
      </motion.div>

      {/* Limits warning */}
      <AnimatePresence>
        {isNearLimit && !isAtLimit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400"
          >
            ⚠️ Approaching maximum mission capacity ({activeTaskCount}/20)
          </motion.div>
        )}
        {isAtLimit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
          >
            🚫 Maximum missions reached ({activeTaskCount}/20). Complete or deactivate some missions first.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filters */}
      <GlassPanel variant="default" className="p-4 space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Scan for missions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all",
              selectedCategory === null && "bg-[#E11D48] text-white"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            All Threats
          </Badge>
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all",
                selectedCategory === category && "bg-[#1D4ED8] text-white"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Mission List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-0.5 flex-1 bg-gradient-to-r from-[#E11D48]/50 to-transparent" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Active Missions
          </h3>
          <div className="h-0.5 flex-1 bg-gradient-to-l from-[#E11D48]/50 to-transparent" />
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredActiveTasks.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No Active Missions"
            description="The city is peaceful. Create a new mission to start protecting New York."
            action={{
              label: "New Mission",
              onClick: openCreateSheet,
            }}
          />
        ) : viewMode === "mission" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredActiveTasks.map((task, index) => {
              // Derive threat level and priority from the task's category rather than hardcoded values
              const categoryPriority = categoryToPriority(task.category)
              const categoryThreatLevel = categoryToThreatLevel(task.category)
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MissionCard
                    title={task.title}
                    status={getMissionStatus(false, task.isActive)}
                    threatLevel={categoryThreatLevel}
                    priority={categoryPriority}
                    villain={CATEGORY_THREAT_TYPES[task.category] || "Unknown Threat"}
                    location={CATEGORY_DISTRICTS[task.category] || "NYC"}
                    // No progress bar on the mission board — progress is only shown in daily context
                  />
                </motion.div>
              )
            })}
          </div>
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

      {/* Inactive Missions */}
      {filteredInactiveTasks.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors"
            onClick={() => setShowInactive(!showInactive)}
          >
            <Skull className="h-4 w-4" />
            Archived Missions ({filteredInactiveTasks.length})
            <span className="ml-1">{showInactive ? "▼" : "▶"}</span>
          </button>
          <AnimatePresence>
            {showInactive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {filteredInactiveTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    icon={task.icon}
                    category={task.category}
                    color={task.color}
                    isActive={task.isActive}
                    onToggleActive={(isActive) => handleToggleActive(task.id, isActive)}
                    onEdit={() => openEditSheet(task)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Task Form Sheet */}
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
        title="Delete Mission?"
        description="This will permanently remove this mission and all its history from the command center."
        confirmText="Delete Mission"
        isDestructive
        isLoading={deleteTask.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}


