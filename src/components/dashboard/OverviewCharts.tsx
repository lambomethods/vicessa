"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts"

export function OverviewCharts() {
    const [data, setData] = useState<unknown[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/tracker?limit=14") // 2 weeks of data
            .then(res => res.json())
            .then(data => {
                // Reverse to show oldest to newest
                setData(data.reverse())
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />
    if (data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No data yet. Log your first day!</div>

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8FAF9A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8FAF9A" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C88A8A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C88A8A" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="createdAt"
                        tickFormatter={(str) => new Date(str).toLocaleDateString([], { day: 'numeric' })}
                        tick={{ fontSize: 12, fill: '#aaa' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    />
                    {/* Sage Green for Positive Metric (Mood) */}
                    <Area
                        type="monotone"
                        dataKey="moodLevel"
                        stroke="#8FAF9A"
                        fillOpacity={1}
                        fill="url(#colorMood)"
                        strokeWidth={2}
                        name="Mood (1-5)"
                    />
                    {/* Dusty Rose for Negative Metric (Discomfort) */}
                    <Area
                        type="monotone"
                        dataKey="discomfortLevel"
                        stroke="#C88A8A"
                        fillOpacity={1}
                        fill="url(#colorPain)"
                        strokeWidth={2}
                        name="Discomfort (1-5)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
