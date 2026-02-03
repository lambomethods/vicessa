"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

interface ConsentCheckboxProps {
    onConsentChange: (accepted: boolean, aiConsent: boolean) => void
}

export function ConsentCheckbox({ onConsentChange }: ConsentCheckboxProps) {
    const [medicalConfirmed, setMedicalConfirmed] = useState(false)
    const [termsConfirmed, setTermsConfirmed] = useState(false)
    const [privacyConfirmed, setPrivacyConfirmed] = useState(false)
    const [aiConsentConfirmed, setAiConsentConfirmed] = useState(false)

    useEffect(() => {
        // Only trigger 'accepted' if ALL three mandatory ones are checked
        const isValid = medicalConfirmed && termsConfirmed && privacyConfirmed
        onConsentChange(isValid, aiConsentConfirmed)
    }, [medicalConfirmed, termsConfirmed, privacyConfirmed, aiConsentConfirmed, onConsentChange])

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

            <div className="my-2 border-t border-gray-200/50 w-full" />

            {/* 4. AI Training Consent (Optional) */}
            <div className="flex items-start space-x-3 p-2 bg-white/50 rounded-md border border-gray-100">
                <input
                    type="checkbox"
                    id="consent-ai"
                    checked={aiConsentConfirmed}
                    onChange={(e) => setAiConsentConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-brand-eucalyptus)] focus:ring-[var(--color-brand-eucalyptus)]"
                />
                <label htmlFor="consent-ai" className="text-sm text-gray-600 leading-tight">
                    <span className="flex items-center gap-1 font-bold text-[var(--color-brand-eucalyptus)] text-xs mb-1">
                        <Sparkles className="w-3 h-3" /> OPTIONAL: Help us learn
                    </span>
                    I allow my anonymized patterns to satisfy my curiosity and improve Vicessa's accuracy and insights.
                </label>
            </div>
        </div>
    )
}
