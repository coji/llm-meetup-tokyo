import type { Prisma } from '@prisma/client'
import { prisma } from '~/services/database.server'

export const listLumaEvents = async () => {
  return await prisma.lumaEvent.findMany({
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

export const getEventById = async (id: string) => {
  return await prisma.lumaEvent.findFirstOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      url: true,
      coverUrl: true,
      startAt: true,
      endAt: true,
      registrationQuestions: true,
      lumaEventGuest: {
        select: {
          id: true,
          lumaUser: { select: { id: true, name: true, avatarUrl: true } },
          registrationAnswers: true,
        },
        where: { approvalStatus: 'approved' },
      },
    },
  })
}
