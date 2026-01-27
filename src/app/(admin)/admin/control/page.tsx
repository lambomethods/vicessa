import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { SystemControl, SYSTEM_FLAGS } from "@/lib/system-control"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { revalidatePath } from "next/cache"

async function toggleFlag(key: string, currentValue: boolean) {
    "use server"
    const session = await auth()
    if (!session || session.user?.role !== "admin") return

    await SystemControl.setFlag(key, !currentValue, session.user.id!)
    revalidatePath("/admin/control")
}

export default async function AdminControlPage() {
    const session = await auth()
    // Simple role check (Ideally move to middleware or robust guard)
    if (!session || session.user?.role !== "admin") {
        return (
            <div className="p-8 text-center text-red-600">
                Unauthorized Access. Admin role required.
            </div>
        )
    }

    // Fetch Current Flags
    const aiEnabled = await SystemControl.getFlag(SYSTEM_FLAGS.AI_ENABLED)
    const commEnabled = await SystemControl.getFlag(SYSTEM_FLAGS.COMMUNITY_ENABLED)
    const safeMode = await SystemControl.getFlag(SYSTEM_FLAGS.SAFE_MODE)

    // Fetch Recent Logs
    const logs = await prisma.securityLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Vicessa Control Room 🕹️</h1>
                <div className="text-sm bg-gray-100 px-3 py-1 rounded">
                    Admin: {session.user.name}
                </div>
            </div>

            {/* SWITCHBOARD */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* SAFE MODE (NUCLEAR) */}
                <Card className={`border-2 ${safeMode ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            ☢️ Safe Mode
                            {safeMode && <span className="text-red-600 text-xs px-2 py-1 bg-red-100 rounded-full font-bold">ACTIVE</span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Disables ALL intelligence features and community interactions.
                            App becomes read-only logger.
                        </p>
                        <form action={toggleFlag.bind(null, SYSTEM_FLAGS.SAFE_MODE, safeMode)}>
                            <Button
                                type="submit"
                                className={`w-full font-bold ${safeMode ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {safeMode ? "DEACTIVATE SAFE MODE" : "ACTIVATE EMERGENCY SHUTDOWN"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* AI TOGGLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>🤖 AI Engine</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`p-2 rounded text-center font-bold ${aiEnabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {aiEnabled ? "ONLINE" : "OFFLINE"}
                        </div>
                        <form action={toggleFlag.bind(null, SYSTEM_FLAGS.AI_ENABLED, aiEnabled)}>
                            <Button type="submit" variant="outline" className="w-full">
                                {aiEnabled ? "Disable AI Insights" : "Enable AI Insights"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* COMMUNITY TOGGLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>💬 Community Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`p-2 rounded text-center font-bold ${commEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {commEnabled ? "LIVE" : "HIDDEN"}
                        </div>
                        <form action={toggleFlag.bind(null, SYSTEM_FLAGS.COMMUNITY_ENABLED, commEnabled)}>
                            <Button type="submit" variant="outline" className="w-full">
                                {commEnabled ? "Pause Community" : "Resume Community"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* SYSTEM LOGS */}
            <Card>
                <CardHeader>
                    <CardTitle>System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 overflow-y-auto bg-black text-green-400 p-4 rounded-lg font-mono text-xs space-y-1">
                        {logs.map(log => (
                            <div key={log.id} className="border-b border-green-900/30 pb-1">
                                <span className="opacity-50">[{log.createdAt.toISOString()}]</span>{" "}
                                <span className={`font-bold ${log.severity === 'error' ? 'text-red-400' : 'text-green-300'}`}>
                                    [{log.severity.toUpperCase()}]
                                </span>{" "}
                                {log.event}
                            </div>
                        ))}
                        {logs.length === 0 && <div className="opacity-50 text-center pt-10">No logs found. System quiet.</div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
