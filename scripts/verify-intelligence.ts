
import { InsightEngine, InsightResult } from "../src/lib/intelligence"
import { TrackerEntry } from "@prisma/client"

// Mock Date Helper
const now = new Date()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)

// Helper to create mock entry
const createEntry = (hours: number, feeds: number, mood: number | null, pain: number | null): TrackerEntry => ({
    id: `mock-${hours}`,
    userId: "test-user",
    createdAt: hoursAgo(hours),
    updatedAt: hoursAgo(hours),
    date: hoursAgo(hours),
    feedsCount: feeds,
    pumpSessions: 0,
    lastFeedTime: null,
    discomfortLevel: pain,
    fullnessLevel: 0,
    sensitivityLevel: 0,
    temperatureLevel: 0,
    stressLevel: 0,
    moodLevel: mood,
    anxietyLevel: 0,
    sleepHours: null,
    sleepQuality: null,
    babyFussiness: 0,
    solidFoodIntake: 0,
    babyDependency: null,
    notes: null
})

console.log("\n🧪 STARTING STAGE 1 VALIDATION: The Pattern Engine\n")

// SCENARIO 1: The "Weaning Crash" Pattern
// Decrease feeds -> 48h later -> Mood Drop/Pain Spike
const scenario1_history = [
    createEntry(2, 2, 2, 4),   // 2h ago: LOW feeds (2), LOW mood (2), HIGH pain (4)
    createEntry(10, 2, 3, 3),  // 10h ago: Low feeds
    createEntry(24, 2, 4, 2),  // 24h ago: Low feeds, Okay mood
    // --- DROP EVENT HERE ---
    createEntry(30, 5, 4, 1),  // 30h ago: HIGH feeds (5)
    createEntry(48, 5, 5, 1),  // 48h ago: High feeds
    createEntry(72, 5, 5, 1),  // 72h ago: High feeds
]

const currentEntry = scenario1_history[0]
const history = scenario1_history.slice(1) // Rest of history

console.log("Scenario 1: Simulate Rapid Weaning (5 feeds -> 2 feeds)")
const results = InsightEngine.analyze(currentEntry, history)

// Validation Logic
const correlation = results.find(r => r.signalType === "SILENT_CORRELATION")
const routineShift = results.find(r => r.signalType === "ROUTINE_SHIFT")

if (correlation) {
    console.log("✅ SUCCESS: Silent Correlation Detected")
    console.log(`   Message: ${correlation.message}`)
    console.log(`   Context: ${correlation.context}`)
} else {
    console.error("❌ FAILURE: Missed correlation pattern")
}

if (routineShift) {
    console.log("✅ SUCCESS: Routine Shift Detected (Physical Intensity)")
} else {
    console.log("ℹ️ Note: No Routine Shift detected (this might be expected depending on thresholds)")
}

if (!correlation) process.exit(1)

console.log("\n✨ Verification Complete: The Engine is OBSERVING, not diagnosing.")
process.exit(0)
