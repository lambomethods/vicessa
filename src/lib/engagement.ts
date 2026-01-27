import { prisma } from "@/lib/db"
import { NotificationService } from "@/lib/notifications"

export class EngagementEngine {
    /**
     * Checks if a user has become "stagnant" (no logs in 24h) and sends a nudge.
     */
    static async checkStagnation(userId: string) {
        const lastEntry = await prisma.trackerEntry.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" }
        })

        const now = new Date()
        const lastLogDate = lastEntry?.createdAt || new Date(0) // Default to long ago if no logs
        const hoursInactive = (now.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60)

        // Rule: If inactive for > 24h AND < 48h (don't spam old users), send nudge
        if (hoursInactive > 24 && hoursInactive < 48) {
            await NotificationService.createNotification(
                userId,
                "REMINDER",
                "How are you feeling?",
                "We noticed you haven't logged today. Tracking consistently helps us spot trends."
            )
            return { status: "nudged", userId }
        }

        return { status: "active_or_ignored", userId }
    }

    /**
     * Generates a daily tip based on the user's journey stage.
     */
    static async generateDailyTip(userId: string) {
        // In a real app, this would use the user's "Personal Plan" phase.
        // For MVP, we rotate generic tips.
        const tips = [
            "Hydration is key! Aim for 8 glasses of water today to help with regulation.",
            "Wear a supportive, non-wired bra to reduce discomfort.",
            "If you feel full, try hand expressing just enough for comfort, not to empty.",
            "Cabbage leaves (cooled in the fridge) can help reduce swelling. Ancient wisdom!",
        ]

        const randomTip = tips[Math.floor(Math.random() * tips.length)]

        await NotificationService.createNotification(
            userId,
            "INFO",
            "Tip of the Day 💡",
            randomTip
        )

        return { status: "tip_sent", userId }
    }
}
