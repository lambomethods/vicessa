import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { CommunityFeed } from "@/components/community/CommunityFeed"

export default async function CommunityPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Fetch posts server-side
    const posts = await prisma.post.findMany({
        include: {
            user: { select: { name: true, image: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    })

    // Serialize dates for client component
    const serializedPosts = posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString()
    }))

    return (
        <div className="container mx-auto p-6 max-w-2xl space-y-8 pb-24 animate-fade-in">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Community</h1>
                <p className="text-gray-500">You are not alone. Share your journey.</p>
            </div>

            <div className="bg-[var(--color-brand-mist)]/30 p-4 rounded-lg text-sm text-[var(--color-brand-eucalyptus)] border border-[var(--color-brand-sage)]/20 mb-6">
                <strong>✨ Beta Community Rules:</strong> stick to kindness and support. This is a safe space for weaning mothers.
            </div>

            <CommunityFeed initialPosts={serializedPosts} />
        </div>
    )
}
