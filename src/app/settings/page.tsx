import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

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
            <Card className="bg-white text-black dark:bg-white dark:text-black shadow-xl border-none">
                <CardHeader>
                    <CardTitle className="text-gray-900">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Name Removed for Privacy/Anonymity */}

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-900">Email Address</label>
                        <Input
                            value={user?.email || ""}
                            disabled
                            className="bg-white text-black border-gray-200 font-medium disabled:opacity-100 disabled:bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                            Your email is used only for secure login and account recovery. It is not shared or displayed publicly.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-900">Membership Tier</label>
                        <div className="px-3 py-2 bg-[var(--color-brand-mist)] rounded-md border border-[var(--color-brand-sage)]/20 text-[var(--color-brand-eucalyptus)] font-bold flex items-center gap-2">
                            <span>✨</span> Beta Tester (All Features Unlocked)
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DATA & PRIVACY */}
            <Card className="bg-white text-black dark:bg-white dark:text-black shadow-xl border-none">
                <CardHeader>
                    <CardTitle className="text-gray-900">Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                            <h4 className="font-semibold text-gray-900">Export My Data</h4>
                            <p className="text-sm text-gray-600">Download a copy of your tracking history (JSON).</p>
                        </div>
                        <a href="mailto:support@vicessa.app?subject=Request Data Export&body=Please send me a copy of my data." className="inline-block">
                            <Button variant="outline" type="button" className="border-gray-300 hover:bg-gray-100 text-gray-900">
                                Request
                            </Button>
                        </a>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-red-900">Delete Account</h4>
                            <p className="text-sm text-red-700">Permanently remove all data. This cannot be undone.</p>
                        </div>
                        <a href="mailto:support@vicessa.app?subject=DELETE ACCOUNT REQUEST&body=I want to permanently delete my account." className="inline-block">
                            <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white border-none shadow-md">
                                Contact to Delete
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* APP INFO */}
            <div className="text-center text-sm text-gray-400 pt-8">
                <p>Vicessa Beta v0.9.1</p>
                <p>Build: 2026.2.3</p>
            </div>
        </div>
    )
}
