
export interface Tip {
    id: string
    message: string
    type: "comfort" | "health" | "emotional"
    trigger: string
}

export const getLiveTip = (
    discomfort: number | null,
    mood: number | null,
    feeds: number
): Tip | null => {
    // 1. High Discomfort Logic
    if (discomfort && discomfort >= 4) {
        return {
            id: "high_pain",
            message: "⚠️ High discomfort? Check for heat or redness. A cool compress might help reduce inflammation.",
            type: "health",
            trigger: "discomfort"
        }
    }

    // 2. Low Mood Logic
    if (mood && mood <= 2) {
        return {
            id: "low_mood",
            message: "💙 It's okay to feel this way. Remember to breathe and take it one feed at a time.",
            type: "emotional",
            trigger: "mood"
        }
    }

    // 3. Frequent Feeding (Cluster Feeding?)
    if (feeds >= 8) {
        return {
            id: "high_feeds",
            message: "🍼 Looks like a busy day! Stay hydrated, mama.",
            type: "comfort",
            trigger: "feeds"
        }
    }

    return null
}
