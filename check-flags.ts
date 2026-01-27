import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkFlags() {
  const flags = await prisma.systemFlag.findMany()
  console.log("System Flags:", flags)
}

checkFlags().finally(() => prisma.$disconnect())
