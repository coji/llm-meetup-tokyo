import kmeans from 'skmeans'
import { listEventGuests } from '~/models'
import { prisma } from '~/services/database.server'

export const clusterEventGuests = async (eventId: string, clusterNum = 3) => {
  const guests = (await listEventGuests(eventId)).filter(
    (guest) => !!guest.vector,
  )
  const vectors = guests.map((guest) => guest.vector as number[])

  // クラスタリング実行
  const clusters = kmeans(vectors, clusterNum)
  const clusteredGuests = guests.map((guest, i) => ({
    clusterIndex: clusters.idxs[i],
    guest,
    vector: vectors[i],
  }))

  // クラスタ番号を書き戻す
  for (const guest of clusteredGuests) {
    await prisma.lumaEventGuest.update({
      where: { id: guest.guest.id },
      data: { clusterIndex: guest.clusterIndex },
    })
  }
}
