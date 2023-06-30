import { prisma } from '~/services/database.server'

export const listLumaEventGuestDemoEditLogs = async (
  lumaEventGuestId: string,
  take = 10,
) => {
  return await prisma.lumaEventGuestDemoEditLog.findMany({
    where: { lumaEventGuestId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take,
  })
}

export const addLumaEventGuestDemoEditLog = async ({
  userId,
  lumaEventGuestId,
  oldValue,
  newValue,
}: {
  userId: string
  lumaEventGuestId: string
  oldValue?: string
  newValue?: string
}) => {
  await prisma.lumaEventGuestDemoEditLog.create({
    data: {
      userId,
      lumaEventGuestId,
      oldValue,
      newValue,
    },
  })
}
