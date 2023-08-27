import { listEventGuests } from '~/models'
import { fetchEmbedding } from '~/services/api.server'
import { prisma } from '~/services/database.server'

export const embedEventGuests = async (eventId: string) => {
  const guests = await listEventGuests(eventId)

  for (const guest of guests) {
    if (!guest.answers.demo) {
      continue
    }
    const embedding = await fetchEmbedding(guest.answers.demo)
    if (!embedding) {
      continue
    }

    await prisma.lumaEventGuest.update({
      where: { id: guest.id },
      data: { vector: embedding.embedding },
    })
  }
}
