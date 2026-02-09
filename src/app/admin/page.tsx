import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

// Helper to anonymize ID (simple hash visual)
const anonymize = (id: string) => "usr_" + id.slice(-8)

export default async function AdminPage() {
    const session = await auth()
    // In a real app, check for ADMIN_EMAIL env var. 
    // For now, we allow logged-in users (Founder Mode) but hide the link.
    if (!session?.user) redirect("/login")

    // Fetch Stats
    const totalEntries = await prisma.trackerEntry.count()
    const totalUsers = await prisma.user.count()

    // Fetch Recent Stream
    const recentEntries = await prisma.trackerEntry.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
            id: true,
            userId: true,
            createdAt: true,
            physicalSymptoms: true,
            moodSignals: true,
            bodyTemperature: true,
            nursingSessions: true,
            milkVolume: true
        }
    })

    // Calc "Signals Havested" (Total items in arrays)
    // This is approximate for the view, real query would be aggregate.
    const signal count = recentEntries.reduce((acc, curr) =>
        acc + (curr.physicalSymptoms?.length || 0) + (curr.moodSignals?.length || 0), 0)

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-mono">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <h1 className="font-bold text-lg tracking-tight">VICESSA ENGINE ROOM</h1>
                </div>
                <div className="text-xs text-gray-500">
                    System Status: <span className="text-green-600 font-bold">OPERATIONAL</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">

                {/* 1. KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Data Points</div>
                        <div className="text-3xl font-bold">{totalEntries.toLocaleString()}</div>
                        <div className="text-xs text-green-600 mt-2">▲ accumulating</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Nodes (Users)</div>
                        <div className="text-3xl font-bold">{totalUsers.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 mt-2">Anonymized Identities</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Signal Velocity</div>
                        <div className="text-3xl font-bold">{(signal count / 50).toFixed(1)}</div>
                        <div className="text-xs text-gray-400 mt-2">Avg signals / entry (Last 50)</div>
                    </div>
                </div>

                {/* 2. The Stream */}
                <div className="bg-black text-green-400 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase">Incoming Data Stream (Live)</span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                    </div>

                    <div className="h-[500px] overflow-y-auto p-4 font-mono text-xs space-y-1">
                        <div className="grid grid-cols-12 gap-4 text-gray-500 border-b border-white/10 pb-2 mb-2 font-bold uppercase">
                            <div className="col-span-2">Time</div>
                            <div className="col-span-2">Anonymized ID</div>
                            <div className="col-span-6">Payload (Signals Detected)</div>
                            <div className="col-span-2 text-right">Metrics</div>
                        </div>

                        {recentEntries.map((entry) => (
                            <div key={entry.id} className="grid grid-cols-12 gap-4 hover:bg-white/5 p-1 rounded transition-colors group">
                                <div className="col-span-2 opacity-60">
                                    {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
                                </div>
                                <div className="col-span-2 text-blue-400">
                                    {anonymize(entry.userId)}
                                </div>
                                <div className="col-span-6 break-words">
                                    {(entry.physicalSymptoms?.length > 0 || entry.moodSignals?.length > 0) ? (
                                        <div className="flex flex-wrap gap-1">
                                            {entry.physicalSymptoms?.map(s => (
                                                <span key={s} className="bg-red-900/40 text-red-200 px-1 rounded border border-red-900/50">{s}</span>
                                            ))}
                                            {entry.moodSignals?.map(s => (
                                                <span key={s} className="bg-purple-900/40 text-purple-200 px-1 rounded border border-purple-900/50">{s}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="opacity-30 italic">Logistics only</span>
                                    )}
                                </div>
                                <div className="col-span-2 text-right opacity-70 group-hover:opacity-100">
                                    {entry.bodyTemperature && <span className="mr-2">🌡️{entry.bodyTemperature}°</span>}
                                    {entry.milkVolume && <span>🍼{entry.milkVolume}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Export Action */}
                <div className="flex justify-end">
                    <button disabled className="bg-gray-200 text-gray-400 px-6 py-3 rounded-lg font-bold cursor-not-allowed flex items-center gap-2">
                        <span>⬇️ Download Training Dataset (CSV)</span>
                        <span className="text-xs bg-gray-300 px-2 py-0.5 rounded text-gray-500">COMING SOON</span>
                    </button>
                </div>

            </main>
        </div>
    )
}
