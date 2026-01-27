import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { OverviewCharts } from "@/components/dashboard/OverviewCharts"
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate"
import Link from "next/link"

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const showOnboardingSuccess = searchParams?.onboarding === "complete"

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-[var(--foreground)]">Welcome back, Mama.</h1>
                <p className="text-muted-foreground">Here is your daily weaning summary.</p>
            </div>

            {showOnboardingSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
                    <div className="text-2xl">🎉</div>
                    <div>
                        <h3 className="font-bold">Your Personal Plan is Ready!</h3>
                        <p className="text-sm">We&apos;ve customized your daily goals and risk thresholds.</p>
                    </div>
                </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
                <Link href="/dashboard/tracking">
                    <Button className="bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose)]/90 text-white font-bold shadow-lg shadow-rose-200/50 transition-all hover:scale-105 active:scale-95">
                        + Log Entry
                    </Button>
                </Link>
                <Link href="/dashboard/history">
                    <Button variant="outline" className="border-[var(--color-brand-sage)] text-[var(--color-brand-eucalyptus)] hover:bg-[var(--color-brand-mist)] gap-2">
                        📖 Log Book
                    </Button>
                </Link>
                <Link href="/dashboard/report">
                    <Button variant="outline" className="border-[var(--color-brand-sage)] text-[var(--color-brand-eucalyptus)] hover:bg-[var(--color-brand-mist)] gap-2">
                        🖨️ Clinical Report
                    </Button>
                </Link>
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Status Card */}
                <Card className="bg-gradient-to-br from-[var(--color-brand-rose)] to-[var(--color-brand-gold)] text-white border-none">
                    <CardHeader>
                        <CardTitle className="text-white opacity-90">Current Goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-2">Day 12</div>
                        <p className="opacity-80">Slow weaning phase. 3 feeds/day.</p>
                    </CardContent>
                </Card>


                {/* Tip of the Day - High contrast fix */}
                <div className="rounded-xl border-2 border-gray-300 bg-white shadow-sm p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">💡 Tip of the Day</h3>
                    <p className="text-base text-gray-800 italic">&quot;Stay hydrated and wear supportive (but not tight) clothing to help with comfort.&quot;</p>
                </div>
            </div>

            {/* Main Transition Trends Chart - Premium Feature */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-200 bg-white">
                <h3 className="text-lg font-semibold mb-6 text-[var(--foreground)] flex items-center gap-2">
                    <span>📈</span> Transition Trends
                </h3>
                <SubscriptionGate
                    fallbackTitle="Unlock Your Trends"
                    fallbackDescription="Upgrade to Vicessa Plus to see your weaning progress and cycle correlations."
                >
                    <OverviewCharts />
                </SubscriptionGate>
            </div>
        </div>
    )
}
