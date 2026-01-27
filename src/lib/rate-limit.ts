import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Rate limiter configuration
 * Uses Upstash Redis for distributed rate limiting
 * 
 * Environment variables needed:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

// Different rate limits for different scenarios
export const rateLimiters = {
    // Auth attempts: 5 per 15 minutes
    auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
    }),

    // API calls: 100 per hour
    api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 h"),
        analytics: true,
    }),

    // Payment attempts: 10 per hour
    payment: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: true,
    }),

    // General requests: 1000 per hour
    general: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1000, "1 h"),
        analytics: true,
    }),
}

export async function checkRateLimit(
    identifier: string,
    type: keyof typeof rateLimiters = "general"
): Promise<{ success: boolean; remaining: number; resetAfter: number }> {
    try {
        const limiter = rateLimiters[type]
        const { success, remaining, reset } = await limiter.limit(identifier)

        return {
            success,
            remaining: Math.max(0, remaining),
            resetAfter: reset ? Math.ceil((reset - Date.now()) / 1000) : 0,
        }
    } catch (error) {
        // Fail open - if Redis is down, allow requests but log the error
        console.error(`Rate limit check failed for ${identifier}:`, error)
        return { success: true, remaining: -1, resetAfter: 0 }
    }
}

export function getRateLimitHeaders(result: {
    success: boolean
    remaining: number
    resetAfter: number
}): Record<string, string> {
    return {
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetAfter.toString(),
    }
}
