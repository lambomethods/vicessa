import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { TimelineView } from "@/components/tracker/TimelineView"
import { TrendChart } from "@/components/tracker/TrendChart"
import { redirect } from "next/navigation"

export default async function HistoryPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const entries = await prisma.trackerEntry.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: 14 // 2 weeks of history
    })

    return (
        <div className="container mx-auto p-6 max-w-2xl animate-fade-in space-y-8 pb-24">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">History</h1>
                <p className="text-gray-500">Your transition journey at a glance.</p>
            </div>

            <TrendChart data={entries.map(e => ({
                date: e.date.toISOString(),
                discomfort: e.discomfortLevel,
                mood: e.moodLevel
            }))} />

            <TimelineView entries={entries.map(e => ({
                id: e.id,
                date: e.date.toISOString(),
                // Metrics
                feedsCount: e.feedsCount,
                nursingSessions: e.nursingSessions,
                milkVolume: e.milkVolume,

                // Physiology
                bodyTemperature: e.bodyTemperature,
                physicalSymptoms: e.physicalSymptoms, // Rename if needed, but schema name is physicalSymptoms
                painLevel: e.painLevel,
                discomfortLevel: e.discomfortLevel,

                // Mood
                moodSignals: e.moodSignals,
                irritabilityScore: e.irritabilityScore,
                moodLevel: e.moodLevel,

                // Sleep
                sleepHours: e.sleepHours,

                // Interventions
                interventions: e.interventions,

                notes: e.notes
            }))} />
        </div>
    )
}
