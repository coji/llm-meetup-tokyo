import dayjs from 'dayjs'
import {
  createLumaCrawlJob,
  getConfigs,
  isRunningLumaCrawlJob,
  updateLumaCrawlJob,
  updateLumaEvent,
  upsertConfig,
  upsertLumaEvent,
  upsertLumaEventGuests,
} from '~/models'

import { createLumaClient } from '~/services/luma.server'

export const runLumaCrawlJob = async (url: string) => {
  if (await isRunningLumaCrawlJob(url)) {
    return // 同じURLのジョブが実行中の場合は何もしない
  }

  // ジョブの作成
  const job = await createLumaCrawlJob(url)
  const client = createLumaClient()

  try {
    // セッション
    const { 'luma.session': session, 'luma.session-expires': expires } =
      await getConfigs(['luma.session', 'luma.session-expires'])
    if (session && dayjs(expires).isAfter(dayjs())) {
      // セッションが存在し、有効期限内の場合はそれを使う
      await updateLumaCrawlJob({
        id: job.id,
        status: 'RUNNING',
        log: `セッション有効期限: ${expires ?? ''}`,
      })
      client.setSession(session)
    } else {
      await updateLumaCrawlJob({
        id: job.id,
        status: 'RUNNING',
        log: 'サインイン開始',
      })

      // サインインしてセッションを取得/保存
      const { session, expires } = await client.signIn({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        email: process.env.LUMA_ADMIN_EMAIL!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        password: process.env.LUMA_ADMIN_PASSWORD!,
      })
      await upsertConfig('luma.session', session)
      await upsertConfig('luma.session-expires', expires)

      await updateLumaCrawlJob({
        id: job.id,
        status: 'RUNNING',
        log: 'サインイン完了',
      })
    }

    // イベント情報の取得
    await updateLumaCrawlJob({
      id: job.id,
      status: 'RUNNING',
      log: `イベント情報を取得開始: ${url}`,
    })
    const event = await client.getEventInfo(url)
    await upsertLumaEvent({
      id: event.api_id,
      name: event.name,
      startAt: event.start_at,
      url: `https://lu.ma/${event.url}`,
      coverUrl: event.cover_url,
      endAt: event.end_at,
      socialImageUrl: event.social_image_url,
      registrationQuestions: event.registration_questions,
    })
    await updateLumaCrawlJob({
      id: job.id,
      eventId: event.api_id,
      status: 'RUNNING',
      log: 'イベント情報取得完了',
    })

    // 参加者リストの取得
    await updateLumaCrawlJob({
      id: job.id,
      status: 'RUNNING',
      log: '参加者リストを取得開始',
    })
    const guests = await client.listEventGuests(event.api_id)
    await upsertLumaEventGuests(guests)
    await updateLumaCrawlJob({
      id: job.id,
      status: 'RUNNING',
      log: `参加者リスト取得完了: ${guests.length}件`,
    })

    // 参加者数の更新
    await updateLumaEvent(event.api_id, {
      guestCount: guests.filter(
        (guest) =>
          guest.approval_status === 'approved' ||
          guest.approval_status === 'invited',
      ).length,
    })

    // ジョブの完了
    await updateLumaCrawlJob({
      id: job.id,
      status: 'DONE',
      log: '完了',
    })
  } catch (e) {
    // エラー終了
    await updateLumaCrawlJob({
      id: job.id,
      status: 'ERROR',
      log: String(e),
    })
  }
}
