import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function seed() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash("Test123456", 10)
    
    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
        role: "admin",
      },
    })

    console.log("✅ Seed completed!")
    console.log("Test user created:")
    console.log(`Email: ${user.email}`)
    console.log(`Password: Test123456`)
  } catch (error) {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
