import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { OverviewCharts } from "@/components/dashboard/OverviewCharts"
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { DynamicInsightCard } from "@/components/dashboard/DynamicInsightCard"

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const showOnboardingSuccess = searchParams?.onboarding === "complete"

    // 1. Fetch Latest Insight (Phase 3 Engine)
    const latestInsightRaw = await prisma.insightSignal.findFirst({
        where: {
            userId: session.user.id,
            // STAGE 1: Hide Silent Correlations (Backend Only)
            signalType: {
                not: 'SILENT_CORRELATION'
            }
        },
        orderBy: { createdAt: "desc" },
    })

    // 2. Fetch User Stats (Streak/Counts)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysEntriesCount = await prisma.trackerEntry.count({
        where: {
            userId: session.user.id,
            createdAt: { gte: today }
        }
    })

    const latestEntry = await prisma.trackerEntry.findFirst({
        where: {
            userId: session.user.id,
            createdAt: { gte: today }
        },
        orderBy: { createdAt: 'desc' },
        select: { sleepHours: true }
    })

    // TODO: move logic to separate data-access layer later

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold font-serif text-[var(--foreground)]">Transition Snapshot</h2>
                <div className="text-muted-foreground">
                    <p>
                        {todaysEntriesCount > 0
                            ? `You've logged ${todaysEntriesCount} times today. Keeping the data flowing!`
                            : "Ready to log your first entry for today?"}
                    </p>
                    {latestEntry?.sleepHours !== null && latestEntry?.sleepHours !== undefined && (
                        <p className="text-sm font-medium text-blue-600 mt-1">
                            💤 Last Sleep Logged: {latestEntry.sleepHours} hrs
                        </p>
                    )}
                </div>
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
            <div className="flex flex-wrap gap-3">
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
                        🖨️ Full Report
                    </Button>
                </Link>

                {/* FEEDBACK LOOP (Beta Polish) */}
                <a href="mailto:support@vicessa.app?subject=Feedback" target="_blank">
                    <Button variant="ghost" className="text-gray-500 hover:text-[var(--color-brand-rose)] gap-2">
                        💌 Help & Feedback
                    </Button>
                </a>
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Dynamic Insight Card - Smart Engine */}
                <DynamicInsightCard insight={latestInsightRaw} />


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
                <OverviewCharts />
            </div>
        </div>
    )
}
