import type { LumaEventGuest, LumaUser, Prisma } from '@prisma/client'
import { prisma } from '~/services/database.server'
import { type LumaApiGuest } from '~/services/luma.server'

export const upsertLumaEventGuests = async (guests: LumaApiGuest[]) => {
  for (const guest of guests) {
    await prisma.$transaction([
      prisma.lumaUser.upsert({
        where: {
          id: guest.user_api_id,
        },
        create: {
          id: guest.user_api_id,
          name: guest.name,
          email: guest.email,
          avatarUrl: guest.avatar_url,
        },
        update: {
          id: guest.user_api_id,
          name: guest.name,
          email: guest.email,
          avatarUrl: guest.avatar_url,
        },
      }),
      prisma.lumaEventGuest.upsert({
        where: {
          eventId_userId: {
            eventId: guest.event_api_id,
            userId: guest.user_api_id,
          },
        },
        create: {
          id: guest.api_id,
          userId: guest.user_api_id,
          eventId: guest.event_api_id,
          approvalStatus: guest.approval_status,
          registrationAnswers: guest.registration_answers,
          updatedAt: guest.updated_at,
          createdAt: guest.created_at,
        },
        update: {
          id: guest.api_id,
          userId: guest.user_api_id,
          eventId: guest.event_api_id,
          approvalStatus: guest.approval_status,
          registrationAnswers: guest.registration_answers,
          updatedAt: guest.updated_at,
          createdAt: guest.created_at,
        },
      }),
    ])
  }
}

/**
 * 表示用に整形
 * @param guest
 * @returns
 */
export const convertEventGuest = (
  guest: LumaEventGuest & { lumaUser: LumaUser },
) => {
  const { registrationAnswers, demo, ...rest } = guest
  const answers = registrationAnswers as {
    label: string
    answer: string
    question_id: string
    question_type: string
  }[]

  return {
    ...rest,
    answers: {
      fullName: answers.find(
        (answer) => answer.label === '氏名 (ビル入館に必要: フルネーム)',
      )?.answer,
      company: answers.find(
        (answer) =>
          answer.label === '所属 (ビル入館に必要: 企業名またはフリーランス等)',
      )?.answer,
      demo: demo
        ? demo
        : answers.find(
            (answer) =>
              answer.label ===
              '飛び入りデモでどのような内容をお話されたいか教えて下さい。',
          )?.answer,
      sns: answers.find(
        (answer) =>
          answer.label ===
          'Twitter 等 SNSアカウントをお持ちでしたらお教え下さい。',
      )?.answer,
    },
  }
}

export const listEventGuests = async (eventId: string) => {
  const eventGuests = await prisma.lumaEventGuest.findMany({
    where: { eventId, approvalStatus: 'approved' },
    include: { lumaUser: true },
    orderBy: [
      { clusterIndex: 'asc' },
      { createdAt: 'desc' },
      { lumaUser: { name: 'asc' } },
    ],
  })
  return eventGuests.map((guest) => convertEventGuest(guest)) // 登録時アンケートを整形
}

export const searchEventGuests = async (eventId: string, search?: string) => {
  const nameCondition = search
    ? { lumaUser: { name: { contains: search } } }
    : {}

  const eventGuests = await prisma.lumaEventGuest.findMany({
    where: {
      AND: [{ eventId }, { approvalStatus: 'approved' }, nameCondition],
    },
    include: { lumaUser: true },
    orderBy: [{ lumaUser: { name: 'asc' } }, { createdAt: 'desc' }], // 検索はABC順で
  })
  return eventGuests.map((guest) => convertEventGuest(guest)) // 登録時アンケートを整形
}

export const getEventGuestById = async (id: string) => {
  return convertEventGuest(
    await prisma.lumaEventGuest.findUniqueOrThrow({
      where: { id },
      include: { lumaUser: true },
    }),
  )
}

export const updateEventGuest = async (
  id: string,
  data: Prisma.LumaEventGuestUpdateInput,
) => {
  return prisma.lumaEventGuest.update({
    where: { id },
    data,
  })
}
