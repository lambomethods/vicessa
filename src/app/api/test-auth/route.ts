import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        
        const user = await prisma.user.findUnique({
            where: { email },
        })
        
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 401 })
        }
        
        const match = await bcrypt.compare(password, user.password)
        
        return NextResponse.json({
            success: match,
            user: match ? { id: user.id, email: user.email, name: user.name, role: user.role } : null,
            error: match ? null : "Password mismatch",
        })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
