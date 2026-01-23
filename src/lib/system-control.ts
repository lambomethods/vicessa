
import { prisma } from "@/lib/db"
import { FLAGS as ENV_FLAGS } from "@/lib/flags"

export const SYSTEM_FLAGS = {
    AI_ENABLED: "AI_ENABLED",
    COMMUNITY_ENABLED: "COMMUNITY_ENABLED",
    SAFE_MODE: "SAFE_MODE",
}

export type SystemFlagKey = keyof typeof SYSTEM_FLAGS

export class SystemControl {
    // Get a flag value with Fallback to Env Var
    static async getFlag(key: string): Promise<boolean> {
        try {
            const flag = await prisma.systemFlag.findUnique({
                where: { key }
            })

            // If DB flag exists, use it. 
            // If not, fallback to Env var default (safe migration).
            if (flag) return flag.value

            // Fallback mapping
            if (key === SYSTEM_FLAGS.AI_ENABLED) return ENV_FLAGS.AI_ENABLED
            if (key === SYSTEM_FLAGS.COMMUNITY_ENABLED) return ENV_FLAGS.COMMUNITY_ENABLED
            if (key === SYSTEM_FLAGS.SAFE_MODE) return ENV_FLAGS.SAFE_MODE

            return false
        } catch (error) {
            console.error(`[SystemControl] Failed to fetch flag ${key}`, error)
            return false // Fail safe
        }
    }

    // Set a flag value (Admin only)
    static async setFlag(key: string, value: boolean, userId: string) {
        // 1. Update/Create Flag
        const flag = await prisma.systemFlag.upsert({
            where: { key },
            update: { value, updatedBy: userId },
            create: { key, value, updatedBy: userId, description: `System Flag: ${key}` }
        })

        // 2. Audit Log
        await this.logAudit(userId, "TOGGLE_FLAG", key, `Set to ${value}`)

        return flag
    }

    // Log System Event
    static async logSystem(level: "info" | "warn" | "error" | "critical", message: string, metadata?: Record<string, unknown> | null) {
        try {
            await prisma.systemLog.create({
                data: {
                    level,
                    message,
                    metadata: metadata ? JSON.stringify(metadata) : null
                }
            })
        } catch (e) {
            // Do not crash app if logging fails
            console.error("Failed to log system event", e)
        }
    }

    // Log Audit Event (User Action)
    static async logAudit(actorId: string, action: string, target: string, details?: string) {
        try {
            await prisma.auditEvent.create({
                data: {
                    actorId,
                    action,
                    target,
                    details
                }
            })
        } catch (e) {
            console.error("Failed to log audit event", e)
        }
    }

    // Initialize/Seed Defaults
    static async seedDefaults() {
        const defaults = [
            { key: SYSTEM_FLAGS.AI_ENABLED, value: ENV_FLAGS.AI_ENABLED },
            { key: SYSTEM_FLAGS.COMMUNITY_ENABLED, value: ENV_FLAGS.COMMUNITY_ENABLED },
            { key: SYSTEM_FLAGS.SAFE_MODE, value: ENV_FLAGS.SAFE_MODE },
        ]

        for (const def of defaults) {
            await prisma.systemFlag.upsert({
                where: { key: def.key },
                update: {}, // Don't overwrite if exists
                create: {
                    key: def.key,
                    value: def.value,
                    description: "Seeded from Env"
                }
            })
        }
    }
}
