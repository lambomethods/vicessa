export const FLAGS = {
    // 1. AI / Insights Kill Switch
    // If false, the intelligence engine returns generic disclaimers only.
    AI_ENABLED: process.env.NEXT_PUBLIC_AI_ENABLED === "true",

    // 2. Community Kill Switch
    // If false, the community feed is hidden/disabled.
    COMMUNITY_ENABLED: process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === "true",

    // 3. Global Safe Mode (Nuclear Option)
    // If true, the app becomes read-only or highly restricted.
    // Disables AI, Suggestions, and Community.
    SAFE_MODE: process.env.SAFE_MODE === "true",
}

// 4. Legal / High-Risk Triggers
// Symptoms that immediately disable AI suggestions and show medical warnings.
export const HIGH_RISK_SYMPTOMS = [
    "fever",
    "red streaks",
    "hot spots",
    "severe pain",
    "chills",
    "blood"
]

export function isHighRisk(symptoms: string[]): boolean {
    return symptoms.some(s =>
        HIGH_RISK_SYMPTOMS.some(risk => s.toLowerCase().includes(risk.toLowerCase()))
    )
}
