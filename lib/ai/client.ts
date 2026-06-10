import { env } from '../env'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'mistralai/mistral-7b-instruct'

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

export async function generateAIText({
  prompt,
  maxTokens,
  model = DEFAULT_MODEL,
  temperature = 0.7,
}: {
  prompt: string
  maxTokens: number
  model?: string
  temperature?: number
}): Promise<string | null> {
  if (!env.OPENROUTER_API_KEY) {
    return null
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error('OpenRouter request failed:', response.status, errorText)
      return null
    }

    const data = (await response.json()) as OpenRouterResponse
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== 'string') {
      return null
    }

    return content.trim()
  } catch (error) {
    console.error('OpenRouter request failed:', error)
    return null
  }
}

export function isAIEnabled(): boolean {
  return !!env.OPENROUTER_API_KEY
}
