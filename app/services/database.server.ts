import { PrismaClient } from '../../prisma/prisma-client'
export * from '../../prisma/prisma-client'

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'production'
      ? []
      : [{ emit: 'event', level: 'query' }],
})

prisma.$on('query', (e) => {
  console.log(`${e.query} ${e.params}`)
})
