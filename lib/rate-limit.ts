import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from './env'

let redis: Redis | null = null
let regularRatelimit: Ratelimit | null = null
let aiRatelimit: Ratelimit | null = null

function isRateLimitConfigured(): boolean {
  return !!env.UPSTASH_REDIS_REST_URL && !!env.UPSTASH_REDIS_REST_TOKEN
}

function getRedis(): Redis {
  if (!isRateLimitConfigured()) {
    throw new Error('Rate limiting is not configured')
  }
  if (!redis) {
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

export function getRegularRatelimit(): Ratelimit {
  if (!regularRatelimit) {
    regularRatelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      analytics: true,
    })
  }
  return regularRatelimit
}

export function getAIRatelimit(): Ratelimit {
  if (!aiRatelimit) {
    aiRatelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(60, '1 d'),
      analytics: true,
    })
  }
  return aiRatelimit
}

export async function checkRateLimit(
  identifier: string,
  type: 'regular' | 'ai' = 'regular'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (!isRateLimitConfigured()) {
    return { success: true, limit: 0, remaining: 0, reset: 0 }
  }
  const ratelimit = type === 'ai' ? getAIRatelimit() : getRegularRatelimit()
  const result = await ratelimit.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}
