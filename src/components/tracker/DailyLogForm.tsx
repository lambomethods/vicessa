"use client"

import { useState } from "react"
import { SliderInput } from "./SliderInput"
import { CounterInput } from "./CounterInput"
import { useRouter } from "next/navigation"

interface ExistingEntry {
    feedsCount: number
    pumpSessions: number
    discomfortLevel: number
    moodLevel: number
    stressLevel: number
    notes: string
}

interface Props {
    existingEntry?: ExistingEntry | null
}

export function DailyLogForm({ existingEntry }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [formData, setFormData] = useState({
        feedsCount: existingEntry?.feedsCount ?? 0,
        pumpSessions: existingEntry?.pumpSessions ?? 0,
        discomfortLevel: existingEntry?.discomfortLevel ?? 0,
        moodLevel: existingEntry?.moodLevel ?? 3,
        stressLevel: existingEntry?.stressLevel ?? 2,
        notes: existingEntry?.notes ?? ""
    })

    const handleSubmit = async () => {
        setLoading(true)
        setSaved(false)
        try {
            const res = await fetch("/api/tracker/entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setSaved(true)
                router.refresh()
                // Scroll to top to see success
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-lg mx-auto pb-24">
            {saved && (
                <div className="p-4 bg-green-100 border border-green-300 rounded-xl flex items-center gap-3 animate-pulse">
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="font-semibold text-green-800">Log Saved Successfully!</p>
                        <p className="text-sm text-green-600">Your daily entry has been recorded.</p>
                    </div>
                </div>
            )}

            {existingEntry && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-700">
                        📝 You already have an entry for today. Submitting will create a new entry.
                    </p>
                </div>
            )}

            {/* Lactation Activity */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-xl">🍼</span> Activity
                </h3>
                <CounterInput
                    label="Feeds Today"
                    value={formData.feedsCount}
                    onChange={v => setFormData({ ...formData, feedsCount: v })}
                />
                <CounterInput
                    label="Pump Sessions"
                    value={formData.pumpSessions}
                    onChange={v => setFormData({ ...formData, pumpSessions: v })}
                />
            </section>

            {/* Physical */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-xl">💢</span> Physical Symptoms
                </h3>
                <SliderInput
                    label="Breast Discomfort"
                    value={formData.discomfortLevel}
                    onChange={v => setFormData({ ...formData, discomfortLevel: v })}
                    labels={["None", "Severe"]}
                />
            </section>

            {/* Emotional */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-xl">🧠</span> Emotional State
                </h3>
                <SliderInput
                    label="Mood"
                    value={formData.moodLevel}
                    onChange={v => setFormData({ ...formData, moodLevel: v })}
                    labels={["Low", "Great"]}
                />
                <SliderInput
                    label="Stress Level"
                    value={formData.stressLevel}
                    onChange={v => setFormData({ ...formData, stressLevel: v })}
                    labels={["Calm", "Overwhelmed"]}
                />
            </section>

            {/* Notes */}
            <section className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-[var(--color-brand-rose)] outline-none min-h-[100px]"
                    placeholder="Any specific triggers or feelings today?"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
            </section>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[var(--foreground)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
                {loading ? "Saving..." : existingEntry ? "Update Log" : "Save Daily Log"}
            </button>
        </div>
    )
}
