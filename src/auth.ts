import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user
    } catch (error) {
        console.error('Failed to fetch user:', error)
        return null
    }
}

const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request }: any) {
            // Check if auth is disabled
            if (process.env.DISABLE_AUTH === "true") {
                return false
            }
            const isOnDashboard = request.nextUrl?.pathname?.startsWith("/dashboard")
            if (isOnDashboard) {
                return !!auth?.user
            }
            return true
        },
        jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (process.env.DISABLE_AUTH === "true") {
                    console.warn("Auth disabled")
                    return null
                }

                const parsed = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (!parsed.success) {
                    console.log('Invalid format')
                    return null
                }

                const { email, password } = parsed.data
                
                try {
                    const user = await getUser(email)
                    if (!user) {
                        console.log('User not found:', email)
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (!passwordsMatch) {
                        console.log('Password mismatch for:', email)
                        return null
                    }

                    // Update last login
                    try {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { lastLoginAt: new Date() },
                        })
                    } catch (e) {
                        console.error("Failed to update last login:", e)
                    }

                    console.log('✅ Auth successful for:', email)
                    return user
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            },
        }),
    ],
})
