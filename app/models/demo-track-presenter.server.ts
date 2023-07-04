import type { DemoTrack } from '@prisma/client'
import { prisma } from '~/services/database.server'
import { convertEventGuest } from './luma-event-guest.server'

export const listDemoTrackPresenters = async (trackId: DemoTrack['id']) => {
  const presenters = await prisma.demoTrackPresenter.findMany({
    where: { demoTrackId: trackId },
    orderBy: { createdAt: 'asc' }, // 順番に
    include: { presenter: { include: { lumaUser: true } } },
  })
  return presenters.map((presenter) => convertEventGuest(presenter.presenter))
}
