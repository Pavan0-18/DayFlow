export const EMOJI_CATEGORIES = {
  'Health & Wellness': ['💪', '🏃', '💧', '🥗', '🧘', '😴', '💊', '🩺', '🌿', '🍎'],
  'Work & Productivity': ['💼', '📊', '📈', '💻', '📅', '✅', '📝', '📌', '🎯', '🚀'],
  'Learning': ['📚', '🎓', '💡', '🧠', '📖', '✏️', '🌍', '🔬', '🎨', '🎵'],
  'Personal': ['🏠', '🧹', '🛒', '💰', '📞', '💌', '🎁', '🌸', '⭐', '🔥'],
  'Mindfulness': ['🧘', '🌙', '☀️', '🌈', '💫', '✨', '🕊️', '🌻', '🍃', '💙'],
  'Social': ['👥', '💬', '🎉', '🍕', '🎮', '🎬', '🎤', '🤝', '❤️', '🤗'],
  'Fitness': ['🏋️', '🚴', '🏊', '🧗', '⛹️', '🤸', '🏸', '🎾', '⚽', '🏈'],
} as const

export const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat()

export function getEmojiCategory(emoji: string): string {
  for (const [category, emojis] of Object.entries(EMOJI_CATEGORIES)) {
    if ((emojis as readonly string[]).includes(emoji)) return category
  }
  return 'Other'
}
