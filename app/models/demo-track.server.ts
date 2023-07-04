import type { DemoTrack, LumaEvent, Prisma } from '@prisma/client'
import { prisma } from '~/services/database.server'
import { convertEventGuest } from './luma-event-guest.server'

export const listEventDemoTracks = async (eventId: LumaEvent['id']) => {
  const demoTracks = await prisma.demoTrack.findMany({
    where: { eventId },
    include: {
      currentPresenter: { include: { lumaUser: true } },
      host: { include: { lumaUser: true } },
    },
    orderBy: { createdAt: 'asc' },
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
  await prisma.demoTrack.create({ data })
}

export const deleteDemoTrack = async (id: DemoTrack['id']) => {
  await prisma.demoTrack.delete({ where: { id } })
}
