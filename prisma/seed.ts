import { prisma } from '~/services/database.server'

async function seed() {
  await prisma.user.deleteMany({})
  console.log(`Database has been seeded. 🌱`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
