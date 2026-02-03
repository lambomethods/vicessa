import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    inviteCode: z.string().min(1, "Invite code is required"),
    aiDataConsent: z.boolean().optional(),
})
// ... (lines 13-32)
const { email, password, name, inviteCode, aiDataConsent } = result.data

// ... (lines 34-48)
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
