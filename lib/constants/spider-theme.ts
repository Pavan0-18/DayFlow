/**
 * Data-driven Spider-Man theme mappings.
 * These convert real task data (categories, priorities, status)
 * into themed content without any hardcoded fake data.
 *
 * NOTE: Task type from Prisma does NOT have a `priority` field.
 * Only ScheduledTask has priority. See priority helpers used in schedule page.
 */

// ─── Local type definitions (avoids importing from components) ─────
export type ThreatLevelType = "low" | "medium" | "high" | "critical"
export type MissionPriority = "low" | "medium" | "high" | "critical"
export type MissionStatus = "alert-received" | "swinging-into-action" | "city-saved" | "villain-interference" | "mission-aborted"

// ─── NYC Districts mapped from task categories ──────────────────────
export const CATEGORY_DISTRICTS: Record<string, string> = {
  Health: "Queens Borough",
  Work: "Financial District",
  Learning: "Midtown Manhattan",
  Fitness: "Brooklyn Heights",
  Personal: "Upper East Side",
  Mindfulness: "Central Park",
  Social: "SoHo District",
  Finance: "Downtown Finance",
  Creative: "Greenwich Village",
  Other: "Harlem",
}

// ─── Threat types (villains) mapped from categories ─────────────────
export const CATEGORY_THREAT_TYPES: Record<string, string> = {
  Health: "Symbiote Outbreak",
  Work: "Corporate Espionage",
  Learning: "Mysterio's Illusions",
  Fitness: "Rhino's Rampage",
  Personal: "Shocker's Vibro-Plan",
  Mindfulness: "Mind-Controlling Spider",
  Social: "Chameleon's Disguises",
  Finance: "Kingpin's Operations",
  Creative: "Doc Ock's Experiments",
  Other: "Unknown Threat",
}

// ─── Mission statuses derived from task state ───────────────────────
export function getMissionStatus(
  isCompleted: boolean,
  isActive: boolean,
): MissionStatus {
  if (isCompleted) return "city-saved"
  if (!isActive) return "mission-aborted"
  return "swinging-into-action"
}

// ─── Priority to threat level mapping (for ScheduledTask priority) ──
export function priorityToThreatLevel(priority: string | undefined | null): ThreatLevelType {
  switch (priority) {
    case "HIGH":
      return "high"
    case "LOW":
      return "low"
    case "MEDIUM":
    default:
      return "medium"
  }
}

export function priorityToMissionPriority(
  priority: string | undefined | null,
): MissionPriority {
  switch (priority) {
    case "HIGH":
      return "critical"
    case "MEDIUM":
      return "medium"
    case "LOW":
      return "low"
    default:
      return "medium"
  }
}

// ─── Completion rate to threat level mapping ───────────────────────
export function completionToThreatLevel(percentage: number): ThreatLevelType {
  if (percentage <= 25) return "critical"
  if (percentage <= 50) return "high"
  if (percentage <= 75) return "medium"
  return "low"
}

// ─── Completion rate to city security trend ────────────────────────
export function completionToTrend(percentage: number): "up" | "down" | "neutral" {
  if (percentage >= 70) return "up"
  if (percentage >= 30) return "neutral"
  return "down"
}

// ─── Derive district intelligence from tasks grouped by category ───
export interface DistrictIntel {
  name: string
  threat: ThreatLevelType
  incidents: number
}

export function buildDistrictIntel(
  categoryCounts: Record<string, number>,
  categoryCompletionRates: Record<string, number>,
): DistrictIntel[] {
  return Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([category, count]) => ({
      name: CATEGORY_DISTRICTS[category] || category,
      threat: completionToThreatLevel(categoryCompletionRates[category] ?? 0),
      incidents: count,
    }))
    .sort((a, b) => b.incidents - a.incidents)
    .slice(0, 6)
}

// ─── Derive radar dots from task completion state ──────────────────
// Uses deterministic spacing (no Math.random) to prevent re-render jitter
export interface RadarDot {
  x: number
  y: number
  size: number
  color: string
}

export function buildRadarDots(
  totalTasks: number,
  completedTasks: number,
): RadarDot[] {
  if (totalTasks === 0) return []

  const completionRate = completedTasks / totalTasks
  const remaining = totalTasks - completedTasks

  const dots: RadarDot[] = []

  // Completed tasks appear as green dots (secured) — deterministic spacing
  if (completedTasks > 0) {
    const maxCompletedDots = Math.min(completedTasks, 4)
    for (let i = 0; i < maxCompletedDots; i++) {
      dots.push({
        x: 80 + (i * 18),
        y: 55 + (i % 2 === 0 ? 5 : 15),
        size: Math.max(2, 5 - i),
        color: "#22c55e",
      })
    }
  }

  // Remaining tasks appear as dots (active threats) — deterministic spacing
  if (remaining > 0) {
    const maxRemainingDots = Math.min(remaining, 4)
    for (let i = 0; i < maxRemainingDots; i++) {
      dots.push({
        x: 50 + (i * 22),
        y: 40 + (i * 12),
        size: Math.max(2, 5 - i),
        color: completionRate < 0.3 ? "#E11D48" : "#eab308",
      })
    }
  }

  // Critical dot if low completion
  if (completionRate < 0.3 && remaining > 0) {
    dots.push({
      x: 60,
      y: 50,
      size: 6,
      color: "#E11D48",
    })
  }

  return dots.slice(0, 6)
}

// ─── Category-based priority mapping ───────────────────────────────
// Each task category maps to a mission priority based on its real-world importance.
// Used on both dashboard (daily context) and mission board (task list).
export function categoryToPriority(category: string): MissionPriority {
  const priorityMap: Record<string, MissionPriority> = {
    Health: "critical",
    Work: "high",
    Learning: "medium",
    Fitness: "high",
    Personal: "medium",
    Mindfulness: "low",
    Social: "low",
    Finance: "high",
    Creative: "medium",
  }
  return priorityMap[category] || "medium"
}

// ─── Category-based threat level mapping ───────────────────────────
// Derived from the same importance logic as priority.
export function categoryToThreatLevel(category: string): ThreatLevelType {
  const threatMap: Record<string, ThreatLevelType> = {
    Health: "critical",
    Work: "high",
    Learning: "medium",
    Fitness: "high",
    Personal: "low",
    Mindfulness: "low",
    Social: "low",
    Finance: "high",
    Creative: "medium",
  }
  return threatMap[category] || "medium"
}
