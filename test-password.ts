import bcrypt from "bcryptjs"

const hash = "$2b$10$HYS12DL5TrYbd8qiCyd9g.ZQoG6ixuvklvrCjLBvafIDKfvDBDya."
const password = "Test123456"

async function test() {
  const matches = await bcrypt.compare(password, hash)
  console.log("Password matches:", matches)
}

test()
