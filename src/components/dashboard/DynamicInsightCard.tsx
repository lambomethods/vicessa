import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { InsightSignal } from "@prisma/client"

interface DynamicInsightCardProps {
    insight?: InsightSignal | null
}

export function DynamicInsightCard({ insight }: DynamicInsightCardProps) {
    if (!insight) {
        return (
            <Card className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border-none">
                <CardHeader>
                    <CardTitle className="text-gray-500 opacity-90">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-2">Calibrating...</div>
                    <p className="opacity-80 text-sm">Log more entries to unlock personalized insights.</p>
                </CardContent>
            </Card>
        )
    }

    // STAGE 0: NEUTRAL COLORS ONLY (No "Danger" Red)
    // We strictly avoid "Alarmist" visuals.
    const bgClass = "bg-gradient-to-br from-indigo-500 to-slate-600" // Neutral, professional, calm.

    return (
        <Card className={`${bgClass} text-white border-none transition-all duration-500 animate-in fade-in zoom-in-95`}>
            <CardHeader>
                <CardTitle className="text-white opacity-90 capitalize flex items-center gap-2">
                    {/* Neutralize the title */}
                    {insight.signalType === 'danger_alert' ? 'Health Notice' : insight.signalType.replace('_', ' ')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold mb-2 leading-tight">
                    {/* Shadow Mode: Soften the blow. */}
                    {insight.severity === 'high'
                        ? "Please consult a healthcare professional regarding your recent symptoms."
                        : insight.message}
                </div>
                {insight.congestionIndicator && (
                    <p className="opacity-90 text-sm mt-2 border-t border-white/20 pt-2">
                        {insight.congestionIndicator}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
