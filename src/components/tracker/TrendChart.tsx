"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from "date-fns"

interface Props {
    data: {
        date: string
        discomfort: number | null
        mood: number | null
    }[]
}

export function TrendChart({ data }: Props) {
    // Format data for chart
    const chartData = data
        .slice() // copy
        .reverse() // show oldest to newest left to right
        .map(d => ({
            ...d,
            dateStr: format(new Date(d.date), "MMM d")
        }))

    if (chartData.length < 2) {
        return (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100/50">
                <span className="text-sm text-gray-400">Log more days to see trends.</span>
            </div>
        )
    }

    return (
        <div className="h-64 w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Symptoms Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="dateStr"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={[0, 5]}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="discomfort"
                        stroke="var(--color-brand-rose)"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 0, fill: 'var(--color-brand-rose)' }}
                        activeDot={{ r: 6 }}
                        name="Discomfort"
                    />
                    <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="var(--color-brand-sage)"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 4, strokeWidth: 0, fill: 'var(--color-brand-sage)' }}
                        name="Mood"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
