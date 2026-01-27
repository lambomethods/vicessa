"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("test@example.com")
    const [password, setPassword] = useState("Test123456")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            console.log("Attempting login with:", { email, password })
            
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            console.log("SignIn response:", res)

            if (res?.error) {
                setError("Invalid credentials")
                return
            }

            if (res?.ok) {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            console.error("Login error:", err)
            setError("An error occurred during login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-gray-400 mb-8">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="test@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <a href="/register" className="text-rose-500 hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
// force redeploy Mon Jan 26 11:45:04 PM EST 2026
