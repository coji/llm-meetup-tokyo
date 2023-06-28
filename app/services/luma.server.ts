/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as cheerio from 'cheerio'
import { parse as parseCookie } from 'es-cookie'

export interface LumaApiEvent {
  api_id: string // 'evt-BMEa7jLL9eKt4FR'
  cover_url: string // 'https://images.unsplash.com/photo-1531219435494-8e90d22adc1e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3wxMjQyMjF8MHwxfHNlYXJjaHwxNXx8VG9reW98ZW58MHwwfHx8MTY4NTkyODY0OXww&ixlib=rb-4.0.3&q=80&w=2000&h=1000'
  start_at: string // '2023-07-05T10:00:00.501Z',
  end_at: string // '2023-07-05T12:30:00.501Z'
  name: string //  'LLM Meetup Tokyo #3'
  url: string // 'llm-meetup-tokyo-3'
  registration_questions: {
    id: string // 'ce9g8l58'
    label: string // '氏名 (ビル入館に必要: フルネーム)'
    required: boolean // true
    question_type: 'text'
  }[]
  social_image_url: string // 'https://social-images.lu.ma/api/event-social-image?event_name=LLM%20Meetup%20Tokyo%20%233&event_start_at=2023-07-05T10%3A00%3A00.501Z&event_theme=legacy&event_timezone=Asia%2FTokyo&host_avatar_url=https%3A%2F%2Fimages.lumacdn.com%2Favatars%2Fzv%2F82b8cc3e-8d10-4b70-8b79-d5ffcc559cb8&host_name=coji'
}

export interface LumaApiGuest {
  api_id: string // 'gst-xxxxxxxxxxxxxxx'
  approval_status: 'approved'
  event_api_id: string // 'evt-BMEa7jLL9eKt4FR'
  registration_answers: {
    label: string //
    // '氏名 (ビル入館に必要: フルネーム)'
    // '所属 (ビル入館に必要: 企業名またはフリーランス等)'
    // '飛び入りデモでどのような内容をお話されたいか教えて下さい。'
    // 'Twitter 等 SNSアカウントをお持ちでしたらお教え下さい。'
    answer: string
    question_id: string
    question_type: 'text'
  }[]
  user_api_id: string // 'usr-xxxxxxxxxxxxxxx'
  name: string // 'coji'
  email: string // 'coji@techtalk.jp'
  avatar_url: string // 'https://images.lumacdn.com/avatars/zv/82b8cc3e-8d10-4b70-8b79-d5ffcc559cb8'
  updated_at: string // '2023-06-21T03:17:56.790Z'
  created_at: string // '2023-06-15T06:19:34.105Z'
}

const shapeLumaEvent = (event: LumaApiEvent): LumaApiEvent => ({
  api_id: event.api_id,
  cover_url: event.cover_url,
  start_at: event.start_at,
  end_at: event.end_at,
  name: event.name,
  url: event.url,
  registration_questions: event.registration_questions.map((q) => ({
    id: q.id,
    label: q.label,
    required: q.required,
    question_type: q.question_type,
  })),
  social_image_url: event.social_image_url,
})

const shapeLumaGuests = (guests: LumaApiGuest[]): LumaApiGuest[] =>
  guests.map((guest) => ({
    api_id: guest.api_id,
    approval_status: guest.approval_status,
    event_api_id: guest.event_api_id,
    registration_answers: guest.registration_answers.map((a) => ({
      label: a.label,
      answer: a.answer,
      question_id: a.question_id,
      question_type: a.question_type,
    })),
    user_api_id: guest.user_api_id,
    name: guest.name,
    email: guest.email,
    avatar_url: guest.avatar_url,
    updated_at: guest.updated_at,
    created_at: guest.created_at,
  }))

export const createLumaClient = () => {
  let session: string | null = null

  /**
   *  イベント情報取得
   */
  const getEventInfo = async (url: string) => {
    // fetch して html を取得
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)

    // イベント情報を取得
    const nextData = $('script#__NEXT_DATA__').text()
    const pageData = JSON.parse(nextData) as {
      props: { pageProps: { initialData: { data: { event: LumaApiEvent } } } }
    }
    return shapeLumaEvent(pageData.props.pageProps.initialData.data.event)
  }

  /**
   * サインインして luma の sessionKey を取得
   */
  const signIn = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const ret = await fetch('https://api.lu.ma/auth/sign-in-with-password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    const cookie = ret.headers.get('set-cookie')
    if (!cookie) {
      throw new Error('No session cookie found')
    }

    // luma.auth-session-key=usr-xxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxx; path=/; expires=Fri, 25 Aug 2023 04:45:39 GMT; domain=.lu.ma; samesite=lax; secure; httponly
    const c = parseCookie(cookie)
    session = c['luma.auth-session-key']
    const expires = c['expires']

    return { session, expires }
  }

  const signOut = () => {
    session = null
  }

  const setSession = (newSession: string) => {
    session = newSession
  }

  /**
   * イベントのゲスト一覧を取得
   * @param eventId
   */
  const listEventGuests = async (eventId: string) => {
    if (!session) {
      throw new Error('No session key found. You should sign-in first.')
    }

    const ret = await fetch(
      `https://api.lu.ma/event/guests?event_api_id=${eventId}&query=&sort_direction=desc&sort_column=created_at&pagination_limit=100`,
      {
        method: 'GET',
        headers: { Cookie: `luma.auth-session-key=${session}` },
      },
    )

    const guests = (await ret.json()).entries as LumaApiGuest[]
    return shapeLumaGuests(guests)
  }

  return {
    getEventInfo,
    signIn,
    signOut,
    setSession,
    listEventGuests,
  }
}
