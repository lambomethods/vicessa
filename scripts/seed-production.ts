import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function seed() {
  try {
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
    console.log("✅ Production seed completed!")
    console.log(`   Email: test@example.com`)
    console.log(`   Password: Test123456`)
    console.log(`   Role: admin`)
  } catch (error) {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
