"use client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Props {
    label: string
    value: number | null
    onChange: (val: number) => void
    min?: number
    max?: number
    labels?: string[]
}

export function SliderInput({ label, value, onChange, min = 0, max = 5, labels }: Props) {
    // If value is null, localValue is null
    // But input[type=range] needs a number. We'll feed it the *middle* or *min* but hide the thumb.
    const [localValue, setLocalValue] = useState<number | null>(value)

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(parseInt(e.target.value))
    }

    const handleCommit = () => {
        if (localValue !== value && localValue !== null) {
            onChange(localValue)
        }
    }

    // Determine what to show in the range input
    // If localValue is null, we show the middle (3) as a ghost, but hide the thumb
    const rangeValue = localValue ?? Math.ceil((min + max) / 2)

    return (
        <div className="space-y-3 bg-white/50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>
                <span className={cn(
                    "text-sm font-bold",
                    localValue === null ? "text-gray-400" : "text-[var(--color-brand-rose)]"
                )}>
                    {localValue !== null ? localValue : "?"}/{max}
                </span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                value={rangeValue}
                onChange={handleChange}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
                className={cn(
                    "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-rose)]",
                    // If unset, we apply a class or style to reduce opacity of the thumb? 
                    // Standard CSS accent-color affects thumb. 
                    // To truly hide thumb on unset is hard with just classes. 
                    // We'll trust the "?" text is clear enough, or we can use opacity.
                    localValue === null && "opacity-50 grayscale"
                )}
            />

            {labels && (
                <div className="flex justify-between text-xs text-gray-400">
                    {labels.map((l, i) => <span key={i}>{l}</span>)}
                </div>
            )}
        </div>
    )
}
