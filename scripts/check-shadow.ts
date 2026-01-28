
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🕵️ Checking Shadow DB...")

    const signals = await prisma.insightSignal.findMany({
        where: {
            user: {
                email: "bug_test_v1@test.com"
            }
        },
        include: { user: true }
    })

    console.log(`Found ${signals.length} signals.`)
    signals.forEach(s => {
        console.log(`[${s.signalType}] ${s.message} (Sev: ${s.severity})`)
    })

    if (signals.some(s => s.signalType === "SILENT_CORRELATION")) {
        console.log("✅ SUCCESS: Shadow Correlation Detected!")
    } else {
        console.log("❌ FAILURE: No correlation signal found.")
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
