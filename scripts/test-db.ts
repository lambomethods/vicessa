// scripts/test-db.ts
import { prisma } from "../src/lib/db"

async function main() {
    console.log("Testing DB connection...")
    try {
        const users = await prisma.user.findMany()
        console.log("Connection successful. Users count:", users.length)
    } catch (e) {
        console.error("Connection failed:", e)
        process.exit(1)
    }
}

main()
