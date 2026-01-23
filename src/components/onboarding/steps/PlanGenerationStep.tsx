export function PlanGenerationStep() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-fade-in">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[var(--color-brand-rose)] rounded-full border-t-transparent animate-spin"></div>
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-brand-rose)] to-[var(--color-brand-gold)] bg-clip-text text-transparent">
                    Designing your journey...
                </h2>
                <div className="space-y-1 text-sm text-gray-500">
                    <p className="animate-pulse">Analyzing feeding patterns...</p>
                    <p className="animate-pulse delay-75">Calculating hormone transition curve...</p>
                    <p className="animate-pulse delay-150">Checking risk factors...</p>
                </div>
            </div>
        </div>
    )
}
