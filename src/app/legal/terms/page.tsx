export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-3xl p-8 space-y-8 text-gray-800">
            <h1 className="text-3xl font-bold font-serif text-[var(--foreground)]">Vicessa Terms of Service</h1>
            <p className="text-gray-500">Effective Date: January 22, 2026</p>

            {/* MASTER POSITIONING STATEMENT */}
            <div className="bg-[var(--color-brand-mist)] border text-sm p-4 rounded-lg italic">
                Vicessa is a digital wellness and tracking platform designed to help users monitor personal lactation and weaning-related data. Vicessa does not provide medical diagnosis, treatment, or clinical advice and is not a substitute for professional healthcare consultation.
            </div>

            {/* MEDICAL DISCLAIMER */}
            <section className="space-y-4 border-l-4 border-red-200 pl-4 py-2">
                <h2 className="text-red-700 font-bold uppercase tracking-wider text-sm">CRITICAL MEDICAL DISCLAIMER</h2>
                <div className="space-y-4 text-gray-700">
                    <p><strong>Vicessa is not a medical device, healthcare provider, or medical professional.</strong></p>
                    <p>The information provided through the Vicessa platform is for informational and educational purposes only and should not be interpreted as medical advice.</p>
                    <p>Users must consult a licensed healthcare provider before making any medical decisions related to lactation, weaning, hormonal health, or infant nutrition.</p>
                    <p>Vicessa does not guarantee accuracy, completeness, or outcomes based on platform usage.</p>
                    <p><strong>Users assume full responsibility for decisions made based on information provided through the platform.</strong></p>
                </div>
            </section>

            <hr className="border-gray-200" />

            {/* TERMS SECTIONS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">1. Eligibility & Use</h2>
                <p>Users must be at least 18 years old to use Vicessa. Vicessa is intended for personal wellness tracking only.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">2. No Medical Relationship</h2>
                <p>Use of Vicessa does not create a doctor-patient relationship communication. Any insights, signals, or content provided are automated data visualizations, not clinical guidance.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">3. User Responsibility</h2>
                <p>Users are solely responsible for interpreting and using information provided by the platform. You agree to use professional judgment and consult medical professionals for any health concerns.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">4. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, Vicessa shall not be liable for any indirect, incidental, consequential, or punitive damages arising from platform use, including but not limited to health outcomes or data loss.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">5. Liability Cap</h2>
                <p>Vicessa’s total liability shall not exceed the amount paid by the user for platform access within the last twelve months.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">6. Community Content</h2>
                <p>Vicessa is not responsible for content posted by users in community spaces. Community posts reflect personal experiences and not medical advice.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">7. Monetization & Refunds</h2>
                <p>Payments for &quot;Journey Passes&quot; or Subscriptions are non-refundable except where required by law. Free tier access is provided &quot;as-is&quot;.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">8. Arbitration & Governing Law</h2>
                <p>Any disputes shall be resolved through binding arbitration under the laws of the State of Delaware.</p>
            </section>
        </div>
    )
}
