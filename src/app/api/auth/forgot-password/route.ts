import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"

// Mock email service for now
import { NotificationService } from "@/lib/notifications"

const ForgotPasswordSchema = z.object({
    email: z.string().email(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email } = ForgotPasswordSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            // Return 200 to prevent email enumeration
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex")
        const passwordResetExpires = new Date(Date.now() + 3600000) // 1 hour

        await prisma.user.update({
            where: { email },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires,
            },
        })

        // Send email (Mock)
        const resetLink = `${process.env.AUTH_URL}/reset-password?token=${resetToken}`
        await NotificationService.sendEmail({
            to: email,
            subject: "Reset your Vicessa password",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
        })

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 })
        }
        console.error("Forgot Password Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
