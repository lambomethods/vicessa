import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  })
  console.log("User found:", user)
  if (user) {
    console.log("Email:", user.email)
    console.log("Password hash:", user.password.substring(0, 20) + "...")
    console.log("Role:", user.role)
  }
}

checkUser().finally(() => prisma.$disconnect())
