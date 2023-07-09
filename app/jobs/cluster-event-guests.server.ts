import { Prisma } from '@prisma/client'
import kmeans from 'skmeans'
import { prisma } from '~/services/database.server'
import { lru } from '~/services/lru-cache.server'

export const clusterEventGuests = async (eventId: string, clusterNum = 3) => {
  const guests = await prisma.lumaEventGuest.findMany({
    where: { eventId, vector: { not: Prisma.DbNull } },
    select: { id: true, vector: true },
  })

  const vectors = guests.map((guest) => guest.vector as number[])
  console.log(vectors.length)

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

  // イベントのゲストリストキャッシュクリア
  lru.delete(`eventGuests-${eventId}`)
}
