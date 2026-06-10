export const CATEGORIES = [
  'Health',
  'Work',
  'Learning',
  'Fitness',
  'Personal',
  'Mindfulness',
  'Social',
  'Finance',
  'Creative',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_COLORS: Record<Category, string> = {
  Health: '#22C55E',
  Work: '#3B82F6',
  Learning: '#8B5CF6',
  Fitness: '#F97316',
  Personal: '#6366F1',
  Mindfulness: '#EC4899',
  Social: '#14B8A6',
  Finance: '#10B981',
  Creative: '#F59E0B',
  Other: '#64748B',
}
