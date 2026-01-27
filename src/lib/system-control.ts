import { prisma } from "@/lib/db"
import { FLAGS as ENV_FLAGS } from "@/lib/flags"

export const SYSTEM_FLAGS = {
    AI_ENABLED: "AI_ENABLED",
    COMMUNITY_ENABLED: "COMMUNITY_ENABLED",
    SAFE_MODE: "SAFE_MODE",
}

export type SystemFlagKey = keyof typeof SYSTEM_FLAGS

export class SystemControl {
    static async getFlag(key: string): Promise<boolean> {
        try {
            const flag = await prisma.systemFlag.findUnique({
                where: { key }
            })

            if (flag) return flag.value === 'true'

            // Fallback mapping
            if (key === SYSTEM_FLAGS.AI_ENABLED) return ENV_FLAGS.AI_ENABLED
            if (key === SYSTEM_FLAGS.COMMUNITY_ENABLED) return ENV_FLAGS.COMMUNITY_ENABLED
            if (key === SYSTEM_FLAGS.SAFE_MODE) return ENV_FLAGS.SAFE_MODE

            return false
        } catch (error) {
            console.error(`[SystemControl] Failed to fetch flag ${key}`, error)
            return false
        }
    }

    static async setFlag(key: string, value: boolean, userId: string) {
        const flag = await prisma.systemFlag.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        })

        // Log to security log
        await prisma.securityLog.create({
            data: {
                event: "TOGGLE_FLAG",
                severity: "info",
                userId,
                details: JSON.stringify({ key, value })
            }
        })

        return flag
    }

    static async seedDefaults() {
        const defaults = [
            { key: SYSTEM_FLAGS.AI_ENABLED, value: ENV_FLAGS.AI_ENABLED },
            { key: SYSTEM_FLAGS.COMMUNITY_ENABLED, value: ENV_FLAGS.COMMUNITY_ENABLED },
            { key: SYSTEM_FLAGS.SAFE_MODE, value: ENV_FLAGS.SAFE_MODE },
        ]

        for (const def of defaults) {
            await prisma.systemFlag.upsert({
                where: { key: def.key },
                update: {},
                create: {
                    key: def.key,
                    value: String(def.value)
                }
            })
        }
    }
}
