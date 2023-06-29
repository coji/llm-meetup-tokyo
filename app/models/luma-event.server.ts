import type { LumaEvent, Prisma } from '@prisma/client'
import { prisma } from '~/services/database.server'

export const listLumaEvents = async () => {
  return await prisma.lumaEvent.findMany({
    include: {
      lumaEventGuest: {
        include: { lumaUser: true },
        where: { approvalStatus: { in: ['approved', 'invited'] } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { startAt: 'desc' },
  })
}

export const upsertLumaEvent = async (data: Prisma.LumaEventCreateInput) => {
  return await prisma.lumaEvent.upsert({
    where: { id: data.id },
    create: data,
    update: data,
  })
}

export const updateLumaEvent = async (
  id: LumaEvent['id'],
  data: Prisma.LumaEventUpdateInput,
) => {
  return await prisma.lumaEvent.update({
    where: { id },
    data,
  })
}

export const getEventById = async (id: string) => {
  return await prisma.lumaEvent.findFirstOrThrow({ where: { id } })
}
