"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface ConsentCheckboxProps {
    onConsentChange: (accepted: boolean) => void
}

export function ConsentCheckbox({ onConsentChange }: ConsentCheckboxProps) {
    const [medicalConfirmed, setMedicalConfirmed] = useState(false)
    const [termsConfirmed, setTermsConfirmed] = useState(false)
    const [privacyConfirmed, setPrivacyConfirmed] = useState(false)

    useEffect(() => {
        // Only trigger 'accepted' if ALL three are checked
        if (medicalConfirmed && termsConfirmed && privacyConfirmed) {
            onConsentChange(true)
        } else {
            onConsentChange(false)
        }
    }, [medicalConfirmed, termsConfirmed, privacyConfirmed, onConsentChange])

    return (
        <div className="space-y-3 bg-[var(--color-brand-mist)]/50 dark:bg-gray-50 p-4 rounded-lg border border-[var(--color-brand-sage)]/30 mt-4">
            {/* 1. Medical Disclaimer Check */}
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="consent-medical"
                    checked={medicalConfirmed}
                    onChange={(e) => setMedicalConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-brand-rose)] focus:ring-[var(--color-brand-rose)]"
                />
                <label htmlFor="consent-medical" className="text-sm text-gray-700 leading-tight">
                    I understand that Vicessa is <strong>not medical advice</strong> and is for informational purposes only.
                </label>
            </div>

            {/* 2. Terms of Service Check */}
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="consent-terms"
                    checked={termsConfirmed}
                    onChange={(e) => setTermsConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-brand-rose)] focus:ring-[var(--color-brand-rose)]"
                />
                <label htmlFor="consent-terms" className="text-sm text-gray-700 leading-tight">
                    I agree to the <Link href="/legal/terms" target="_blank" className="font-bold underline text-[var(--color-brand-rose)] hover:text-[var(--color-brand-rose)]/80">Terms of Service</Link>.
                </label>
            </div>

            {/* 3. Privacy Policy Check */}
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="consent-privacy"
                    checked={privacyConfirmed}
                    onChange={(e) => setPrivacyConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-brand-rose)] focus:ring-[var(--color-brand-rose)]"
                />
                <label htmlFor="consent-privacy" className="text-sm text-gray-700 leading-tight">
                    I agree to the <Link href="/legal/privacy" target="_blank" className="font-bold underline text-[var(--color-brand-rose)]">Privacy Policy</Link> and data processing terms.
                </label>
            </div>
        </div>
    )
}
