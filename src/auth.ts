import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { logFailedAuth } from "@/lib/security-log"
import { prisma } from "@/lib/prisma"

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user
    } catch (error) {
        console.error('Failed to fetch user:', error)
        throw new Error('Failed to fetch user.')
    }
}

const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request }: any) {
            // Check if auth is disabled (emergency killswitch)
            if (process.env.DISABLE_AUTH === "true") {
                console.warn("Authentication attempt while AUTH disabled")
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
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Check if auth is disabled (emergency killswitch)
                if (process.env.DISABLE_AUTH === "true") {
                    console.warn("Authentication attempt while AUTH disabled")
                    return null
                }

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUser(email)
                    if (!user) {
                        // Log failed login attempt
                        await logFailedAuth(email)
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (passwordsMatch) {
                        // Update last login time
                        try {
                            await prisma.user.update({
                                where: { id: user.id },
                                data: { lastLoginAt: new Date() },
                            })
                        } catch (error) {
                            console.error("Failed to update last login:", error)
                        }
                        return user
                    } else {
                        // Log failed login attempt
                        await logFailedAuth(email)
                    }
                }

                console.log('Invalid credentials')
                return null
            },
        }),
    ],
})
