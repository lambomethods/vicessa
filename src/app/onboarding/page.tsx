import { auth } from "@/auth"
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-brand-rose-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-brand-sage-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="z-10 w-full">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Welcome to Vicessa</h1>
                    <p className="text-xl text-gray-500">Let&apos;s build your personalized weaning pathway.</p>
                </div>

                <OnboardingWizard />
            </div>
        </div>
    )
}
