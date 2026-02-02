import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/brand/Logo"

export const metadata = {
    title: "Install Vicessa | Add to Home Screen",
    description: "How to use Vicessa as an app on your phone.",
}

export default function InstallPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
                <Link href="/">
                    <Logo className="w-8 h-8" showText={true} />
                </Link>
                <Link href="/login">
                    <Button variant="ghost">Log In</Button>
                </Link>
            </nav>

            <main className="flex-1 px-6 py-12 max-w-md mx-auto space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Install Vicessa</h1>
                    <p className="text-[var(--foreground)]/70">
                        Vicessa works best when added to your home screen. It will look and feel just like a regular app.
                    </p>
                </div>

                {/* iOS Instructions */}
                <div className="glass-panel p-6 rounded-3xl space-y-4 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🍎</span>
                        <h2 className="font-bold text-lg">iPhone / iPad</h2>
                    </div>
                    <ol className="list-decimal list-inside space-y-4 text-sm font-medium text-gray-700">
                        <li>
                            Look for the <span className="inline-block px-2 py-1 bg-gray-100 rounded border border-gray-300 mx-1">Share</span> icon at the bottom of Safari.
                            <br />
                            <span className="text-xs text-gray-500">(It looks like a square with an arrow pointing up ⬆️)</span>
                        </li>
                        <li>
                            Scroll down and tap <span className="font-bold">Add to Home Screen</span>.
                            <br />
                            <span className="text-xs text-gray-500">(You may need to select "More" to find it)</span>
                        </li>
                        <li>
                            Tap <span className="font-bold text-blue-600">Add</span> in the top right corner.
                        </li>
                    </ol>
                </div>

                {/* Android Instructions */}
                <div className="glass-panel p-6 rounded-3xl space-y-4 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🤖</span>
                        <h2 className="font-bold text-lg">Android</h2>
                    </div>
                    <ol className="list-decimal list-inside space-y-4 text-sm font-medium text-gray-700">
                        <li>
                            Tap the <span className="font-bold">Menu</span> icon (3 dots) in Chrome.
                        </li>
                        <li>
                            Tap <span className="font-bold">Install App</span> or <span className="font-bold">Add to Home screen</span>.
                        </li>
                        <li>
                            Follow the prompt to install.
                        </li>
                    </ol>
                </div>

                <div className="text-center pt-8">
                    <Link href="/dashboard">
                        <Button className="w-full py-6 rounded-xl bg-[var(--foreground)] text-white">
                            Open Dashboard
                        </Button>
                    </Link>
                </div>

            </main>
        </div>
    )
}
