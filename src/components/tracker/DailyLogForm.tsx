"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Thermometer, Brain, Activity } from "lucide-react"
import { BubbleSelector } from "./BubbleSelector"
import { BodyMap } from "./BodyMap"
import { CounterInput } from "./CounterInput"
import { SliderInput } from "./SliderInput"

interface Props {
    existingEntry?: any
}

export function DailyLogForm({ existingEntry }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    // --- STATE ---
    const [formData, setFormData] = useState({
        // Logistics
        nursingSessions: existingEntry?.nursingSessions ?? 0,
        maxMilkGap: existingEntry?.maxMilkGap ?? 0,
        milkVolume: existingEntry?.milkVolume ?? "FULL", // Default to something if needed or null

        // Physiology
        bodyTemperature: existingEntry?.bodyTemperature ?? null,
        physicalSymptoms: existingEntry?.physicalSymptoms ?? [],
        breastHeatmap: existingEntry?.breastHeatmap ?? { left: [], right: [] },
        painLevel: existingEntry?.painLevel ?? 0,

        // Mood
        moodSignals: existingEntry?.moodSignals ?? [],
        irritabilityScore: existingEntry?.irritabilityScore ?? 1,

        // Interventions
        interventions: existingEntry?.interventions ?? [],

        // Legacy/Extras
        sleepHours: existingEntry?.sleepHours ?? 0,
        notes: existingEntry?.notes ?? ""
    })

    const handleSubmit = async () => {
        // Validation: Warn if nothing logged?
        if (formData.nursingSessions === 0 && formData.physicalSymptoms.length === 0 && formData.moodSignals.length === 0) {
            if (!confirm("Start your log with 0 tracks?")) return;
        }

        setLoading(true)
        try {
            const res = await fetch("/api/tracker/entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    // Map legacy fields for backend happiness if needed
                    feedsCount: formData.nursingSessions,
                    discomfortLevel: Math.ceil(formData.painLevel / 2)
                })
            })

            if (res.ok) {
                setSaved(true)
                router.refresh()
                router.push("/dashboard/history")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-12 animate-fade-in max-w-lg mx-auto pb-24">
            {saved && (
                <div className="p-4 bg-[var(--color-brand-mist)] border border-[var(--color-brand-gold)] rounded-xl flex items-center gap-3">
                    <span className="text-2xl">🌿</span>
                    <div>
                        <p className="font-semibold text-gray-800">Log Saved.</p>
                        <p className="text-sm text-gray-600">Observation recorded.</p>
                    </div>
                </div>
            )}

            {/* 1. PHYSIOLOGY (Body Map) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-[var(--color-brand-rose)]" />
                    <h3 className="text-lg font-serif font-bold text-gray-800">Physiology Map</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <BodyMap
                        value={formData.breastHeatmap}
                        onChange={v => setFormData({ ...formData, breastHeatmap: v })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">Temp (°F)</label>
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                step="0.1"
                                placeholder="98.6"
                                className="bg-transparent text-xl font-bold w-full outline-none"
                                value={formData.bodyTemperature || ""}
                                onChange={e => setFormData({ ...formData, bodyTemperature: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Observations (Tap all that apply)</label>
                    <BubbleSelector
                        options={["Redness", "Hot to Touch", "Wedge Hardness", "Body Aches", "Chills", "Flu-like"]}
                        value={formData.physicalSymptoms}
                        onChange={v => setFormData({ ...formData, physicalSymptoms: v })}
                    />
                </div>

                <SliderInput
                    label="Pressure / Pain Level"
                    value={formData.painLevel}
                    onChange={v => setFormData({ ...formData, painLevel: v })}
                    labels={["None (0)", "Severe (10)"]}
                    max={10}
                />
            </section>

            <hr className="border-gray-100" />

            {/* 2. THE DESCENT (Logistics) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[var(--color-brand-sage)]" />
                    <h3 className="text-lg font-serif font-bold text-gray-800">The Descent</h3>
                </div>

                <CounterInput
                    label="Removal Sessions (Last 24h)"
                    value={formData.nursingSessions}
                    onChange={v => setFormData({ ...formData, nursingSessions: v })}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Milk Volume</label>
                    <BubbleSelector
                        multiSelect={false}
                        options={["FULL", "HALF", "MINIMAL"]}
                        value={formData.milkVolume ? [formData.milkVolume] : []}
                        onChange={v => setFormData({ ...formData, milkVolume: v[0] || "FULL" })}
                    />
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* 3. HEADSPACE (Mood) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    <h3 className="text-lg font-serif font-bold text-gray-800">Headspace</h3>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Signals</label>
                    <BubbleSelector
                        options={["Crying Bouts", "Brain Fog", "Night Sweats", "Hot Flashes", "Anxiety", "Insomnia"]}
                        value={formData.moodSignals}
                        onChange={v => setFormData({ ...formData, moodSignals: v })}
                    />
                </div>

                <SliderInput
                    label="Irritability (1-5)"
                    value={formData.irritabilityScore}
                    onChange={v => setFormData({ ...formData, irritabilityScore: v })}
                    labels={["Zen", "On Edge"]}
                    max={5}
                />
            </section>

            <hr className="border-gray-100" />

            {/* 4. INTERVENTIONS */}
            <section className="space-y-6">
                <h3 className="text-lg font-serif font-bold text-gray-800">Interventions Used</h3>
                <BubbleSelector
                    options={["Cabbage Leaves", "Ice Packs", "Sage Tea", "Peppermint Oil", "Sudafed", "Ibuprofen"]}
                    value={formData.interventions}
                    onChange={v => setFormData({ ...formData, interventions: v })}
                />
            </section>

            {/* NOTES */}
            <textarea
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[var(--color-brand-gold)] outline-none min-h-[100px]"
                placeholder="Any other notes from the journey today?"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[var(--color-brand-primary)] text-[var(--color-brand-cream)] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
                {loading ? "Recording Observation..." : "Log Observation"}
            </button>
        </div>
    )
}
