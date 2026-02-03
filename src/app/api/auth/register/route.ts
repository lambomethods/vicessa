import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"
import { rateLimit } from "@/lib/ratelimit"
import { NextRequest } from "next/server"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    inviteCode: z.string().min(1, "Invite code is required"),
    aiDataConsent: z.boolean().optional(),
})

const VALID_INVITE_CODES = ["VICESSA2026", "BETA_EARLY", "MAMA2026"]

export async function POST(req: NextRequest) {
    const rateLimitResult = await rateLimit(req)
    if (!rateLimitResult.success) {
        return NextResponse.json({ error: "Too many attempts" }, { status: 429 })
    }
    try {
        const body = await req.json()
        const result = RegisterSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }

        const { email, password, name, inviteCode, aiDataConsent } = result.data

        if (!VALID_INVITE_CODES.includes(inviteCode.toUpperCase())) {
            return NextResponse.json({ error: "Invalid beta invite code" }, { status: 403 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                aiDataConsent: aiDataConsent || false,
            },
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword, { status: 201 })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
