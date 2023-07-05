import { listEventGuests } from '~/models'
import { prisma } from '~/services/database.server'
import { fetchEmbedding } from '~/services/embed'

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
