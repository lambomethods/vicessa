import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { DailyLogForm } from "@/components/tracker/DailyLogForm"
import { redirect } from "next/navigation"
import { format } from "date-fns"

export default async function TrackerPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Get recent entries for this user
    const recentEntries = await prisma.trackerEntry.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5
    })

    const today = new Date()
    const todayEntry = recentEntries.find(e =>
        format(e.createdAt, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    )

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Daily Log</h1>
                <p className="text-gray-500">{format(today, "EEEE, MMM d")}</p>
            </div>

            {todayEntry ? (
                <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">✅</span>
                        <h2 className="text-lg font-semibold text-green-800">Today's Log Saved</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-xl">
                            <span className="text-gray-500">Feeds</span>
                            <p className="text-xl font-bold">{todayEntry.feedsCount}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl">
                            <span className="text-gray-500">Pump Sessions</span>
                            <p className="text-xl font-bold">{todayEntry.pumpSessions}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl">
                            <span className="text-gray-500">Discomfort</span>
                            <p className="text-xl font-bold">{todayEntry.discomfortLevel ?? 0}/5</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl">
                            <span className="text-gray-500">Mood</span>
                            <p className="text-xl font-bold">{todayEntry.moodLevel ?? 3}/5</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl">
                            <span className="text-gray-500">Sleep</span>
                            <p className="text-xl font-bold">{todayEntry.sleepHours ?? 0}h</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl">
                            <span className="text-gray-500">Quality</span>
                            <p className="text-xl font-bold">{todayEntry.sleepQuality ?? 0}/5</p>
                        </div>
                    </div>
                    {todayEntry.notes && (
                        <div className="mt-4 p-3 bg-white rounded-xl">
                            <span className="text-gray-500 text-sm">Notes</span>
                            <p className="text-gray-700">{todayEntry.notes}</p>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-4">
                        Logged at {format(todayEntry.createdAt, "h:mm a")}
                    </p>
                </div>
            ) : null}

            <DailyLogForm existingEntry={todayEntry ? {
                feedsCount: todayEntry.feedsCount,
                pumpSessions: todayEntry.pumpSessions,
                discomfortLevel: todayEntry.discomfortLevel ?? 0,
                moodLevel: todayEntry.moodLevel ?? 3,
                stressLevel: todayEntry.stressLevel ?? 2,
                sleepHours: todayEntry.sleepHours ?? 0,
                sleepQuality: todayEntry.sleepQuality ?? 0,
                notes: todayEntry.notes ?? ""
            } : null} />

            {/* Recent Entries */}
            {recentEntries.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl font-bold mb-4">Recent Logs</h2>
                    <div className="space-y-3">
                        {recentEntries.slice(0, 5).map(entry => (
                            <div key={entry.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{format(entry.createdAt, "EEEE, MMM d")}</p>
                                    <p className="text-sm text-gray-500">
                                        {entry.feedsCount} feeds • Mood {entry.moodLevel ?? 3}/5
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs ${(entry.discomfortLevel ?? 0) > 3
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                        }`}>
                                        {(entry.discomfortLevel ?? 0) > 3 ? "High discomfort" : "Low discomfort"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
