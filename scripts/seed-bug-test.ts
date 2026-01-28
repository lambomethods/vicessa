
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding Bug Test User...")

    // 1. Create Test User
    const email = "bug_test_v1@test.com"
    const password = "password123"
    const hashedPassword = await bcrypt.hash(password, 10)

    let user = await prisma.user.findUnique({ where: { email } })
    if (user) {
        console.log("User exists, cleaning up...")
        await prisma.insightSignal.deleteMany({ where: { userId: user.id } })
        await prisma.trackerEntry.deleteMany({ where: { userId: user.id } })
        await prisma.user.delete({ where: { id: user.id } })
    }

    user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: "Bug Test User",
            role: "admin" // Give admin so we can see /admin/shadow easily
        }
    })

    const userId = user.id
    const now = new Date()
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)

    // 2. Create History Pattern (The "Weaning Crash" Setup)
    // 50h ago: High feeds (6)
    // 38h ago: High feeds (6)
    // 26h ago: DROP HAPPENS -> Low feeds (2)
    // 12h ago: Low feeds (2)

    // NOTE: We do NOT log the current "Reaction". The Browser will do that.

    const historyData = [
        { hours: 50, feeds: 6, mood: 5, pain: 1 },
        { hours: 38, feeds: 6, mood: 5, pain: 1 },
        { hours: 26, feeds: 2, mood: 4, pain: 2 }, // DROP
        { hours: 12, feeds: 2, mood: 3, pain: 2 },
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

    console.log(`✅ Seeded history for ${email}. Ready for browser verification.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
