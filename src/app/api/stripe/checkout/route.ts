import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()

        // Fix: Explicit null check for user and email
        if (!session?.user?.id || !session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fix: Explicitly type/cast to string to satisfy Stripe types
        const userEmail = session.user.email as string

        const checkoutSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: userEmail,
            metadata: {
                userId: session.user.id,
            },
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Vicessa Premium",
                            description: "Full access to detailed tracking and insights",
                        },
                        unit_amount: 999, // $9.99
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
        console.error("Stripe Checkout Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
