import { OnboardingData } from "../OnboardingWizard"

interface Props {
    data: OnboardingData
    updateData: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onBack: () => void
}

const SYMPTOMS = [
    "Fever", "Chills", "Redness", "Hard lumps", "Anxiety", "Sadness", "Extreme fatigue"
]

export function RiskBaselineStep({ data, updateData, onNext, onBack }: Props) {
    const toggleSymptom = (symptom: string) => {
        const current = data.currentSymptoms
        if (current.includes(symptom)) {
            updateData({ currentSymptoms: current.filter(s => s !== symptom) })
        } else {
            updateData({ currentSymptoms: [...current, symptom] })
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Establish your baseline</h2>
                <p className="text-gray-500">We&apos;ll monitor these levels to keep you safe.</p>
            </div>

            <div className="space-y-6">
                {/* Mood Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium">Emotional State (1-5)</label>
                        <span className="text-sm text-[var(--color-brand-rose)] font-bold">{data.initialMood}/5</span>
                    </div>
                    <input
                        type="range" min="1" max="5"
                        value={data.initialMood}
                        onChange={(e) => updateData({ initialMood: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-rose)]"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Struggling</span>
                        <span>Thriving</span>
                    </div>
                </div>

                {/* Symptoms */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Current Symptoms (Select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                        {SYMPTOMS.map(symptom => (
                            <button
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${data.currentSymptoms.includes(symptom)
                                    ? 'bg-[var(--foreground)] text-white border-[var(--foreground)]'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={onBack} className="flex-1 px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 px-6 py-3 bg-[var(--foreground)] text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}
