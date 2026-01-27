import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = session.user.id

    // 1. Cleanup old data
    await prisma.trackerEntry.deleteMany({ where: { userId } })
    // Only delete posts by THIS user to avoid wiping community if we run this often
    await prisma.post.deleteMany({ where: { userId } })

    // 2. Generate "The Golden Path" (30 Days of Weaning)
    const entries = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Progress curve (0 to 1)
        const progress = 1 - (i / 29)

        // Simulation Logic:
        // - Initially (Day 30 ago): High Discomfort (4-5), Frequent Feeds (6+)
        // - Middle (Day 15 ago): Moderate Discomfort (2-3), Spikey Mood
        // - Now (Day 0): Low Discomfort (1), Low Feeds (2)

        let discomfort = Math.max(1, Math.round(5 - (progress * 4))) // 5 -> 1
        let mood = Math.min(5, Math.round(2 + (progress * 3))) // 2 -> 5
        const feeds = Math.max(0, Math.round(8 - (progress * 6))) // 8 -> 2

        // Add "Real Life" Noise
        if (Math.random() > 0.8) discomfort += 1 // Random flare up
        if (Math.random() > 0.8) mood -= 2 // Random bad day

        // Clamp values
        discomfort = Math.min(5, Math.max(1, discomfort))
        mood = Math.min(5, Math.max(1, mood))

        entries.push({
            userId,
            createdAt: date,
            date: date,
            feedsCount: feeds,
            discomfortLevel: discomfort,
            moodLevel: mood,
            notes: i === 0 ? "Feeling proud of how far I've come." : (i === 14 ? "Mid-way spike, very painful." : null)
        })
    }
    await prisma.trackerEntry.createMany({ data: entries })

    // 3. Populate Community Feed (if empty)
    const existingPosts = await prisma.post.count()
    if (existingPosts < 5) {
        await prisma.post.createMany({
            data: [
                { userId, title: "Night Weaning Success!", content: "Finally slept through the night without a feed. The 'gentle' approach really worked for us." },
                { userId, title: "Cabbage Leaves?", content: "Has anyone actually tried cold cabbage leaves for engorgement? Asking for a friend (me)." },
                { userId, title: "Emotional Rollercoaster", content: "I didn't expect to feel this sad about stopping. Is this normal hormone crash?" }
            ]
        })
    }

    return NextResponse.json({
        success: true,
        msg: "Golden Data Seeded",
        entries: entries.length
    })
}
