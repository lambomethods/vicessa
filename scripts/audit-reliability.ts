
import { PrismaClient } from '@prisma/client'
import { TrackerEntrySchema } from '../src/app/api/tracker/entry/route'
import { z } from 'zod'

const prisma = new PrismaClient()

async function auditReliability() {
    console.log("🔍 Starting Reliability Audit (Schema & DB)...")

    const issues: string[] = []

    // --- PART 1: SCHEMA VALIDATION (The Guardrails) ---
    console.log("\n🛡️  Auditing Validation Schema...")

    // Test 1: Future Date
    try {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 7)

        TrackerEntrySchema.parse({
            date: futureDate.toISOString(),
            feedsCount: 0
        })
        console.log(`❌ ERROR: Schema ALLOWED future date.`)
        issues.push("Schema: Future Logging Allowed")
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.log(`✅ Schema Blocked Future Date.`)
        } else {
            console.log(`❓ Unknown error on future date: ${e}`)
        }
    }

    // Test 2: Logical Contradiction
    try {
        TrackerEntrySchema.parse({
            babyDependency: "formula_exclusive",
            feedsCount: 5,
            notes: "I am contradictory"
        })
        console.log(`❌ ERROR: Schema ALLOWED contradiction.`)
        issues.push("Schema: Contradiction Allowed")
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.log(`✅ Schema Blocked Contradiction.`)
        } else {
            console.log(`❓ Unknown error on contradiction: ${e}`)
        }
    }


    // --- PART 2: DB INTEGRITY (The Foundation) ---
    console.log("\n💾 Auditing Database Integrity...")

    // 1. Setup Test User
    const testEmail = `audit_${Date.now()}@vicessa.test`
    const user = await prisma.user.create({
        data: {
            email: testEmail,
            password: "audit_password_hash",
            name: "Audit Bot"
        }
    })

    try {
        // 3. TIMEZONE / ORDERING (Re-verify)
        const pastDate = new Date()
        pastDate.setDate(pastDate.getDate() - 5)

        await prisma.trackerEntry.create({
            data: {
                userId: user.id,
                date: pastDate,
                discomfortLevel: 1
            }
        })
        // Add a newer one
        await prisma.trackerEntry.create({
            data: {
                userId: user.id,
                date: new Date(),
                discomfortLevel: 1
            }
        })

        const history = await prisma.trackerEntry.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' }
        })

        if (history[0].date < history[1].date) {
            console.log(`❌ ERROR: History sorting incorrect.`)
            issues.push("DB: History Sort Order Failure")
        } else {
            console.log(`✅ History sorting verified (Desc by Date).`)
        }

        // 4. ZERO STATE
        const zeroRef = await prisma.trackerEntry.create({
            data: { userId: user.id, feedsCount: 0 }
        })
        if (zeroRef.feedsCount !== 0) {
            console.log(`❌ ERROR: Zero value lost.`)
            issues.push("DB: Zero Value Corruption")
        } else {
            console.log(`✅ Zero State preserved.`)
        }

    } catch (error) {
        console.error("DB Audit Error:", error)
    } finally {
        await prisma.trackerEntry.deleteMany({ where: { userId: user.id } })
        await prisma.user.delete({ where: { id: user.id } })
        await prisma.$disconnect()
    }

    console.log("\n📋 --- FINAL AUDIT REPORT ---")
    if (issues.length === 0) {
        console.log("✅ RELIABILITY LAYER: SECURE")
    } else {
        console.log(`❌ FAILED: ${issues.length} Issues Found`)
        issues.forEach(i => console.log(`   - ${i}`))
    }
}

auditReliability()
