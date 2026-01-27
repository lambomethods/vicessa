import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

async function test() {
  console.log("Testing auth flow...")
  
  const email = "test@example.com"
  const password = "Test123456"
  
  // Step 1: Find user
  console.log("\n1. Finding user by email:", email)
  const user = await prisma.user.findUnique({
    where: { email },
  })
  
  if (!user) {
    console.error("❌ User not found")
    process.exit(1)
  }
  console.log("✅ User found:", user.email)
  
  // Step 2: Compare password
  console.log("\n2. Comparing password...")
  const passwordsMatch = await bcrypt.compare(password, user.password)
  console.log("✅ Passwords match:", passwordsMatch)
  
  if (passwordsMatch) {
    console.log("\n✅ AUTH SUCCESS - User would be returned")
    console.log("User:", { id: user.id, email: user.email, role: user.role })
  } else {
    console.log("\n❌ AUTH FAILED - Password mismatch")
  }
}

test().catch(console.error).finally(() => process.exit())
