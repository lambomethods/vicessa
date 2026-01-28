import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/brand/Logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col overflow-hidden">
      {/* Navbar - Minimal & Glass */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" showText={true} />
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-[var(--foreground)] font-medium hover:bg-white/40">Log In</Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-full bg-[var(--foreground)] text-white hover:bg-[var(--foreground)]/90 shadow-lg">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 py-12 lg:py-0 w-full max-w-7xl mx-auto gap-12 lg:gap-24">

        {/* Left: Typography & Brand */}
        <div className="flex-1 space-y-8 animate-fade-in text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-rose)] animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-[var(--foreground)]/70 uppercase">Beta Access Live</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] leading-[1.1]">
            Understand your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-rose)] to-[var(--color-brand-sage)]">transition.</span>
          </h1>

          <p className="text-xl text-[var(--foreground)]/80 max-w-lg leading-relaxed">
            A secure platform to track personal signals, discover patterns, and navigate lactation transitions with clarity.
            <span className="block mt-4 text-sm font-medium opacity-60">intelligent • calm • empowering</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose)]/90 text-white shadow-xl shadow-[var(--color-brand-rose)]/20 transition-all hover:scale-105">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-white/50">
                Explore Vicessa
              </Button>
            </Link>
          </div>
          <div className="pt-4">
            <a href="mailto:support@vicessa.com?subject=My Weaning Story (Beta Feedback)">
              <Button variant="ghost" className="text-sm text-gray-500 hover:text-[var(--color-brand-rose)] gap-2">
                💌 Share Your Story
              </Button>
            </a>
          </div>
        </div>

        {/* Right: Abstract UI / Visual */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl relative animate-fade-in delay-100">
          {/* Abstract Background Blobs */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--color-brand-rose-light)]/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--color-brand-sage-light)]/40 rounded-full blur-3xl" />

          {/* Glass UI Card Composition */}
          <div className="relative glass-panel rounded-3xl p-6 shadow-2xl border border-white/50 backdrop-blur-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <div className="h-2 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-40 bg-[var(--foreground)]/10 rounded" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-sage-light)]/50" />
            </div>

            {/* Chart / Data Graphic (Abstract) */}
            <div className="h-40 w-full mb-8 relative">
              <svg viewBox="0 0 400 160" className="w-full h-full text-[var(--color-brand-rose)] overflow-visible">
                <path d="M0,100 C50,100 80,60 150,60 S250,90 300,50 S350,20 400,30"
                  fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                <path d="M0,100 L400,100" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" opacity="0.2" />
                {/* Points */}
                <circle cx="150" cy="60" r="6" fill="white" stroke="currentColor" strokeWidth="3" />
                <circle cx="300" cy="50" r="6" fill="white" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 font-medium">
                <span>Week 1</span>
                <span>Week 4</span>
                <span>Week 8</span>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/60 border border-white/40">
                <div className="h-8 w-8 rounded-full bg-[var(--color-brand-gold-light)] mb-3 flex items-center justify-center">
                  <span className="text-[var(--color-brand-gold)] font-bold text-xs">⚡</span>
                </div>
                <div className="h-2 w-12 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-20 bg-[var(--foreground)]/5 rounded" />
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-brand-rose-light)]/30 border border-[var(--color-brand-rose)]/10">
                <div className="h-8 w-8 rounded-full bg-white mb-3 flex items-center justify-center">
                  <span className="text-[var(--color-brand-rose)] font-bold text-xs">♥</span>
                </div>
                <div className="h-2 w-12 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-20 bg-[var(--foreground)]/5 rounded" />
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -right-8 top-1/2 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 animate-bounce duration-[3000ms]">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-sm font-semibold text-gray-600">Pattern Shift Observed</span>
          </div>
        </div>
      </main>

      {/* Features / Value Prop Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,var(--color-brand-sage-light)_0%,transparent_60%)] opacity-40 z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">Science, not speculation.</h2>
            <p className="text-lg text-[var(--foreground)]/60 max-w-2xl mx-auto">
              Most apps focus on the baby. Vicessa focuses on <span className="font-semibold text-[var(--color-brand-rose)]">you</span>—the patterns of your transition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-3xl border border-white/60 hover:border-[var(--color-brand-rose)]/30 transition-all duration-500 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-rose-light)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📉</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Pattern Correlation</h3>
              <p className="text-[var(--foreground)]/70 leading-relaxed">
                Log physical signals and emotional states. Vicessa highlights relationships between changes in routine and how you feel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-3xl border border-white/60 hover:border-[var(--color-brand-sage)]/30 transition-all duration-500 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-sage-light)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧭</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Signal Awareness</h3>
              <p className="text-[var(--foreground)]/70 leading-relaxed">
                Vicessa surfaces trends that some users choose to explore further with trusted professionals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-3xl border border-white/60 hover:border-[var(--color-brand-gold)]/30 transition-all duration-500 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-gold-light)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Adaptive Insights</h3>
              <p className="text-[var(--foreground)]/70 leading-relaxed">
                Instead of generic advice, Vicessa presents evolving patterns based on your personal data and peer trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 border-t border-white/20 text-center space-y-4">
        <div className="flex justify-center items-center gap-2 opacity-50">
          <Logo className="w-5 h-5" showText={false} />
          <span className="font-serif font-bold text-lg text-[var(--foreground)]">Vicessa</span>
        </div>
        <p className="text-xs text-[var(--foreground)]/40">© 2026 Vicessa Health. Built for the transition.</p>
      </footer>
    </div >
  )
}
