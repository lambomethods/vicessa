"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { SliderInput } from "./SliderInput"
import { CounterInput } from "./CounterInput"
import { getLiveTip, Tip } from "@/lib/tips-engine"

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

    // Live AI Tip State
    const [activeTip, setActiveTip] = useState<Tip | null>(null)

    // Destructure for useEffect dependencies
    const { discomfortLevel, moodLevel, feedsCount } = formData;

    // Update tip when inputs change
    useEffect(() => {
        const tip = getLiveTip(discomfortLevel, moodLevel, feedsCount)
        setActiveTip(tip)
    }, [discomfortLevel, moodLevel, feedsCount])

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
                router.push("/dashboard/history")
            } else {
                console.error("Failed to save entry:", res.status, res.statusText);
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

            {/* Live AI Tip */}
            {activeTip && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-indigo-600 mt-1">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-indigo-900 uppercase tracking-wider mb-1">
                            Vicessa Insight
                        </h4>
                        <p className="text-indigo-800 text-sm leading-snug">
                            {activeTip.message}
                        </p>
                    </div>
                </div>
            )}

            {/* Notes */}
            <section className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                    className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-[var(--color-brand-rose)] outline-none min-h-[100px] bg-white"
                    placeholder="Any specific triggers or feelings today?"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
            </section>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[var(--color-brand-rose)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
                {loading ? "Saving..." : existingEntry ? "Update Log" : "Save Daily Log"}
            </button>
        </div>
    )
}
