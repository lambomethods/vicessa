import { TrackerEntry } from "@prisma/client"
import { FLAGS, isHighRisk } from "./flags"

export type RiskTrend = "stable" | "declining" | "rapid_decline" | "improving"
export type SymptomType = "mood" | "discomfort" | "supply"

export interface InsightResult {
    signalType: string // "trend_alert", "safety_check", "milestone"
    message: string
    severity: "low" | "medium" | "high"
}

export class InsightEngine {
    /**
     * Analyzes a new entry against historical context to detect meaningful patterns.
     * @param safeAI - Concept: AI that surfaces patterns, it DOES NOT diagnose.
     */
    static analyze(newEntry: TrackerEntry, history: TrackerEntry[]): InsightResult[] {
        // 0. SAFETY KILL SWITCHES
        if (FLAGS.SAFE_MODE) return []

        // 1. High Risk Check (Danger - Always Active)
        if (newEntry.notes && isHighRisk([newEntry.notes])) {
            return [{
                signalType: "danger_alert",
                message: "High-risk symptoms detected. Vicessa cannot provide guidance. Please contact a medical professional immediately.",
                severity: "high"
            }]
        }

        // 2. AI Kill Switch
        if (!FLAGS.AI_ENABLED) {
            return [{
                signalType: "info",
                message: "Automated insights are temporarily unavailable (Beta Mode). Please consult your healthcare provider.",
                severity: "low"
            }]
        }

        const insights: InsightResult[] = []

        // 1. Detect Discomfort Spike (Mastitis Risk Signal)
        // If discomfort >= 4 AND it was <= 2 in the last 2 entries
        const isSpike = this.detectSpike(newEntry, history, "discomfortLevel", 4, 2)
        if (isSpike) {
            insights.push({
                signalType: "health_pattern",
                message: "Your discomfort levels have risen sharply. Please check for redness or heat.",
                severity: "medium"
            })
        }

        // 2. Detect Emotional Drop (PPD/Anxiety Signal)
        // If mood is consistently low (<3) for > 3 days
        const isMoodLow = this.detectPersistentLow(newEntry, history, "moodLevel", 3, 3)
        if (isMoodLow) {
            insights.push({
                signalType: "emotional_support",
                message: "You've been reporting low mood for a few days. It might be time to prioritize rest or speak to a friend.",
                severity: "medium"
            })
        }

        // 3. Positive Reinforcement (Milestone)
        // If discomfort dropped from high to low over 3 entries
        const isImproving = this.detectImprovement(newEntry, history, "discomfortLevel")
        if (isImproving) {
            insights.push({
                signalType: "milestone",
                message: "Great progress! Your discomfort levels are trending down.",
                severity: "low"
            })
        }

        return insights
    }

    private static detectSpike(
        current: TrackerEntry,
        history: TrackerEntry[],
        field: keyof TrackerEntry,
        highThreshold: number,
        lowThreshold: number
    ): boolean {
        const value = current[field] as number
        if (!value || value < highThreshold) return false

        // Check last 2 entries
        const recentHistory = history.slice(0, 2)
        if (recentHistory.length === 0) return true // No history, but high value is technically a spike from 0

        // If ALL recent entries were low, then this is a spike
        return recentHistory.every(entry => {
            const histValue = entry[field] as number
            return histValue !== null && histValue <= lowThreshold
        })
    }

    private static detectPersistentLow(
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
            const histValue = entry[field] as number
            return histValue !== null && histValue < threshold
        })
    }

    private static detectImprovement(current: TrackerEntry, history: TrackerEntry[], field: keyof TrackerEntry): boolean {
        const currentVal = current[field] as number
        if (currentVal === null || currentVal > 2) return false

        // Check if previous 2 entries were higher
        const recentHistory = history.slice(0, 2)
        if (recentHistory.length < 2) return false

        return recentHistory.every(entry => (entry[field] as number) > currentVal)
    }
}
