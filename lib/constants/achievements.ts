export interface Achievement {
  id: string
  emoji: string
  name: string
  description: string
  condition: string
  requirement: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak_7',
    emoji: '🔥',
    name: '7-Day Warrior',
    description: 'Maintain a 7-day streak',
    condition: 'streak',
    requirement: 7,
  },
  {
    id: 'streak_30',
    emoji: '💎',
    name: 'Diamond Month',
    description: 'Maintain a 30-day streak',
    condition: 'streak',
    requirement: 30,
  },
  {
    id: 'streak_100',
    emoji: '👑',
    name: 'Century Streak',
    description: 'Maintain a 100-day streak',
    condition: 'streak',
    requirement: 100,
  },
  {
    id: 'perfect_10',
    emoji: '🌟',
    name: 'Perfectionist',
    description: 'Complete 10 consecutive perfect days',
    condition: 'perfect_days',
    requirement: 10,
  },
  {
    id: 'speed_runner',
    emoji: '⚡',
    name: 'Speed Runner',
    description: 'Complete all tasks before noon 3 times',
    condition: 'early_completion',
    requirement: 3,
  },
  {
    id: 'early_bird',
    emoji: '🌅',
    name: 'Early Bird',
    description: 'Complete first task before 7am 5 times',
    condition: 'early_task',
    requirement: 5,
  },
  {
    id: 'night_owl',
    emoji: '🦉',
    name: 'Night Owl',
    description: 'Complete a task after 10pm 5 times',
    condition: 'late_task',
    requirement: 5,
  },
  {
    id: 'century_tasks',
    emoji: '🏆',
    name: 'Century Club',
    description: 'Complete 100 tasks total',
    condition: 'total_tasks',
    requirement: 100,
  },
  {
    id: 'renaissance',
    emoji: '🌈',
    name: 'Renaissance',
    description: 'Complete tasks from 5 categories in one day (3 times)',
    condition: 'multi_category',
    requirement: 3,
  },
  {
    id: 'laser_focus',
    emoji: '🎯',
    name: 'Laser Focus',
    description: 'Complete the same task 7 days in a row',
    condition: 'task_streak',
    requirement: 7,
  },
  {
    id: 'comeback',
    emoji: '💪',
    name: 'Comeback Kid',
    description: 'Resume tracking after a 7+ day gap',
    condition: 'comeback',
    requirement: 1,
  },
  {
    id: 'legend',
    emoji: '🦁',
    name: 'Legend',
    description: 'Track tasks for 365 days',
    condition: 'days_tracked',
    requirement: 365,
  },
]

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
