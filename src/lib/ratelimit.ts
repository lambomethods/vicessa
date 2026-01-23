import { NextRequest } from "next/server"

// Simple in-memory store for development/beta
// In production, use Redis (Upstash)
const ipCache = new Map<string, number[]>()

export async function rateLimit(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    const now = Date.now()
    const windowSize = 60 * 1000 // 1 minute
    const limit = 5 // 5 requests per minute

    const requestTimestamps = ipCache.get(ip) || []
    const validTimestamps = requestTimestamps.filter((timestamp) => now - timestamp < windowSize)

    if (validTimestamps.length >= limit) {
        return { success: false }
    }

    validTimestamps.push(now)
    ipCache.set(ip, validTimestamps)

    return { success: true }
}
