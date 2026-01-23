import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        )
    } catch (error) {
        console.error("Webhook signature verification failed.", error)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session

            if (!session?.metadata?.userId) {
                return NextResponse.json({ error: "No user ID in metadata" }, { status: 400 })
            }

            await prisma.user.update({
                where: { id: session.metadata.userId },
                data: {
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                    planType: "premium",
                    subscriptionStatus: "active",
                },
            })
        }
    } catch (error) {
        console.error("Webhook handler error:", error)
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
