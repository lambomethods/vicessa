"use client"

import { useState } from "react"
import { SliderInput } from "./SliderInput"
import { CounterInput } from "./CounterInput"
import { useRouter } from "next/navigation"

export function DailyLogForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        feedsCount: 0,
        pumpSessions: 0,
        discomfortLevel: 0,
        moodLevel: 3,
        stressLevel: 2,
        notes: ""
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/tracker/entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.refresh()
                router.push("/dashboard?log=success")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-lg mx-auto pb-24">
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
                {loading ? "Saving..." : "Save Daily Log"}
            </button>
        </div>
    )
}
