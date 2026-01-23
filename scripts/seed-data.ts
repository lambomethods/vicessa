
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    console.log("Seeding data...")

    // Find the user created by browser subagent
    const user = await prisma.user.findFirst({
        where: { email: "test_retry@vicessa.com" }
    })

    if (!user) {
        console.error("User test_retry@vicessa.com not found!")
        return
    }
    console.log("Seeding for user:", user.email)

    // Clear existing
    await prisma.trackerEntry.deleteMany({ where: { userId: user.id } })
    await prisma.insightSignal.deleteMany({ where: { userId: user.id } })

    const today = new Date()

    // Day 1 (2 days ago) - Calm
    await prisma.trackerEntry.create({
        data: {
            userId: user.id,
            date: new Date(today.getTime() - 48 * 60 * 60 * 1000),
            feedsCount: 8,
            discomfortLevel: 1,
            moodLevel: 4,
            notes: "Feeling good, starting to drop one feed."
        }
    })

    // Day 2 (Yesterday) - Moderate
    await prisma.trackerEntry.create({
        data: {
            userId: user.id,
            date: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            feedsCount: 6, // Dropped 2 feeds
            discomfortLevel: 3,
            moodLevel: 3,
            notes: "Slight pressure in evening."
        }
    })

    // Day 3 (Today) - Spike involved
    await prisma.trackerEntry.create({
        data: {
            userId: user.id,
            date: today,
            feedsCount: 4, // Dropped rapidly
            discomfortLevel: 5, // Spike!
            moodLevel: 2,
            notes: "Painful, feverish feeling."
        }
    })

    // Manually create the signals that WOULD have been created
    await prisma.insightSignal.create({
        data: {
            userId: user.id,
            signalType: "pattern_shift",
            message: "Discomfort Spike detected (+2 levels)",
            severity: "medium",
            congestionIndicator: "high",
            stabilityScore: 40,
            date: today
        }
    })

    await prisma.insightSignal.create({
        data: {
            userId: user.id,
            signalType: "pace_change",
            message: "Rapid drop in feeding frequency",
            severity: "medium",
            stabilityScore: 40,
            date: today
        }
    })

    console.log("Seeding complete.")
}

main()
