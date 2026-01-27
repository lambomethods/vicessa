import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { logFailedAuth } from "@/lib/security-log"

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

/**
 * Check if authentication is currently disabled (killswitch)
 */
async function isAuthDisabled(): Promise<boolean> {
    try {
        const flag = await prisma.systemFlag.findUnique({
            where: { key: "DISABLE_AUTH" },
        })
        return flag?.value || false
    } catch (error) {
        console.error("Failed to check auth disabled flag:", error)
        return false
    }
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
                // Check if auth is disabled (emergency killswitch)
                const authDisabled = await isAuthDisabled()
                if (authDisabled) {
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
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            // Check if auth is disabled during session
            const authDisabled = await isAuthDisabled()
            if (authDisabled) {
                console.warn("Session requested while AUTH disabled")
                return null as any
            }

            if (token.sub && session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.sub as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).role = token.role || 'user'
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).role || 'user'
            }
            return token
        }
    }
})
