"use client"

import { format } from "date-fns"
import { useState, useMemo } from "react"

interface Entry {
    id: string
    date: string
    feedsCount: number
    discomfortLevel: number | null
    moodLevel: number | null
    notes: string | null
}

interface Props {
    entries: Entry[]
}

type FilterType = "ALL" | "PAIN" | "MOOD" | "NOTES"

export function TimelineView({ entries }: Props) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<FilterType>("ALL")

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            // 1. Text Search (Notes)
            if (searchTerm && !entry.notes?.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            // 2. Category Filter
            if (filter === "PAIN") return (entry.discomfortLevel || 0) >= 3
            if (filter === "MOOD") return (entry.moodLevel || 5) <= 2
            if (filter === "NOTES") return !!entry.notes

            return true
        })
    }, [entries, searchTerm, filter])

    if (entries.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No entries yet.</p>
                <p className="text-sm">Start tracking to see your timeline.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Search & Filter Controls */}
            <div className="space-y-3 bg-[var(--color-brand-mist)]/50 p-4 rounded-xl border border-[var(--color-brand-sage-light)]">
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-brand-sage)]/30 focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-sm"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                {/* Filter Badges */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {(["ALL", "PAIN", "MOOD", "NOTES"] as FilterType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap
                                ${filter === type
                                    ? "bg-[var(--color-brand-rose)] text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {type === "ALL" && "All Entries"}
                            {type === "PAIN" && "High Discomfort"}
                            {type === "MOOD" && "Low Mood"}
                            {type === "NOTES" && "Has Notes"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="text-xs text-gray-400 font-medium px-1">
                Showing {filteredEntries.length} entries
            </div>

            {/* List */}
            {filteredEntries.length === 0 ? (
                <div className="text-center py-8 opacity-60 italic text-gray-500">
                    No entries match your search.
                </div>
            ) : (
                filteredEntries.map((entry) => (
                    <div key={entry.id} className="relative pl-6 border-l-2 border-[var(--color-brand-sage-light)] last:border-0 pb-6">
                        {/* Timestamp Dot */}
                        <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-[var(--color-brand-sage)] border-2 border-white shadow-sm" />

                        <div className="bg-white p-4 rounded-xl border border-[var(--color-brand-eucalyptus-light)] shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-[var(--color-brand-eucalyptus)]">
                                        {format(new Date(entry.date), "EEE, MMM d")}
                                    </h4>
                                    <p className="text-xs text-[var(--color-brand-sage)]">
                                        {format(new Date(entry.date), "h:mm a")}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-xs px-2 py-1 bg-[var(--color-brand-sage-light)] text-[var(--color-brand-eucalyptus)] rounded-full font-medium">
                                        🍼 {entry.feedsCount} feeds
                                    </span>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {entry.discomfortLevel !== null && (
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Discomfort</span>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-400 rounded-full"
                                                style={{ width: `${(entry.discomfortLevel / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {entry.moodLevel !== null && (
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Mood</span>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-400 rounded-full"
                                                style={{ width: `${(entry.moodLevel / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {entry.notes && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg italic mt-2">
                                    &quot;{entry.notes}&quot;
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
