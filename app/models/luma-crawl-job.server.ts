import { type LumaCrawlState, type LumaEvent } from '@prisma/client'
import { prisma } from '~/services/database.server'

/**
 * Luma クロールジョブが実行中かどうか
 * @param url
 * @returns
 */
export const isRunningLumaCrawlJob = async (url: string) => {
  const job = await prisma.lumaCrawlJob.findFirst({
    where: { url, status: 'RUNNING' },
  })
  return job !== null
}

/**
 * Luma クロールジョブの作成
 * @param url lumaイベントURL
 * @returns
 */
export const createLumaCrawlJob = async (url: string) => {
  const job = await prisma.lumaCrawlJob.create({
    data: { url, status: 'CREATED', logs: [] },
  })
  return job
}

/**
 * Luma クロールジョブの更新
 * @param id ジョブID
 * @param status ジョブステータス
 * @param log 実行ログ
 * @returns
 */
export const updateLumaCrawlJob = async ({
  id,
  eventId,
  status,
  log,
}: {
  id: number
  eventId?: LumaEvent['id']
  status: LumaCrawlState
  log: string
}) => {
  const job = await prisma.lumaCrawlJob.update({
    where: { id },
    data: {
      eventId,
      status,
      logs: {
        push: { status, message: log, timestamp: new Date().toISOString() },
      },
    },
  })
  return job
}

/**
 * リストを取得
 * @param eventId
 * @returns
 */
export const listLumaCrawlJobs = async (eventId: string, take = 10) => {
  return await prisma.lumaCrawlJob.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' },
    take,
  })
}
