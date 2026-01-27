import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"

const ResetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { token, password } = ResetPasswordSchema.parse(body)

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        })

        return NextResponse.json({ message: "Password reset successfully" })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }
        console.error("Reset Password Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
