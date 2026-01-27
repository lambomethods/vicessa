import { auth } from "@/auth"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit"
import { logSecurityEvent, logUnauthorizedAccess, logPermissionDenied } from "@/lib/security-log"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export interface ProtectAPIOptions {
    rateLimit?: keyof typeof import("@/lib/rate-limit").rateLimiters
    requireAuth?: boolean
    requireRole?: string | string[]
    checkSystemStatus?: boolean
}

/**
 * Protect API routes with auth, rate limiting, and role checks
 *
 * Usage:
 * const protected = await protectAPI(req, { requireAuth: true, requireRole: 'admin' })
 * if (!protected.ok) return protected.response
 *
 * // Continue with your route logic
 */
export async function protectAPI(
    req: NextRequest,
    options: ProtectAPIOptions = {}
) {
    const {
        rateLimit = "api",
        requireAuth = true,
        requireRole = undefined,
        checkSystemStatus = true,
    } = options

    const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"

    const userAgent = req.headers.get("user-agent") || "unknown"

    // 1. Check system status
    if (checkSystemStatus) {
        try {
            const maintenanceFlag = await prisma.systemFlag.findUnique({
                where: { key: "MAINTENANCE_MODE" },
            })
            if (maintenanceFlag?.value) {
                await logSecurityEvent({
                    event: "REQUEST_DURING_MAINTENANCE",
                    ip: clientIp,
                    userAgent,
                })
                return {
                    ok: false,
                    response: new NextResponse("System under maintenance", {
                        status: 503,
                    }),
                }
            }
        } catch (error) {
            console.error("Failed to check system status:", error)
        }
    }

    // 2. Check rate limit
    const limiterKey = `${clientIp}:${req.method}:${req.nextUrl.pathname}`
    const rateLimitResult = await checkRateLimit(limiterKey, rateLimit)

    if (!rateLimitResult.success) {
        await logSecurityEvent({
            event: "RATE_LIMIT_EXCEEDED",
            ip: clientIp,
            details: { endpoint: req.nextUrl.pathname },
            severity: "warning",
        })

        return {
            ok: false,
            response: new NextResponse("Too many requests", {
                status: 429,
                headers: getRateLimitHeaders(rateLimitResult),
            }),
        }
    }

    // 3. Check authentication
    let session = null
    if (requireAuth) {
        session = await auth()
        if (!session?.user) {
            await logUnauthorizedAccess(undefined, req.nextUrl.pathname)
            return {
                ok: false,
                response: new NextResponse("Unauthorized", { status: 401 }),
            }
        }
    } else {
        session = await auth()
    }

    // 4. Check role-based access
    if (requireRole && session?.user) {
        const requiredRoles = Array.isArray(requireRole)
            ? requireRole
            : [requireRole]

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userRole = (session.user as any).role || "user"

        if (!requiredRoles.includes(userRole)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await logPermissionDenied(
                (session.user as any).id,
                `${req.method} ${req.nextUrl.pathname}`,
                `requires one of: ${requiredRoles.join(", ")}`
            )
            return {
                ok: false,
                response: new NextResponse("Forbidden", { status: 403 }),
            }
        }
    }

    // All checks passed
    return {
        ok: true,
        session,
        headers: getRateLimitHeaders(rateLimitResult),
    }
}

/**
 * Create a protected API response
 */
export function createProtectedResponse(
    data: unknown,
    headers: Record<string, string> = {}
): NextResponse {
    return NextResponse.json(data, {
        headers: {
            ...headers,
            "X-Content-Type-Options": "nosniff",
        },
    })
}

/**
 * Create an error response with security logging
 */
export function createErrorResponse(
    message: string,
    status: number = 400,
    details?: Record<string, any>
): NextResponse {
    // Log to security if it's a 4xx/5xx error
    if (status >= 400) {
        logSecurityEvent({
            event: "API_ERROR",
            details: { message, status, ...details },
        }).catch(console.error)
    }

    return NextResponse.json(
        { error: message, ...(details && { details }) },
        { status }
    )
}
