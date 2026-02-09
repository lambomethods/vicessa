"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface BodyMapProps {
    value?: {
        left: string[]
        right: string[]
    }
    onChange: (value: { left: string[]; right: string[] }) => void
}

type Quadrant = "upper-outer" | "upper-inner" | "lower-outer" | "lower-inner"

export function BodyMap({ value = { left: [], right: [] }, onChange }: BodyMapProps) {
    const handleToggle = (side: "left" | "right", quadrant: Quadrant) => {
        const current = value[side]
        const exists = current.includes(quadrant)

        const updatedSide = exists
            ? current.filter(q => q !== quadrant)
            : [...current, quadrant]

        onChange({
            ...value,
            [side]: updatedSide
        })
    }

    const isSelected = (side: "left" | "right", quadrant: Quadrant) => value[side].includes(quadrant)

    // Interactive Quadrant Path Component
    const QuadrantPath = ({
        d,
        side,
        quadrant,
        className
    }: {
        d: string
        side: "left" | "right"
        quadrant: Quadrant
        className?: string
        transform?: string
    }) => (
        <path
            d={d}
            transform={transform}
            onClick={() => handleToggle(side, quadrant)}
            className={cn(
                "cursor-pointer transition-all duration-200 hover:opacity-80",
                isSelected(side, quadrant)
                    ? "fill-[var(--color-brand-primary)] stroke-[var(--color-brand-primary)] opacity-60"
                    : "fill-transparent stroke-[var(--color-brand-gold)] opacity-40 hover:opacity-100",
                className
            )}
            strokeWidth="2"
        />
    )

    return (
        <div className="flex flex-col items-center space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">Tap areas of discomfort</h3>
            <div className="relative w-64 h-32">
                <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-sm">
                    {/* RIGHT BREAST (User's Left) */}
                    <g transform="translate(70, 75)">
                        {/* Upper Outer (Top Left from viewer) */}
                        <QuadrantPath d="M -50,-50 A 50,50 0 0,1 0,0 L 0,-50 Z" side="right" quadrant="upper-outer" transform="rotate(-90)" />
                        {/* Wait, simple arcs are better. Let's precise paths. */}

                        {/* Circle split into 4. Center at 0,0. Radius 50. */}
                        {/* Upper Inner (Top-Left relative to breast center?) No, standard medial/lateral. */}
                        {/* Right Breast: Inner is Left (towards sternum), Outer is Right. */}

                        {/* Right Breast (on left of screen) */}
                        {/* Upper Inner (Towards Center) */}
                        <path
                            d="M 0,0 L 0,-48 A 48,48 0 0,1 48,0 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("right", "upper-inner") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("right", "upper-inner")}
                        />
                        {/* Lower Inner */}
                        <path
                            d="M 0,0 L 48,0 A 48,48 0 0,1 0,48 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("right", "lower-inner") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("right", "lower-inner")}
                        />
                        {/* Lower Outer (Towards Arm) */}
                        <path
                            d="M 0,0 L 0,48 A 48,48 0 0,1 -48,0 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("right", "lower-outer") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("right", "lower-outer")}
                        />
                        {/* Upper Outer */}
                        <path
                            d="M 0,0 L -48,0 A 48,48 0 0,1 0,-48 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("right", "upper-outer") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("right", "upper-outer")}
                        />
                        <text y="65" x="0" textAnchor="middle" className="text-[10px] fill-gray-400 font-sans">RIGHT</text>
                    </g>

                    {/* LEFT BREAST (User's Right) */}
                    <g transform="translate(230, 75)">
                        {/* Mirror image */}
                        {/* Upper Inner (Towards Center - so stick to left side of this breast) */}
                        <path
                            d="M 0,0 L 0,-48 A 48,48 0 0,0 -48,0 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("left", "upper-inner") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("left", "upper-inner")}
                        />
                        {/* Lower Inner */}
                        <path
                            d="M 0,0 L -48,0 A 48,48 0 0,0 0,48 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("left", "lower-inner") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("left", "lower-inner")}
                        />
                        {/* Lower Outer */}
                        <path
                            d="M 0,0 L 0,48 A 48,48 0 0,0 48,0 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("left", "lower-outer") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("left", "lower-outer")}
                        />
                        {/* Upper Outer */}
                        <path
                            d="M 0,0 L 48,0 A 48,48 0 0,0 0,-48 Z"
                            className={cn("cursor-pointer transition-colors", isSelected("left", "upper-outer") ? "fill-[#d4af37]" : "fill-white hover:fill-gray-50", "stroke-[#d4af37] stroke-1")}
                            onClick={() => handleToggle("left", "upper-outer")}
                        />
                        <text y="65" x="0" textAnchor="middle" className="text-[10px] fill-gray-400 font-sans">LEFT</text>
                    </g>
                </svg>
            </div>
            <p className="text-xs text-center text-gray-400 italic">View as looking in mirror</p>
        </div>
    )
}
