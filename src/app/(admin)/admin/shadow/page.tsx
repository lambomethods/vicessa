
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function ShadowDashboard() {
    const silentSignals = await prisma.insightSignal.findMany({
        where: {
            signalType: "SILENT_CORRELATION",
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Shadow View</h1>
                    <p className="text-gray-500">
                        Monitoring independent signal generation (Silent Mode).
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Stage 2 Validation
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-mono font-bold">{silentSignals.length}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Total Signals</p>
                </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Internal Message
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {silentSignals.map((signal) => (
                            <tr key={signal.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {format(new Date(signal.createdAt), "MMM d, HH:mm")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{signal.user?.name || "Anonymous"}</div>
                                    <div className="text-xs text-gray-400 font-mono">{signal.user?.id?.substring(0, 8) ?? "Unknown"}...</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {signal.message}
                                </td>
                            </tr>
                        ))}
                        {silentSignals.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                    No silent signals detected yet. (Waiting for input...)
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
