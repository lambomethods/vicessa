import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/brand/Logo"

export const metadata = {
    title: "About Vicessa | Data-Informed Lactation Transitions",
    description: "Vicessa is a platform for tracking personal signals and discovering patterns during lactation transitions.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
                <Link href="/">
                    <Logo className="w-8 h-8" showText={true} />
                </Link>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-[var(--foreground)] font-medium hover:bg-white/40">Log In</Button>
                    </Link>
                    <Link href="/register">
                        <Button className="rounded-full bg-[var(--foreground)] text-white hover:bg-[var(--foreground)]/90 shadow-lg">Get Started</Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 px-6 py-12 lg:py-24 max-w-4xl mx-auto space-y-24">

                {/* Mission */}
                <section className="text-center space-y-6 animate-fade-in">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[var(--foreground)]">
                        We focus on <span className="text-[var(--color-brand-rose)]">you</span>.
                    </h1>
                    <p className="text-xl text-[var(--foreground)]/80 max-w-2xl mx-auto leading-relaxed">
                        Most tools track the baby—feeds, diapers, weight.
                        Vicessa tracks the <strong className="text-[var(--foreground)]">physical and emotional journey</strong> of the mother.
                    </p>
                </section>

                {/* The Philosophy */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[var(--foreground)]">Why "Vicessa"?</h2>
                        <p className="text-[var(--foreground)]/70 text-lg leading-relaxed">
                            We built Vicessa because ending your journey is often treated as a binary switch—on or off.
                            In reality, it is a <strong className="text-[var(--foreground)]">deep personal change</strong>.
                        </p>
                        <p className="text-[var(--foreground)]/70 text-lg leading-relaxed">
                            Our platform uses pattern recognition to help you see the correlation between
                            a dropped feed, a <strong className="text-[var(--foreground)]">physical sensation</strong>, and a shift in mood.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/60 border border-white/40 shadow-xl">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--color-brand-sage-light)] rounded-full text-xl">💡</div>
                                <div>
                                    <h3 className="font-bold">Not a Diagnosis</h3>
                                    <p className="text-sm text-gray-600">We don't diagnose. We illuminate patterns.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--color-brand-rose-light)] rounded-full text-xl">🛡️</div>
                                <div>
                                    <h3 className="font-bold">Private & Secure</h3>
                                    <p className="text-sm text-gray-600">Your data is yours. We optimize for privacy.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--color-brand-gold-light)] rounded-full text-xl">✨</div>
                                <div>
                                    <h3 className="font-bold">Empowering</h3>
                                    <p className="text-sm text-gray-600">Clarity brings control during chaos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-12 rounded-3xl bg-[var(--color-brand-rose-light)]/20 border border-[var(--color-brand-rose)]/10">
                    <h2 className="text-3xl font-bold mb-6">Ready to find clarity?</h2>
                    <Link href="/register">
                        <Button size="lg" className="rounded-full px-10 py-6 text-lg bg-[var(--color-brand-rose)] text-white hover:bg-[var(--color-brand-rose)]/90 shadow-xl">
                            Join the Beta
                        </Button>
                    </Link>
                </section>

            </main>

            <footer className="py-12 border-t border-white/20 text-center space-y-4">
                <div className="flex justify-center items-center gap-2 opacity-50">
                    <Logo className="w-5 h-5" showText={false} />
                    <span className="font-serif font-bold text-lg text-[var(--foreground)]">Vicessa</span>
                </div>
                <p className="text-xs text-[var(--foreground)]/40">© 2026 Vicessa Health. Built for the transition.</p>
            </footer>
        </div>
    )
}
