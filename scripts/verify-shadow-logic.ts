
import { PrismaClient } from "@prisma/client"
import { InsightEngine } from "../src/lib/intelligence"

const prisma = new PrismaClient()

async function main() {
    console.log("🔧 Forcing Shadow Verification...")

    // 1. Get Bug Test User
    const user = await prisma.user.findUnique({ where: { email: "bug_test_v1@test.com" } })
    if (!user) throw new Error("User not found (Run seed-bug-test.ts first)")

    const userId = user.id

    // 2. Clear Signals (Start fresh)
    await prisma.insightSignal.deleteMany({ where: { userId } })

    // 3. Create "Current" Entry (REACTION)
    // We already seeded history. Now we add the trigger point.
    // Mood: 1, Pain: 4
    const currentEntry = await prisma.trackerEntry.create({
        data: {
            userId,
            date: new Date(),
            feedsCount: 2,
            moodLevel: 1,
            discomfortLevel: 4,
            pumpSessions: 0
        }
    })

    // 4. Run Logic (Simulate API Route)
    const history = await prisma.trackerEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })

    const insights = InsightEngine.analyze(currentEntry, history.slice(1))

    console.log("🧠 Engine Output:", insights)

    // 5. Save (Simulate API Route)
    if (insights.length > 0) {
        await prisma.insightSignal.createMany({
            data: insights.map(insight => ({
                userId,
                signalType: insight.signalType,
                message: insight.message,
                severity: insight.severity,
                // rawMood etc...
            }))
        })
        console.log("✅ Signals Saved to DB.")
    } else {
        console.error("❌ NO SIGNALS GENERATED. Logic Check Failed.")
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
