import type {
  DemoTrack,
  LumaEvent,
  LumaEventGuest,
  Prisma,
} from '@prisma/client'
import { cachified, type CacheEntry } from 'cachified'
import { LRUCache } from 'lru-cache'
import { prisma } from '~/services/database.server'
import { convertEventGuest } from './luma-event-guest.server'

const lru = new LRUCache<string, CacheEntry>({ max: 1000 })

export const listEventDemoTracks = async (eventId: LumaEvent['id']) => {
  const demoTracks = await cachified({
    key: `event-demo-tracks-${eventId}`,
    cache: lru,
    getFreshValue: async () =>
      await prisma.demoTrack.findMany({
        where: { eventId },
        include: {
          currentPresenter: { include: { lumaUser: true } },
          host: { include: { lumaUser: true } },
        },
        orderBy: { title: 'asc' },
      }),
  })

  return demoTracks.map((demoTrack) => {
    const { currentPresenter, host, ...rest } = demoTrack
    return {
      currentPresenter: currentPresenter
        ? convertEventGuest(currentPresenter)
        : null,
      host: convertEventGuest(host),
      ...rest,
    }
  })
}

export const getEventDemoTrack = async (id: DemoTrack['id']) => {
  const demoTrack = await prisma.demoTrack.findUniqueOrThrow({
    where: { id },
    include: {
      currentPresenter: { include: { lumaUser: true } },
      host: { include: { lumaUser: true } },
    },
  })
  const { currentPresenter, host, ...rest } = demoTrack
  return {
    currentPresenter: currentPresenter
      ? convertEventGuest(currentPresenter)
      : null,
    host: convertEventGuest(host),
    ...rest,
  }
}

export const updateDemoTrack = async (
  id: number,
  data: Prisma.DemoTrackUpdateInput,
) => {
  await prisma.demoTrack.update({ where: { id }, data })
}

export const createDemoTrack = async (
  data: Prisma.DemoTrackUncheckedCreateInput,
) => {
  const ret = await prisma.demoTrack.create({ data })
  lru.clear()
  return ret
}

export const deleteDemoTrack = async (id: DemoTrack['id']) => {
  const ret = await prisma.demoTrack.delete({ where: { id } })
  lru.clear()
  return ret
}

// 現在のプレゼンターを設定
export const setDemoTrackCurrentPresenter = async (
  id: DemoTrack['id'],
  presenterId?: LumaEventGuest['id'],
) => {
  if (presenterId) {
    await prisma.$transaction([
      prisma.demoTrack.update({
        where: { id },
        data: { currentPresenterId: presenterId },
      }),
      prisma.demoTrackPresenter.create({
        data: {
          demoTrackId: id,
          presenterId,
        },
      }),
    ])
  } else {
    await prisma.demoTrack.update({
      where: { id },
      data: { currentPresenterId: null },
    })
  }
  lru.clear()
}
