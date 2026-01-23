import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { InsightEngine } from "@/lib/intelligence"
import { NextResponse } from "next/server"
import { z } from "zod"

const TrackerEntrySchema = z.object({
    // Lactation
    feedsCount: z.number().min(0).default(0),
    pumpSessions: z.number().min(0).default(0),
    lastFeedTime: z.string().optional().nullable(), // ISO string

    // Physical
    discomfortLevel: z.number().min(0).max(5).optional().nullable(),
    fullnessLevel: z.number().min(0).max(5).optional().nullable(),
    sensitivityLevel: z.number().min(0).max(5).optional().nullable(),
    temperatureLevel: z.number().min(0).max(5).optional().nullable(),

    // Emotional
    stressLevel: z.number().min(0).max(5).optional().nullable(),
    moodLevel: z.number().min(0).max(5).optional().nullable(),
    anxietyLevel: z.number().min(0).max(5).optional().nullable(),

    // Baby
    babyFussiness: z.number().min(0).max(5).optional().nullable(),
    solidFoodIntake: z.number().min(0).max(100).optional().nullable(),
    babyDependency: z.string().optional().nullable(),

    notes: z.string().optional().nullable(),
})


// Main Handler Logic (Decoupled from generic NextRequest)
async function handler(req: Request, data: z.infer<typeof TrackerEntrySchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Transaction to save entry and check for anomalies
    const result = await prisma.$transaction(async (tx) => {
        // 1. Get History (Last 5 days is sufficient for current rules)
        const history = await tx.trackerEntry.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            take: 5
        })

        // 2. Create New Entry
        const newEntry = await tx.trackerEntry.create({
            data: {
                userId: userId,
                feedsCount: data.feedsCount,
                pumpSessions: data.pumpSessions,
                lastFeedTime: data.lastFeedTime ? new Date(data.lastFeedTime) : null,
                discomfortLevel: data.discomfortLevel,
                fullnessLevel: data.fullnessLevel,
                sensitivityLevel: data.sensitivityLevel,
                temperatureLevel: data.temperatureLevel,
                stressLevel: data.stressLevel,
                moodLevel: data.moodLevel,
                anxietyLevel: data.anxietyLevel,
                babyFussiness: data.babyFussiness,
                solidFoodIntake: data.solidFoodIntake,
                babyDependency: data.babyDependency,
                notes: data.notes,
            },
        })

        // 3. Generate Insight Signals using Intelligence Engine
        const insights = InsightEngine.analyze(newEntry, history)

        if (insights.length > 0) {
            await tx.insightSignal.createMany({
                data: insights.map(insight => ({
                    userId: userId,
                    signalType: insight.signalType,
                    message: insight.message,
                    severity: insight.severity,
                    rawMood: data.moodLevel,
                    rawPainLevel: data.discomfortLevel
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
