import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input" // Assuming we might want to edit name later, but read-only for now is fine

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, createdAt: true, planType: true }
    })

    return (
        <div className="container mx-auto p-6 max-w-2xl space-y-8 pb-24">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Settings</h1>
                <p className="text-gray-500">Manage your account and preferences.</p>
            </div>

            {/* PROFILE CARD */}
            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input value={user?.name || ""} disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-500">To change your name, please contact support during Beta.</p>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input value={user?.email || ""} disabled className="bg-gray-50" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Membership Tier</label>
                        <div className="px-3 py-2 bg-[var(--color-brand-mist)] rounded-md border border-[var(--color-brand-sage)]/20 text-[var(--color-brand-eucalyptus)] font-bold flex items-center gap-2">
                            <span>🦄</span> Beta Tester (All Features Unlocked)
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DATA & PRIVACY */}
            <Card>
                <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">Export My Data</h4>
                            <p className="text-sm text-gray-500">Download a copy of your tracking history (JSON).</p>
                        </div>
                        <form action="/api/admin/export-data" method="GET">
                            {/* In a real app we'd need a specific user-export endpoint, reusing admin for MVP demo if appropriate or simple alert */}
                            {/* For now, let's just put a placeholder button that alerts or a 'Request' button */}
                            <Button variant="outline" type="button" className="opacity-50 cursor-not-allowed">
                                Download
                            </Button>
                        </form>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-red-900">Delete Account</h4>
                            <p className="text-sm text-red-700">Permanently remove all data. This cannot be undone.</p>
                        </div>
                        <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white">
                            Delete Account
                        </Button>
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
