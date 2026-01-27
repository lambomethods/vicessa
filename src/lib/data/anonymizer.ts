import { User, TrackerEntry, InsightSignal } from "@prisma/client"
import crypto from "crypto"

export interface AnonymousEntry {
    dayOffset: number // Days since onboarding/first log
    symptoms: {
        discomfort: number | null
        mood: number | null
        stress: number | null
        feeds: number
    }
    signals: string[] // Type of signals triggered
}

export interface AnonymousProfile {
    researchId: string
    datasetVersion: string
    planType: string
    totalEntries: number
    data: AnonymousEntry[]
}

export class Anonymizer {
    private static SALT = "VicessaResearchSalt_2026" // In prod, env var

    /**
     * Converts a raw User + History into a clean, safe Research Profile.
     */
    static process(
        user: User,
        entries: TrackerEntry[],
        signals: InsightSignal[]
    ): AnonymousProfile {
        // 1. Hash ID (Consistent Anonymization)
        const researchId = crypto
            .createHmac("sha256", this.SALT)
            .update(user.id)
            .digest("hex")
            .substring(0, 12)

        // 2. Sort entries to calculate relative time
        const sortedEntries = [...entries].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        const startDate = sortedEntries[0]?.createdAt || new Date()

        // 3. Map Data
        const cleanData: AnonymousEntry[] = sortedEntries.map(entry => {
            // Find signals related to this entry's timeframe (approx)
            const entrySignals = signals
                .filter(s => Math.abs(s.createdAt.getTime() - entry.createdAt.getTime()) < 1000 * 60 * 60) // within hour
                .map(s => s.signalType)

            // Remove PII (Notes, Exact Timestamps)
            // Use "Day Offset" instead of calendar date to preserve privacy while keeping trends
            const dayOffset = Math.floor((entry.createdAt.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

            return {
                dayOffset,
                symptoms: {
                    discomfort: entry.discomfortLevel,
                    mood: entry.moodLevel,
                    stress: entry.stressLevel,
                    feeds: entry.feedsCount
                },
                signals: entrySignals
            }
        })

        return {
            researchId,
            datasetVersion: "v1.0.0",
            planType: user.planType,
            totalEntries: cleanData.length,
            data: cleanData
        }
    }
}
