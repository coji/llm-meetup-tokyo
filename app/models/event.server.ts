import { setTimeout } from 'timers/promises'
import { prisma } from '~/services/database.server'

export const listEvents = async () => {
  await setTimeout(2000)
  return prisma.event.findMany()
}
