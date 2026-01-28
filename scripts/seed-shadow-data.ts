
import { PrismaClient } from "@prisma/client"
import { InsightEngine } from "../src/lib/intelligence"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding Shadow Dashboard Data...")

    // 1. Get or Create Test User
    let user = await prisma.user.findUnique({ where: { email: "shadow_test@vicessa.com" } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: "shadow_test@vicessa.com",
                password: "hashed_placeholder",
                name: "Shadow Tester"
            }
        })
    }

    const userId = user.id

    // 2. Clear previous test data
    await prisma.insightSignal.deleteMany({ where: { userId } })
    await prisma.trackerEntry.deleteMany({ where: { userId } })

    console.log(`🧹 Cleared data for user: ${userId}`)

    // 3. Create History Pattern (The "Weaning Crash")
    // 2 days ago: High feeds, good mood
    // 1 day ago: Feed drop
    // Today: Low feeds, BAD mood (Trigger)

    const now = new Date()
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)

    const historyData = [
        { hours: 50, feeds: 6, mood: 5, pain: 1 },
        { hours: 38, feeds: 6, mood: 5, pain: 1 },
        { hours: 26, feeds: 2, mood: 4, pain: 2 }, // DROP HAPPENED HERE (Safely > 24h)
        { hours: 12, feeds: 2, mood: 3, pain: 2 },
        { hours: 62, feeds: 6, mood: 5, pain: 1 }, // Filler for density check
        { hours: 74, feeds: 6, mood: 5, pain: 1 }, // Filler for density check
    ]

    for (const h of historyData) {
        await prisma.trackerEntry.create({
            data: {
                userId,
                date: hoursAgo(h.hours),
                createdAt: hoursAgo(h.hours),
                updatedAt: hoursAgo(h.hours),
                feedsCount: h.feeds,
                moodLevel: h.mood,
                discomfortLevel: h.pain,
                pumpSessions: 0
            }
        })
    }

    // 4. Create "Current" Entry (The Reaction)
    const currentEntry = await prisma.trackerEntry.create({
        data: {
            userId,
            date: now,
            feedsCount: 2,
            moodLevel: 1, // REACTION: Mood Crash
            discomfortLevel: 4, // REACTION: Pain Spike
            pumpSessions: 0
        }
    })

    // 5. Run Intelligence Engine
    const fullHistory = await prisma.trackerEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })

    const insights = InsightEngine.analyze(currentEntry, fullHistory.slice(1))

    console.log("🧠 Analysis Result:", insights)

    // 6. Save Signals (Mimic API)
    if (insights.length > 0) {
        await prisma.insightSignal.createMany({
            data: insights.map(insight => ({
                userId,
                signalType: insight.signalType,
                message: insight.message,
                severity: insight.severity,
                // Context is not saved to DB schema, effectively dropped here as per current schema
            }))
        })
        console.log(`✅ Saved ${insights.length} signals to DB.`)
    } else {
        console.warn("⚠️ No signals generated! Check logic.")
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
