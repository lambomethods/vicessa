import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input" // Assuming we might want to edit name later, but read-only for now is fine

import Link from "next/link"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, createdAt: true, planType: true }
    })

    return (
        <div className="container mx-auto p-6 max-w-2xl space-y-8 pb-24">
            {/* Nav Back */}
            <div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[var(--color-brand-rose)] text-gray-500 gap-2">
                        ← Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Settings</h1>
                <p className="text-gray-500">Manage your account and preferences.</p>
            </div>

            {/* PROFILE CARD */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-200">Full Name</label>
                        <Input value={user?.name || ""} disabled className="bg-white text-black border-none font-medium" />
                        <p className="text-xs text-gray-400">To change your name, please contact support during Beta.</p>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-200">Email Address</label>
                        <Input value={user?.email || ""} disabled className="bg-white text-black border-none font-medium" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-200">Membership Tier</label>
                        <div className="px-3 py-2 bg-[var(--color-brand-mist)] rounded-md border border-[var(--color-brand-sage)]/20 text-[var(--color-brand-eucalyptus)] font-bold flex items-center gap-2">
                            <span>✨</span> Beta Tester (All Features Unlocked)
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DATA & PRIVACY */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-black/20">
                        <div>
                            <h4 className="font-semibold text-white">Export My Data</h4>
                            <p className="text-sm text-gray-300">Download a copy of your tracking history (JSON).</p>
                        </div>
                        <a href="mailto:support@vicessa.app?subject=Request Data Export&body=Please send me a copy of my data." className="inline-block">
                            <Button variant="outline" type="button" className="text-white border-white/30 hover:bg-white/10">
                                Request
                            </Button>
                        </a>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-900/30 bg-red-950/30 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-red-200">Delete Account</h4>
                            <p className="text-sm text-red-300">Permanently remove all data. This cannot be undone.</p>
                        </div>
                        <a href="mailto:support@vicessa.app?subject=DELETE ACCOUNT REQUEST&body=I want to permanently delete my account." className="inline-block">
                            <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/20">
                                Contact to Delete
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* APP INFO */}
            <div className="text-center text-sm text-gray-400 pt-8">
                <p>Vicessa Beta v0.9.0</p>
                <p>Build: 2026.1.22</p>
            </div>
        </div>
    )
}
