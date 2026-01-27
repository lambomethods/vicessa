import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"

export default async function DashboardPage() {
    const session = await auth()
    
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
                
                <div className="bg-slate-900 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Welcome, {session.user?.name || session.user?.email}</h2>
                    <p className="text-gray-300 mb-6">You've successfully logged in!</p>
                    
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <Button variant="outline" type="submit">Sign Out</Button>
                    </form>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">Profile</h3>
                        <p className="text-gray-300 mb-4">Email: {session.user?.email}</p>
                        {session.user?.role && <p className="text-gray-300">Role: {session.user.role}</p>}
                    </div>
                    
                    <div className="bg-slate-900 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">Session Info</h3>
                        <p className="text-gray-300 text-sm">You are logged in and authenticated.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
