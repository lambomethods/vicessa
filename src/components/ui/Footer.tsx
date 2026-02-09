import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-[var(--color-brand-mist)] border-t border-[var(--color-brand-sage)]/20 py-12 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-serif text-lg font-bold text-[var(--foreground)] mb-2">Vicessa</h3>
                        <p className="text-sm text-gray-600">Data-informed insights for lactation transitions.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[var(--foreground)] mb-2 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="mailto:support@vicessa.app" className="hover:text-[var(--color-brand-rose)]">Beta Support</a></li>
                            <li><a href="mailto:support@vicessa.app?subject=Feedback" className="hover:text-[var(--color-brand-rose)]">Help & Feedback</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[var(--foreground)] mb-2 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/legal/terms" className="hover:text-[var(--color-brand-rose)]">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-[var(--color-brand-rose)]">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-500 max-w-4xl mx-auto space-y-4">
                    <p>
                        © {new Date().getFullYear()} Vicessa. All rights reserved.
                    </p>
                    <p className="italic">
                        Vicessa is a digital pattern recognition platform designed to help users observe and organize personal lactation-related data.
                        Vicessa <strong>does not diagnose conditions, provide medical advice, or replace professional healthcare guidance</strong>.
                        Users should consult qualified healthcare professionals regarding medical concerns.
                    </p>
                </div>
            </div>
        </footer>
    )
}
