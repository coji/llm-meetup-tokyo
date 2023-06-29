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
  let event = null

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
    const lumaEvent = await client.getEventInfo(url)
    event = await upsertLumaEvent({
      id: lumaEvent.api_id,
      name: lumaEvent.name,
      startAt: lumaEvent.start_at,
      url: `https://lu.ma/${lumaEvent.url}`,
      geoAddress: lumaEvent.geo_address_info.address,
      geoCityState: lumaEvent.geo_address_info.city_state,
      geoPlaceId: lumaEvent.geo_address_info.place_id,
      guestCount: 0,
      coverUrl: lumaEvent.cover_url,
      endAt: lumaEvent.end_at,
      socialImageUrl: lumaEvent.social_image_url,
      registrationQuestions: lumaEvent.registration_questions,
    })
    await updateLumaCrawlJob({
      id: job.id,
      eventId: lumaEvent.api_id,
      status: 'RUNNING',
      log: 'イベント情報取得完了',
    })

    // 参加者リストの取得
    await updateLumaCrawlJob({
      id: job.id,
      status: 'RUNNING',
      log: '参加者リストを取得開始',
    })
    const guests = await client.listEventGuests(lumaEvent.api_id)
    await upsertLumaEventGuests(guests)
    await updateLumaCrawlJob({
      id: job.id,
      status: 'RUNNING',
      log: `参加者リスト取得完了: ${guests.length}件`,
    })

    // 参加者数の更新
    await updateLumaEvent(lumaEvent.api_id, {
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
  return event
}
