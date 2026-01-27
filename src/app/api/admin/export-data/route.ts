import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Anonymizer } from "@/lib/data/anonymizer"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const session = await auth()
        // In a real app, strict Role-Based Access Control (RBAC) here.
        // For Vicessa MVP demo, we simply check if a user is logged in.
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized Access to Research Portal" }, { status: 401 })
        }

        // 1. Fetch Raw Data (The "Goldmine")
        // In production, this would be a streamed response or a background job.
        const users = await prisma.user.findMany({
            include: {
                trackerEntries: true,
                insightSignals: true
            },
            take: 100 // Safety limit for demo
        })

        // 2. Process through Anonymization Pipeline
        const dataset = users.map(user =>
            Anonymizer.process(user, user.trackerEntries, user.insightSignals)
        )

        // 3. Return as Research-Ready JSON
        return NextResponse.json({
            meta: {
                timestamp: new Date(),
                recordCount: dataset.length,
                description: "Vicessa Lactation Transition Dataset (De-identified)"
            },
            data: dataset
        })

    } catch (error) {
        console.error("Export Error:", error)
        return NextResponse.json({ error: "Data Export Failed" }, { status: 500 })
    }
}
