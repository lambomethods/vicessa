import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { PrintButton } from "@/components/ui/PrintButton"

export default async function DoctorReportPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            profile: true
        }
    })

    // Fetch last 30 days of data
    const entries = await prisma.trackerEntry.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: 30
    })

    // Calculate Summary Stats
    const totalFeeds = entries.reduce((acc, e) => acc + e.feedsCount, 0)
    const avgDiscomfort = entries.length > 0
        ? (entries.reduce((acc, e) => acc + (e.discomfortLevel || 0), 0) / entries.length).toFixed(1)
        : "N/A"
    const highRiskDays = entries.filter(e => (e.discomfortLevel || 0) >= 4).length

    return (
        <div className="min-h-screen bg-white text-black p-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
            {/* Print Control - Hidden when printing */}
            <div className="mb-8 flex justify-between items-center print:hidden border-b pb-4 border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-brand-eucalyptus)]">Clinical Report</h1>
                    <p className="text-gray-500">Preview mode. Click print to generate PDF.</p>
                </div>
                <PrintButton />
            </div>

            {/* REPORT HEADER */}
            <div className="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-1">Vicessa Clinical Snapshot</h1>
                    <p className="text-sm text-gray-600">Generated: {format(new Date(), "MMMM d, yyyy")}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">{user?.name || "Patient"}</p>
                    <p className="text-sm text-gray-600">Goal: {user?.profile?.primaryGoal || "N/A"}</p>
                </div>
            </div>

            {/* SUMMARY STATS */}
            <div className="grid grid-cols-3 gap-6 mb-8 text-center print:grid-cols-3">
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg print:border-black print:bg-white">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">30-Day Feeds</p>
                    <p className="text-2xl font-bold">{totalFeeds}</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg print:border-black print:bg-white">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Avg Discomfort (0-5)</p>
                    <p className="text-2xl font-bold">{avgDiscomfort}</p>
                </div>
                <div className={`p-4 border rounded-lg print:bg-white ${highRiskDays > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    <p className="text-xs uppercase tracking-wider mb-1 opacity-80">High Pain Days</p>
                    <p className="text-2xl font-bold">{highRiskDays}</p>
                </div>
            </div>

            {/* CLINICAL DATA TABLE */}
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="py-2 font-bold uppercase text-xs w-24">Date</th>
                        <th className="py-2 font-bold uppercase text-xs w-16">Feeds</th>
                        <th className="py-2 font-bold uppercase text-xs w-24">Pain (0-5)</th>
                        <th className="py-2 font-bold uppercase text-xs w-24">Mood (0-5)</th>
                        <th className="py-2 font-bold uppercase text-xs">Notes & Symptoms</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {entries.map(entry => {
                        const isHighRisk = (entry.discomfortLevel || 0) >= 4
                        return (
                            <tr key={entry.id} className={isHighRisk ? "bg-red-50 print:bg-gray-100" : ""}>
                                <td className="py-3 font-medium align-top">
                                    {format(new Date(entry.date), "MMM d, yyyy")}
                                    <div className="text-xs text-gray-400">{format(new Date(entry.date), "h:mm a")}</div>
                                </td>
                                <td className="py-3 align-top">{entry.feedsCount}</td>
                                <td className={`py-3 align-top font-bold ${isHighRisk ? 'text-red-600' : ''}`}>
                                    {entry.discomfortLevel ?? "-"}
                                </td>
                                <td className="py-3 align-top">
                                    {entry.moodLevel ?? "-"}
                                </td>
                                <td className="py-3 align-top italic text-gray-600">
                                    {entry.notes || "-"}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* FOOTER */}
            <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400 print:text-black">
                <p>Report generated by Vicessa Health Platform. Not a medical diagnosis.</p>
                <p>vicessa-health.com</p>
            </div>
        </div>
    )
}
