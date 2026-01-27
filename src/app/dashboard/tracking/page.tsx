import { auth } from "@/auth"
import { DailyLogForm } from "@/components/tracker/DailyLogForm"
import { redirect } from "next/navigation"

export default async function TrackerPage() {
    const session = await auth()
    if (!session) redirect("/login")

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Daily Log</h1>
                <p className="text-gray-500">Wednesday, Jan 22</p>
            </div>

            <DailyLogForm />
        </div>
    )
}
