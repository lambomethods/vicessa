"use client"

import { Button } from "@/components/ui/Button"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-4">
                <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
                <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm max-w-md break-all">
                    {error.message || "Unknown Application Error"}
                </div>
                <Button onClick={() => reset()} className="bg-gray-900 text-white">
                    Try Again
                </Button>
            </body>
        </html>
    )
}
