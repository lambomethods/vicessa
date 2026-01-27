import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get("limit") || "7")

        const entries = await prisma.trackerEntry.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
        })

        return NextResponse.json(entries)
    } catch (error) {
        console.error("Tracker History Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
