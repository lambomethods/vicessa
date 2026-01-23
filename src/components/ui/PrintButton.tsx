"use client"

import { Button } from "@/components/ui/Button"

export function PrintButton() {
    return (
        <Button
            onClick={() => window.print()}
            className="bg-[var(--color-brand-rose)] text-white gap-2"
        >
            🖨️ Print Report
        </Button>
    )
}
