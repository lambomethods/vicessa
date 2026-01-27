import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const OnboardingSchema = z.object({
    // Context
    isCurrentlyBreastfeeding: z.boolean(),
    feedingFrequency: z.number().optional(),
    lastFeedTime: z.string().optional(), // ISO date string
    goalTimeline: z.string().optional(),
    primaryGoal: z.string().optional(),

    // Risk Baseline
    initialMood: z.number().min(1).max(5),
    initialPainLevel: z.number().min(1).max(10),
    hasMastitisHistory: z.boolean(),
    currentSymptoms: z.array(z.string()).optional(),
})

// ATI Logic (Simplified)
function calculateStabilityScore(mood: number, pain: number, symptoms: string[]) {
    let score = 100
    // Mood impact
    if (mood < 3) score -= 20
    if (mood === 1) score -= 10

    // Pain impact
    score -= (pain * 3)

    // Symptom impact
    if (symptoms.includes("Fever")) score -= 25
    if (symptoms.includes("Redness")) score -= 15
    if (symptoms.includes("Hard lumps")) score -= 15

    return Math.max(0, score)
}

function determineTrend(score: number) {
    if (score < 50) return "rapid_drop"
    if (score < 80) return "stable"
    return "optimal"
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const data = OnboardingSchema.parse(body)

        const stabilityScore = calculateStabilityScore(
            data.initialMood,
            data.initialPainLevel,
            data.currentSymptoms || []
        )

        const patternFlag = determineTrend(stabilityScore)

        // Transaction to ensure both context and risk records are created
        await prisma.$transaction(async (tx) => {
            // 1. Create/Update Profile (formerly Context)
            if (!session?.user?.id) throw new Error("User ID missing from session")

            await tx.profile.upsert({
                where: { userId: session.user.id },
                update: {
                    isCurrentlyBreastfeeding: data.isCurrentlyBreastfeeding,
                    feedingFrequency: data.feedingFrequency,
                    lastFeedTime: data.lastFeedTime ? new Date(data.lastFeedTime) : null,
                    goalTimeline: data.goalTimeline,
                    primaryGoal: data.primaryGoal,
                    journeyStage: "actively_transitioning"
                },
                create: {
                    userId: session.user.id,
                    isCurrentlyBreastfeeding: data.isCurrentlyBreastfeeding,
                    feedingFrequency: data.feedingFrequency,
                    lastFeedTime: data.lastFeedTime ? new Date(data.lastFeedTime) : null,
                    goalTimeline: data.goalTimeline,
                    primaryGoal: data.primaryGoal,
                    journeyStage: "actively_transitioning"
                },
            })

            // 2. Create Insight Signal (formerly Risk Baseline)
            // We always create a NEW signal to track history
            await tx.insightSignal.create({
                data: {
                    userId: session.user.id,
                    stabilityScore: stabilityScore,
                    congestionIndicator: data.initialPainLevel > 5 ? "moderate" : "low",
                    emotionalLoadIndex: 6 - data.initialMood,
                    signalType: patternFlag === "rapid_drop" ? "pattern_shift" : "pace_change", // Mapping logic
                    message: "Initial Baseline Established",
                    severity: patternFlag === "rapid_drop" ? "medium" : "low",
                    rawMood: data.initialMood,
                    rawPain: data.initialPainLevel,
                    // rawSymptoms removed or needs schema update? Schema says: rawMood, rawPain are there. rawSymptoms is NOT in schema. 
                    // Verify schema: rawMood Int?, rawPain Int?. No rawSymptoms in InsightSignal.
                    // So we omit rawSymptoms.
                },
            })

            // 3. Initialize Personal Plan 
            await tx.personalPlan.upsert({
                where: { userId: session.user.id },
                update: { status: "generating" },
                create: {
                    userId: session.user.id,
                    status: "generating",
                    planType: patternFlag === "rapid_drop" ? "medical_support" : "gentle"
                }
            })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 })
        }
        console.error("Onboarding Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
