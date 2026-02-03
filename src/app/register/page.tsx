"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ConsentCheckbox } from "@/components/legal/ConsentCheckbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "", inviteCode: "" })
    const [consentAccepted, setConsentAccepted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!consentAccepted) {
            setError("You must accept the Terms and Privacy Policy to register.")
            return
        }
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Registration failed")
            }

            // VICESSA REFACTOR: Auto-login after registration
            const signInRes = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (signInRes?.error) {
                // Determine error type? Just push to login if auto-login fails
                router.push("/login?error=AutoLoginFailed")
            } else {
                // Force full reload/redirect to ensure session is picked up
                window.location.href = "/dashboard"
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
            <Card className="w-full max-w-md shadow-xl border-none bg-white text-black">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <p className="text-center text-gray-500">Enter your details below to start your journey</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name field removed for privacy/anonymity - System Generated IDs only */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Email</label>
                            <Input
                                type="email"
                                placeholder="m@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="bg-white text-black border-gray-300 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Password</label>
                            <label className="text-sm font-medium leading-none">Password</label>
                            <PasswordInput
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••"
                                required
                                className="bg-white text-black border-gray-300 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Invite Code (Beta)</label>
                            <Input
                                value={formData.inviteCode}
                                onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                                placeholder="VICESSA2026"
                                required
                                className="bg-white text-black border-gray-300 placeholder:text-gray-400"
                            />
                        </div>

                        <ConsentCheckbox onConsentChange={setConsentAccepted} />

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-[var(--color-brand-rose)]">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
