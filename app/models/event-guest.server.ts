import type { Prisma } from '@prisma/client'
import { prisma } from '~/services/database.server'

export const upsertEventGuests = async (
  eventId: number,
  eventGuests: Omit<Prisma.EventGuestUncheckedCreateInput, 'eventId'>[],
) => {
  for (const eventGuest of eventGuests) {
    await prisma.eventGuest.upsert({
      where: { id: eventGuest.id },
      create: { eventId, ...eventGuest },
      update: { eventId, ...eventGuest },
    })
  }
}
