import { OnboardingData } from "../OnboardingWizard"

interface Props {
    data: OnboardingData
    updateData: (data: Partial<OnboardingData>) => void
    onNext: () => void
}

export function ContextStep({ data, updateData, onNext }: Props) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Let&apos;s understand your journey</h2>
                <p className="text-gray-500">To help you safely, we need a bit of context.</p>
            </div>

            <div className="space-y-4">
                {/* Current Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Are you currently breastfeeding or pumping?</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => updateData({ isCurrentlyBreastfeeding: true })}
                            className={`flex-1 p-4 rounded-xl border-2 transition-all ${data.isCurrentlyBreastfeeding ? 'border-[var(--color-brand-rose)] bg-[var(--color-brand-rose-light)]/20' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => updateData({ isCurrentlyBreastfeeding: false })}
                            className={`flex-1 p-4 rounded-xl border-2 transition-all ${!data.isCurrentlyBreastfeeding ? 'border-[var(--color-brand-rose)] bg-[var(--color-brand-rose-light)]/20' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            No
                        </button>
                    </div>
                </div>

                {/* Feeding Frequency */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Average feeds/pumps per day</label>
                    <input
                        type="number"
                        min="0" max="20"
                        value={data.feedingFrequency || ""}
                        onChange={(e) => updateData({ feedingFrequency: parseInt(e.target.value) || 0 })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-brand-rose)] outline-none transition-colors"
                        placeholder="e.g. 6"
                    />
                </div>

                {/* Primary Goal */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">What is your primary goal?</label>
                    <select
                        value={data.primaryGoal || ""}
                        onChange={(e) => updateData({ primaryGoal: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-brand-rose)] outline-none bg-white"
                    >
                        <option value="">Select a goal...</option>
                        <option value="stop_fully">Stop fully (Wean off)</option>
                        <option value="reduce_feeds">Reduce number of feeds</option>
                        <option value="stop_pumping">Stop pumping only</option>
                        <option value="return_to_work">Prepare for return to work</option>
                        <option value="reduce_pain">Reduce pain / Manage mastitis</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!data.primaryGoal}
                className="w-full py-3 px-6 bg-[var(--foreground)] text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
            >
                Continue
            </button>
        </div>
    )
}
