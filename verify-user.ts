import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function verify() {
  const user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  })
  
  if (!user) {
    console.error("❌ User not found!")
    process.exit(1)
  }
  
  const passwordMatch = await bcrypt.compare("Test123456", user.password)
  console.log("✅ User found:", user.email)
  console.log("✅ Password matches:", passwordMatch)
  console.log("✅ User ID:", user.id)
  console.log("✅ User role:", user.role)
}

verify().finally(() => prisma.$disconnect())
