import type { Prisma } from '@prisma/client'
import { setTimeout } from 'timers/promises'
import { prisma } from '~/services/database.server'

export const listLumaEvents = async () => {
  await setTimeout(2000)
  return await prisma.lumaEvent.findMany({
    select: {
      id: true,
      name: true,
      startAt: true,
      endAt: true,
      socialImageUrl: true,
      url: true,
    },
  })
}

export const upsertLumaEvent = async (data: Prisma.LumaEventCreateInput) => {
  return await prisma.lumaEvent.upsert({
    where: { id: data.id },
    create: data,
    update: data,
  })
}
