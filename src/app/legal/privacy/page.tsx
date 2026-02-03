export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-3xl p-8 space-y-8 text-gray-800">
            <h1 className="text-3xl font-bold font-serif text-[var(--foreground)]">Vicessa Privacy Policy</h1>
            <p className="text-gray-500">Effective Date: January 22, 2026</p>

            {/* MASTER POSITIONING STATEMENT */}
            <div className="bg-[var(--color-brand-mist)] border text-sm p-4 rounded-lg italic">
                Vicessa is a digital wellness and tracking platform designed to help users monitor personal lactation and weaning-related data. Vicessa does not provide medical diagnosis, treatment, or clinical advice.
            </div>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">1. Data We Collect</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Personal Information:</strong> Email address (for account management only).</li>
                        <li><strong>Personal Patterns:</strong> Mood, lactation logs, and weaning goals (anonymized/encrypted).</li>
                        <li><strong>Usage Data:</strong> Analytics, device information, and interaction logs.</li>
                    </ul>
                </ul>
                <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100 mt-4">
                    <p><strong>1.1 AI & Research Data (Optional):</strong> If you explicitly opt-in during registration or in settings, we may use your anonymized pattern data to improve the accuracy and insights of the Vicessa platform. You may withdraw this consent at any time, and your data will be excluded from future training sets.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">2. Sensitive Personal Data</h2>
                <p>Vicessa stores your tracking data (e.g., mood, weaning logs) securely using industry-standard encryption. <strong>This data is for personal self-tracking only and is not a medical record.</strong> We do not provide clinical data services or diagnosis.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">3. COPPA (Children’s Data Shield)</h2>
                <p><strong>Vicessa does not knowingly collect personal information from children under 13.</strong> Any child-related data entered (e.g., baby age) is provided by adult users for their own tracking purposes only.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">4. Your Data Rights</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Request deletion of your account and data.</li>
                    <li>Export your personal dataset.</li>
                    <li>Withdraw consent for optional data processing.</li>
                    <li>Opt out of marketing communications.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">5. Security Measures</h2>
                <p>Vicessa uses industry-standard encryption, authentication, and access controls to protect your data. However, no digital transmission is 100% secure.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold font-serif">6. Third-Party Services</h2>
                <p>We utilize the following trusted partners:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Resend / Firebase:</strong> Notifications and transactional emails.</li>
                    <li><strong>Vercel / AWS:</strong> Hosting and infrastructure.</li>
                </ul>
                <p className="text-sm mt-2 italic">Vicessa is not responsible for the privacy practices of these third-party services.</p>
            </section>
        </div>
    )
}
