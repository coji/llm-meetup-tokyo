import { cachified } from 'cachified'
import type {
  DemoTrack,
  LumaEvent,
  LumaEventGuest,
  Prisma,
} from '~/services/database.server'
import { prisma } from '~/services/database.server'
import { lru } from '~/services/lru-cache.server'
import { convertEventGuest } from './luma-event-guest.server'

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
  const ret = await prisma.demoTrack.update({ where: { id }, data })
  lru.clear()
  return ret
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
