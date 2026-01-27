import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/auth"

export default async function DashboardPage() {
    const session = await auth()
    
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-white">Dashboard</h1>
                
                <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Welcome, {session.user?.name || session.user?.email}</h2>
                    <p className="text-gray-400 mb-8">You've successfully logged in!</p>
                    
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <button type="submit" className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition">
                            Sign Out
                        </button>
                    </form>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold mb-4 text-white">Profile</h3>
                        <p className="text-gray-400 mb-2">Email: {session.user?.email}</p>
                        {session.user?.role && <p className="text-gray-400">Role: {session.user.role}</p>}
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold mb-4 text-white">Session Info</h3>
                        <p className="text-gray-400 text-sm">You are logged in and authenticated.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
