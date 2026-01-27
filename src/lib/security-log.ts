import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export interface SecurityEventOptions {
    event: string
    userId?: string
    email?: string
    ip?: string
    userAgent?: string
    details?: Record<string, any>
    severity?: "info" | "warning" | "critical"
}

/**
 * Log a security event to the database
 * Used for monitoring and incident response
 */
export async function logSecurityEvent(options: SecurityEventOptions) {
    const {
        event,
        userId,
        email,
        ip,
        userAgent,
        details,
        severity = "info",
    } = options

    try {
        // Get IP from request headers if not provided
        let finalIp = ip
        if (!finalIp) {
            const headersList = await headers()
            finalIp =
                headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
                headersList.get("x-real-ip") ||
                "unknown"
        }

        // Get user agent if not provided
        let finalUserAgent = userAgent
        if (!finalUserAgent) {
            const headersList = await headers()
            finalUserAgent = headersList.get("user-agent") || "unknown"
        }

        // Log to database
        await prisma.securityLog.create({
            data: {
                event,
                severity,
                userId,
                email,
                ip: finalIp,
                userAgent: finalUserAgent,
                details,
            },
        })

        // Log critical events to console for monitoring
        if (severity === "critical") {
            console.error(`[SECURITY CRITICAL] ${event}`, {
                userId,
                email,
                ip: finalIp,
                details,
            })
        }
    } catch (error) {
        console.error("Failed to log security event:", error)
        // Don't throw - we don't want logging to break the request
    }
}

/**
 * Log failed authentication attempts
 */
export async function logFailedAuth(email: string) {
    await logSecurityEvent({
        event: "FAILED_LOGIN",
        email,
        severity: "warning",
    })
}

/**
 * Log suspicious rate limit violations
 */
export async function logRateLimitViolation(
    identifier: string,
    type: string
) {
    await logSecurityEvent({
        event: "RATE_LIMIT_EXCEEDED",
        ip: identifier,
        details: { type },
        severity: "warning",
    })
}

/**
 * Log unauthorized access attempts
 */
export async function logUnauthorizedAccess(
    userId: string | undefined,
    resource: string
) {
    await logSecurityEvent({
        event: "UNAUTHORIZED_ACCESS",
        userId,
        details: { resource },
        severity: "warning",
    })
}

/**
 * Log permission denied events
 */
export async function logPermissionDenied(
    userId: string,
    action: string,
    resource: string
) {
    await logSecurityEvent({
        event: "PERMISSION_DENIED",
        userId,
        details: { action, resource },
        severity: "warning",
    })
}

/**
 * Log suspicious API activity
 */
export async function logSuspiciousActivity(
    userId: string | undefined,
    activity: string,
    details?: Record<string, any>
) {
    await logSecurityEvent({
        event: "SUSPICIOUS_ACTIVITY",
        userId,
        details: { activity, ...details },
        severity: "warning",
    })
}

/**
 * Query recent security events for monitoring
 */
export async function getRecentSecurityEvents(limit = 50) {
    return await prisma.securityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    })
}

/**
 * Get critical security events (last 24 hours)
 */
export async function getCriticalSecurityEvents() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return await prisma.securityLog.findMany({
        where: {
            severity: "critical",
            createdAt: {
                gte: twentyFourHoursAgo,
            },
        },
        orderBy: { createdAt: "desc" },
    })
}

/**
 * Mark a security event as resolved
 */
export async function resolveSecurityEvent(eventId: string, notes: string) {
    return await prisma.securityLog.update({
        where: { id: eventId },
        data: {
            resolved: true,
            notes,
            updatedAt: new Date(),
        },
    })
}
