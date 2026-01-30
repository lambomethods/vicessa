import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/brand/Logo"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen bg-[var(--background)]">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 border-r border-gray-200 dark:border-gray-800 lg:block flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                        <Logo className="w-8 h-8" />
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-3">
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--foreground)] font-medium transition-all bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                        <span className="font-medium">Overview</span>
                    </Link>
                    <Link href="/dashboard/tracking" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--foreground)] font-medium transition-all bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                        <span className="font-medium">Tracker</span>
                    </Link>
                    <Link href="/dashboard/history" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--foreground)] font-medium transition-all bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                        <span className="font-medium">History</span>
                    </Link>
                    <Link href="/community" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--foreground)] font-medium transition-all bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                        <span className="font-medium">Community</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-200/50">
                        <Link href="/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--foreground)] font-medium transition-all bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                            <span className="font-medium">Settings</span>
                        </Link>
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-brand-rose-light)]" />
                        <div className="text-sm">
                            <p className="font-medium">{session.user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate w-32">{session.user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden h-14 border-b flex items-center px-4 bg-white/80 backdrop-blur sticky top-0 z-30">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Logo className="w-6 h-6" />
                    </Link>
                </div>
                <div className="container mx-auto p-4 md:p-8 max-w-5xl animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    )
}
