import React from 'react'

export const Logo = ({ className = "w-8 h-8", showText = true }: { className?: string, showText?: boolean }) => {
    return (
        <div className="flex items-center gap-2">
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                aria-label="Vicessa Logo"
            >
                {/* Abstract V / Transition Mark */}
                {/* Left stroke of V - Dusty Rose */}
                <path
                    d="M20 20 C 20 20, 45 80, 50 90"
                    stroke="var(--color-brand-rose)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-90"
                />
                {/* Right stroke of V - Sage/Gold Gradient Feel (using Sage stroke) */}
                <path
                    d="M80 20 C 80 20, 55 80, 50 90"
                    stroke="var(--color-brand-sage)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-90"
                />
                {/* Center Floating Element - Gold Accent (Balance/Data point) */}
                <circle cx="50" cy="35" r="5" fill="var(--color-brand-gold)" />
            </svg>
            {showText && (
                <span className="font-serif text-2xl font-bold tracking-wide text-[var(--foreground)]">
                    Vicessa
                </span>
            )}
        </div>
    )
}
