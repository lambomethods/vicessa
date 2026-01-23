"use client"

import { useState } from "react"
import { FLAGS } from "@/lib/flags"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

interface Post {
    id: string
    title: string
    content: string
    createdAt: string
    user: {
        name: string | null
    }
}

export function CommunityFeed({ initialPosts }: { initialPosts: Post[] }) {
    const [posts] = useState<Post[]>(initialPosts)
    const [isCreating, setIsCreating] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newContent, setNewContent] = useState("")

    if (FLAGS.SAFE_MODE || !FLAGS.COMMUNITY_ENABLED) {
        return (
            <div className="p-8 text-center border rounded-xl bg-gray-50 text-gray-500">
                <h3 className="font-bold text-lg mb-2">Community Temporarily Paused</h3>
                <p>We&apos;re making improvements to the community experience. Check back soon!</p>
            </div>
        )
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/community/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            })

            if (res.ok) {
                await res.json()
                // Optimistic update or re-fetch. Since the API returns the post with user ID but maybe not name immediately populated if not joined, 
                // we might need to assume current user. For MVP let's just refresh page or simple append.
                // Re-fetching full list is safest for MVP.
                window.location.reload()
            }
        } catch (error) {
            console.error("Failed to post", error)
        }
    }

    return (
        <div className="space-y-6">
            {/* CREATE POST INPUT */}
            <Card className="border-[var(--color-brand-sage)]/20 shadow-sm">
                <CardHeader className="pb-3">
                    <h3 className="font-bold text-lg text-[var(--color-brand-eucalyptus)]">Share with the Community</h3>
                </CardHeader>
                <CardContent>
                    {!isCreating ? (
                        <div
                            onClick={() => setIsCreating(true)}
                            className="bg-gray-50 p-4 rounded-lg text-gray-400 cursor-text hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                        >
                            What&apos;s on your mind?
                        </div>
                    ) : (
                        <form onSubmit={handleCreatePost} className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                            <input
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--color-brand-rose)] outline-none"
                                placeholder="Topic (e.g., Night Weaning)"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                            <textarea
                                className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-[var(--color-brand-rose)] outline-none resize-none"
                                placeholder="Share your experience..."
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[var(--color-brand-rose)] text-white hover:bg-[var(--color-brand-rose)]/90">Post</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* POSTS LIST */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 italic">
                        No posts yet. Be the first to verify the community is alive!
                    </div>
                ) : (
                    posts.map(post => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-gray-800">{post.title}</h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                                <div className="flex items-center gap-2 text-xs text-[var(--color-brand-sage)] font-bold uppercase tracking-wider">
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-brand-mist)] flex items-center justify-center text-[var(--color-brand-eucalyptus)]">
                                        {(post.user.name || "A").charAt(0)}
                                    </div>
                                    {post.user.name || "Anonymous Mama"}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
