/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.user.deleteMany()
  console.log(`Database has been seeded. 🌱`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
