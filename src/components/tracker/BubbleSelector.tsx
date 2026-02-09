"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BubbleSelectorProps {
    options: string[]
    value: string[]
    onChange: (value: string[]) => void
    multiSelect?: boolean
    label?: string
}

export function BubbleSelector({ options, value, onChange, multiSelect = true, label }: BubbleSelectorProps) {
    const handleToggle = (option: string) => {
        if (multiSelect) {
            if (value.includes(option)) {
                onChange(value.filter(v => v !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            // Single select toggle
            if (value.includes(option)) {
                onChange([])
            } else {
                onChange([option])
            }
        }
    }

    return (
        <div className="space-y-3">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isActive = value.includes(option)
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleToggle(option)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                isActive
                                    ? "bg-gray-800 text-white border-transparent shadow-md scale-105"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            )}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
