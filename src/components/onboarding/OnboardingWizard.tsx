"use client"

import { useState } from "react"
import { ContextStep } from "./steps/ContextStep"
import { RiskBaselineStep } from "./steps/RiskBaselineStep"
import { PlanGenerationStep } from "./steps/PlanGenerationStep"
import { useRouter } from "next/navigation"

export type OnboardingData = {
    // Context
    isCurrentlyBreastfeeding: boolean
    feedingFrequency?: number
    lastFeedTime?: string
    goalTimeline?: string
    primaryGoal?: string

    // Risk
    initialMood: number
    initialPainLevel: number
    hasMastitisHistory: boolean
    currentSymptoms: string[]
}

const INITIAL_DATA: OnboardingData = {
    isCurrentlyBreastfeeding: true,
    initialMood: 3,
    initialPainLevel: 1,
    hasMastitisHistory: false,
    currentSymptoms: []
}

export function OnboardingWizard() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [data, setData] = useState<OnboardingData>(INITIAL_DATA)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const updateData = (newData: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...newData }))
    }

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) throw new Error("Failed to save onboarding data")

            // Move to generation step
            setStep(4)

            // Simulate "AI Generation" delay for UX
            setTimeout(() => {
                router.push("/dashboard?onboarding=complete")
            }, 3000)

        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto w-full">
            {/* Progress Bar */}
            <div className="mb-8 flex gap-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-[var(--color-brand-rose)]" : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 min-h-[400px]">
                {step === 1 && (
                    <ContextStep
                        data={data}
                        updateData={updateData}
                        onNext={handleNext}
                    />
                )}

                {step === 2 && (
                    <RiskBaselineStep
                        data={data}
                        updateData={updateData}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center">Ready to generate your plan?</h2>
                        <p className="text-center text-gray-600">
                            We&apos;ll analyze your inputs to create a personalized weaning pathway.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button onClick={handleBack} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 rounded-xl bg-[var(--color-brand-rose)] text-white hover:opacity-90 font-medium shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : "Generate My Plan"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && <PlanGenerationStep />}
            </div>
        </div>
    )
}
