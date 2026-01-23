import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const PostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
})

export async function GET(req: Request) {
    try {
        // Public READ (or protected if desired)
        // const session = await auth() 

        const posts = await prisma.post.findMany({
            include: {
                user: { select: { name: true, image: true } },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        })

        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

import { rateLimit } from "@/lib/ratelimit"
import { NextRequest } from "next/server"

// ... imports

export async function POST(req: NextRequest) {
    const rateLimitResult = await rateLimit(req)
    if (!rateLimitResult.success) {
        return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 })
    }
    try {
        const session = await auth()
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const json = await req.json()
        const { title, content } = PostSchema.parse(json)

        const post = await prisma.post.create({
            data: {
                userId: session.user.id,
                title,
                content,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
