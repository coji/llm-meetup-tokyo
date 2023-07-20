import { cachified } from 'cachified'
import { prisma, type LumaEvent, type Prisma } from '~/services/database.server'
import { lru } from '~/services/lru-cache.server'

export const listLumaEvents = async () => {
  return await cachified({
    key: 'events',
    cache: lru,
    getFreshValue: async () => {
      return await prisma.lumaEvent.findMany({
        orderBy: { startAt: 'desc' },
      })
    },
  })
}

export const upsertLumaEvent = async (data: Prisma.LumaEventCreateInput) => {
  const ret = await prisma.lumaEvent.upsert({
    where: { id: data.id },
    create: data,
    update: data,
  })
  lru.delete('events')
  lru.delete(`event-${data.id}`)
  return ret
}

export const updateLumaEvent = async (
  id: LumaEvent['id'],
  data: Prisma.LumaEventUpdateInput,
) => {
  const ret = await prisma.lumaEvent.update({
    where: { id },
    data,
  })
  lru.delete('events')
  lru.delete(`event-${id}`)
  return ret
}

export const getEventById = async (id: string) => {
  return await cachified({
    key: `event-${id}`,
    cache: lru,
    getFreshValue: async () => {
      return await prisma.lumaEvent.findFirstOrThrow({ where: { id } })
    },
  })
}
