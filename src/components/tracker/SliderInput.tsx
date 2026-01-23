"use client"

interface Props {
    label: string
    value: number
    onChange: (val: number) => void
    min?: number
    max?: number
    labels?: string[]
}

export function SliderInput({ label, value, onChange, min = 0, max = 5, labels }: Props) {
    return (
        <div className="space-y-3 bg-white/50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>
                <span className="text-sm font-bold text-[var(--color-brand-rose)]">{value}/{max}</span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-rose)]"
            />

            {labels && (
                <div className="flex justify-between text-xs text-gray-400">
                    {labels.map((l, i) => <span key={i}>{l}</span>)}
                </div>
            )}
        </div>
    )
}
