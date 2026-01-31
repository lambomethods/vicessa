"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Determine the current page title for the header
    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Overview"
        if (pathname?.includes("/tracking")) return "Tracker"
        if (pathname?.includes("/history")) return "History"
        if (pathname?.includes("/community")) return "Community"
        if (pathname?.includes("/settings")) return "Settings"
        if (pathname?.includes("/report")) return "Report"
        return "Dashboard"
    }

    const toggle = () => setIsOpen(!isOpen)

    return (
        <div className="flex-1 flex items-center justify-between">
            {/* Title */}
            <h1 className="text-lg font-bold text-[var(--foreground)] ml-2">{getPageTitle()}</h1>

            {/* Hamburger Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={toggle}
                className="lg:hidden text-[var(--foreground)]"
            >
                {isOpen ? (
                    // X Icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                ) : (
                    // Menu Icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                )}
            </Button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-14 bg-[var(--background)] z-50 p-6 animate-in slide-in-from-top-5 duration-200">
                    <nav className="flex flex-col space-y-4">
                        <Link href="/dashboard" onClick={toggle} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 text-lg font-medium hover:bg-gray-50 flex items-center justify-between">
                            Overview <span>→</span>
                        </Link>
                        <Link href="/dashboard/tracking" onClick={toggle} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 text-lg font-medium hover:bg-gray-50 flex items-center justify-between">
                            Tracker <span>→</span>
                        </Link>
                        <Link href="/dashboard/history" onClick={toggle} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 text-lg font-medium hover:bg-gray-50 flex items-center justify-between">
                            History <span>→</span>
                        </Link>
                        <Link href="/community" onClick={toggle} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 text-lg font-medium hover:bg-gray-50 flex items-center justify-between">
                            Community <span>→</span>
                        </Link>
                        <Link href="/settings" onClick={toggle} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 text-lg font-medium hover:bg-gray-50 flex items-center justify-between">
                            Settings <span>→</span>
                        </Link>
                    </nav>

                    <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
                        <p>Vicessa Mobile Beta</p>
                    </div>
                </div>
            )}
        </div>
    )
}
