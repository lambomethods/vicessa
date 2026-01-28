import { TrackerEntry } from "@prisma/client"
import { FLAGS } from "./flags"

// NEUTRALITY ENFORCED: No medical terms.
export type PatternType = "PATTERN_TIMING" | "ROUTINE_SHIFT" | "SILENT_CORRELATION" | "INFO"

export interface InsightResult {
    signalType: PatternType | string
    message: string // strictly observable facts
    severity: "low" | "medium" // No "high"/danger in Stage 0/1
    context?: string
    prediction?: string // internal only
}

export class InsightEngine {
    /**
     * Stage 1: Pattern Engine.
     * Logic: If X (action) -> then Y (result).
     * No diagnosis. No "Risk Scores".
     */
    static analyze(newEntry: TrackerEntry, history: TrackerEntry[]): InsightResult[] {
        if (FLAGS.SAFE_MODE) return []

        const insights: InsightResult[] = []

        // 1. ROUTINE SHIFT: Physical Intensity (formerly "Discomfort Spike")
        // Logic: Metric > 4 AND consistent low history.
        const isIntensitySpike = this.detectMetricVariability(newEntry, history, "discomfortLevel", 4, 2)
        if (isIntensitySpike) {
            insights.push({
                signalType: "ROUTINE_SHIFT",
                message: "Sensing a shift. Similar variations in physical intensity are often logged by others at this stage.",
                severity: "medium",
                context: "Monitor for 24h."
            })
        }

        // 2. PATTERN TIMING: Mood shifts (formerly "PPD Check")
        // Logic: Consistent low < 3 for 3 days.
        const isMoodShift = this.detectStableTrend(newEntry, history, "moodLevel", 3, 3)
        if (isMoodShift) {
            insights.push({
                signalType: "PATTERN_TIMING",
                message: "Pattern observed. This sequence of mood entries aligns with common adjustments in our dataset.",
                severity: "medium",
                context: "Consider your rest schedule."
            })
        }

        // 3. SILENT CORRELATION ENGINE (The Core of Stage 1)
        // Logic: Supply Drop (>1 feed) -> Watch 24-96h -> Check for Mood/Pain variance.
        // We only LOG this. We do not show it to the user yet (Shadow Mode).
        this.runShadowCorrelationCheck(newEntry, history, insights)

        return insights
    }

    // --- LOGIC KERNELS (Backend Only) ---

    // Detects sudden shift from baseline
    private static detectMetricVariability(
        current: TrackerEntry,
        history: TrackerEntry[],
        field: keyof TrackerEntry,
        upperLimit: number,
        baselineLimit: number
    ): boolean {
        const value = current[field] as number
        if (!value || value < upperLimit) return false

        const recentHistory = history.slice(0, 2)
        if (recentHistory.length === 0) return false

        return recentHistory.every(entry => {
            const val = entry[field] as number
            return val !== null && val <= baselineLimit
        })
    }

    // Detects consistent trend (Stability)
    private static detectStableTrend(
        current: TrackerEntry,
        history: TrackerEntry[],
        field: keyof TrackerEntry,
        threshold: number,
        days: number
    ): boolean {
        const value = current[field] as number
        if (!value || value >= threshold) return false

        const recentHistory = history.slice(0, days - 1)
        if (recentHistory.length < days - 1) return false

        return recentHistory.every(entry => {
            const val = entry[field] as number
            return val !== null && val < threshold
        })
    }

    // STAGE 1 CORE: The Correlation Logic
    private static runShadowCorrelationCheck(
        current: TrackerEntry,
        history: TrackerEntry[],
        insights: InsightResult[]
    ) {
        // Only run if we detect a "Reaction" (Mood or Pain intensity)
        const isReaction = (current.moodLevel && current.moodLevel < 3) || (current.discomfortLevel && current.discomfortLevel > 3)

        if (isReaction) {
            // Look back 24-96h for the "Trigger" (Feed Drop)
            const trigger = this.findLaggedTrigger(history, "feedsCount", 24, 96)

            if (trigger) {
                insights.push({
                    signalType: "SILENT_CORRELATION", // Client hides this
                    message: "correlation_detected_internal",
                    severity: "low",
                    context: `Theory: Mood/Pain shift linked to -${trigger.dropAmount} feeds ${trigger.hoursAgo}h ago.`,
                    prediction: "Validating correlation logic."
                })
            }
        }
    }

    private static findLaggedTrigger(
        history: TrackerEntry[],
        field: keyof TrackerEntry,
        minHours: number,
        maxHours: number
    ): { dropAmount: number, hoursAgo: number } | null {
        if (history.length < 5) return null // Need data density

        const now = new Date().getTime()
        const msPerHour = 3600 * 1000

        // Isolate the Window
        const windowEntries = history.filter(entry => {
            const age = (now - entry.createdAt.getTime()) / msPerHour
            return age >= minHours && age <= maxHours
        })

        if (windowEntries.length < 2) return null

        // Detect Drop Event in Window (> 1 unit drop between adjacent entries)
        for (let i = 0; i < windowEntries.length - 1; i++) {
            const newer = windowEntries[i]
            const older = windowEntries[i + 1]

            const newerVal = newer[field] as number || 0
            const olderVal = older[field] as number || 0

            if (olderVal - newerVal >= 1) {
                const age = Math.round((now - newer.createdAt.getTime()) / msPerHour)
                return { dropAmount: olderVal - newerVal, hoursAgo: age }
            }
        }

        return null
    }
}
