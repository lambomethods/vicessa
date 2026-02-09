import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { InsightEngine } from "@/lib/intelligence"
import { NextResponse } from "next/server"
import { z } from "zod"

export const TrackerEntrySchema = z.object({
    // Lactation / Logistics
    feedsCount: z.number().min(0).default(0),
    pumpSessions: z.number().min(0).default(0),
    lastFeedTime: z.string().optional().nullable(),
    nursingSessions: z.number().min(0).optional().nullable(),
    maxMilkGap: z.number().min(0).optional().nullable(),
    milkVolume: z.string().optional().nullable(), // FULL, HALF, MINIMAL

    // Physical
    bodyTemperature: z.number().optional().nullable(),
    physicalSymptoms: z.array(z.string()).optional().default([]), // Bubbles
    painLevel: z.number().min(0).max(10).optional().nullable(),
    breastHeatmap: z.any().optional().nullable(), // Allow JSON object

    // Emotional / Mood
    moodSignals: z.array(z.string()).optional().default([]),
    irritabilityScore: z.number().min(1).max(5).optional().nullable(),

    // Interventions
    interventions: z.array(z.string()).optional().default([]),

    // Legacy Fields (Optional)
    discomfortLevel: z.number().min(0).max(5).optional().nullable(),
    moodLevel: z.number().min(0).max(5).optional().nullable(),
    stressLevel: z.number().min(0).max(5).optional().nullable(),
    sleepHours: z.number().min(0).max(24).optional().nullable(),
    sleepQuality: z.number().min(0).max(5).optional().nullable(),
    babyFussiness: z.number().min(0).max(5).optional().nullable(),
    solidFoodIntake: z.number().min(0).max(100).optional().nullable(),
    babyDependency: z.string().optional().nullable(),

    notes: z.string().optional().nullable(),
    date: z.string().optional().nullable()
})

// Main Handler Logic
async function handler(req: Request, data: z.infer<typeof TrackerEntrySchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const result = await prisma.$transaction(async (tx) => {
        const history = await tx.trackerEntry.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            take: 5
        })

        const newEntry = await tx.trackerEntry.create({
            data: {
                userId: userId,
                date: data.date ? new Date(data.date) : new Date(),

                // Logistics
                feedsCount: data.feedsCount,
                pumpSessions: data.pumpSessions,
                nursingSessions: data.nursingSessions,
                maxMilkGap: data.maxMilkGap,
                milkVolume: data.milkVolume,
                lastFeedTime: data.lastFeedTime ? new Date(data.lastFeedTime) : null,

                // Physical
                bodyTemperature: data.bodyTemperature,
                physicalSymptoms: data.physicalSymptoms, // Array
                painLevel: data.painLevel,
                breastHeatmap: data.breastHeatmap ?? undefined, // JSON

                // Emotional
                moodSignals: data.moodSignals,
                irritabilityScore: data.irritabilityScore,
                interventions: data.interventions,

                // Legacy Mapping (for compatibility if needed)
                discomfortLevel: data.painLevel ? Math.ceil(data.painLevel / 2) : data.discomfortLevel,
                moodLevel: data.moodLevel,
                stressLevel: data.stressLevel,

                sleepHours: data.sleepHours,
                sleepQuality: data.sleepQuality,
                notes: data.notes,
            },
        })

        // 3. Generate Insight Signals (Intelligence Engine - might need update later)
        const insights = InsightEngine.analyze(newEntry, history)

        if (insights.length > 0) {
            await tx.insightSignal.createMany({
                data: insights.map(insight => ({
                    userId: userId,
                    signalType: insight.signalType,
                    message: insight.message,
                    severity: insight.severity,
                    rawMood: data.moodLevel,
                    rawPainLevel: data.painLevel ? Math.ceil(data.painLevel / 2) : 0
                }))
            })
        }

        return { entry: newEntry, insightsCount: insights.length }
    })

    return NextResponse.json(result)
}

// Export the Wrapped Route
import { withValidation } from "@/lib/api-middleware"
export const POST = withValidation(TrackerEntrySchema, handler)
