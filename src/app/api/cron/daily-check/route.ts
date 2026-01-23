import { prisma } from "@/lib/db"
import { EngagementEngine } from "@/lib/engagement"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    // In production, verify a "CRON_SECRET" header here to prevent abuse.
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return new Response('Unauthorized', { status: 401 }); }

    try {
        // 1. Get all "active" users (e.g., created in last 30 days)
        // Just fetching 50 for MVP demo
        const users = await prisma.user.findMany({
            take: 50,
            select: { id: true, planType: true }
        })

        const results = []

        // 2. Run Checks for Each
        for (const user of users) {
            // Check for stagnation (Risk of drop-off)
            const stagnationResult = await EngagementEngine.checkStagnation(user.id)

            // If not stagnant, maybe send a daily tip?
            let tipResult = null
            if (stagnationResult.status === "active_or_ignored") {
                tipResult = await EngagementEngine.generateDailyTip(user.id)
            }

            results.push({
                userId: user.id,
                stagnation: stagnationResult.status,
                tip: tipResult?.status
            })
        }

        return NextResponse.json({
            success: true,
            checked: users.length,
            details: results
        })

    } catch (error) {
        console.error("Cron Error:", error)
        return NextResponse.json({ error: "Daily Check Failed" }, { status: 500 })
    }
}
