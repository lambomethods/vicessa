
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("Starting Super Seed...")

    const allUsers = await prisma.user.findMany()
    console.log("Current Users count:", allUsers.length)
    allUsers.forEach(u => console.log("- " + u.email))

    const email = "test_retry@vicessa.com"
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        console.log("Creating user:", email)
        const hashedPassword = await bcrypt.hash("password123", 10)
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: "Retry User",
                role: "user"
            }
        })
    } else {
        console.log("User found:", user.id)
    }

    console.log("Resetting Tracker Entries for user...")
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
            notes: "Seed: Feeling good."
        }
    })

    // Day 2 (Yesterday) - Moderate
    await prisma.trackerEntry.create({
        data: {
            userId: user.id,
            date: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            feedsCount: 6,
            discomfortLevel: 3,
            moodLevel: 3,
            notes: "Seed: Slight pressure."
        }
    })

    // Day 3 (Today) - Spike involved
    await prisma.trackerEntry.create({
        data: {
            userId: user.id,
            date: today,
            feedsCount: 4,
            discomfortLevel: 5,
            moodLevel: 2,
            notes: "Seed: Spike!"
        }
    })

    console.log("Seeding Complete. Try logging in as test_retry@vicessa.com / password123")
}

main()
