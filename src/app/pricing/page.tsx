import { redirect } from "next/navigation"

export default function PricingPage() {
    // Monetization disabled for Beta Launch
    redirect("/dashboard")
}
