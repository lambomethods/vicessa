"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"

export function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)

    useEffect(() => {
        const hasAcknowledged = localStorage.getItem("medical-disclaimer-ack")
        // Delay check to avoid 'setState during render' issues in strict mode
        if (!hasAcknowledged) {
            const timer = setTimeout(() => setIsOpen(true), 100)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleConfirm = () => {
        localStorage.setItem("medical-disclaimer-ack", "true")
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6">
                <div className="space-y-2 border-l-4 border-red-500 pl-4">
                    <h2 className="text-xl font-bold text-red-700 uppercase tracking-wide">
                        Medical Disclaimer
                    </h2>
                    <p className="font-bold text-gray-900">
                        Vicessa is NOT a medical device.
                    </p>
                </div>

                <div className="text-sm text-gray-600 space-y-3">
                    <p>
                        The insights, charts, and content provided by this platform are for
                        <strong> informational purposes only</strong>.
                    </p>
                    <p>
                        We do not provide medical diagnosis, treatment, or clinical advice.
                        Always consult a healthcare professional for concerns regarding mastitis,
                        postpartum depression, or infant health.
                    </p>
                    <p>
                        If you believe you are having a medical emergency, call 911 or your doctor immediately.
                    </p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="ack"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label
                        htmlFor="ack"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I understand that Vicessa does not provide medical advice.
                    </label>
                </div>

                <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                    disabled={!acknowledged}
                    onClick={handleConfirm}
                >
                    I Agree & Continue
                </Button>
            </div>
        </div>
    )
}
