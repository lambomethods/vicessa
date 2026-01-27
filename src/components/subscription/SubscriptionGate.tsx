import { auth } from "@/auth"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { prisma } from "@/lib/db"

interface SubscriptionGateProps {
    children: React.ReactNode
    fallbackTitle?: string
    fallbackDescription?: string
}

export async function SubscriptionGate({
    children,
    fallbackTitle = "Unlock Premium Insights",
    fallbackDescription = "Upgrade to Vicessa Plus to see detailed trends and AI analysis."
}: SubscriptionGateProps) {
    const session = await auth()

    let isPremium = false

    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { planType: true }
        })
        isPremium = user?.planType === "premium" || user?.planType === "family"
    }

    if (isPremium) {
        return <>{children}</>
    }

    return (
        <div className="relative overflow-hidden rounded-2xl group">
            {/* Blurred Content */}
            <div className="filter blur-md opacity-50 pointer-events-none select-none" aria-hidden="true">
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[var(--color-brand-mist)]/80 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[var(--color-brand-gold)] max-w-sm">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 font-serif">
                        {fallbackTitle}
                    </h3>
                    <p className="text-sm text-gray-700 mb-6">
                        {fallbackDescription}
                    </p>
                    <Link href="/marketplace" className="block w-full">
                        <Button className="w-full bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose)]/90 text-white font-bold shadow-lg">
                            Upgrade Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
