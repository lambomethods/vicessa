"use client"

interface Props {
    label: string
    value: number
    onChange: (val: number) => void
}

export function CounterInput({ label, value, onChange }: Props) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100">
            <span className="font-medium text-[var(--foreground)]">{label}</span>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    -
                </button>
                <span className="text-xl font-bold w-6 text-center">{value}</span>
                <button
                    onClick={() => onChange(value + 1)}
                    className="w-8 h-8 rounded-full bg-[var(--color-brand-rose)] text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-sm"
                >
                    +
                </button>
            </div>
        </div>
    )
}
