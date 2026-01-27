import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function check() {
  const flag = await prisma.systemFlag.findUnique({
    where: { key: "DISABLE_AUTH" },
  })
  console.log("DISABLE_AUTH flag:", flag)
}

check().finally(() => prisma.$disconnect())
