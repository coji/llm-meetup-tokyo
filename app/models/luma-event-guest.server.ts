import { prisma } from '~/services/database.server'
import { type LumaApiGuest } from '~/services/luma.server'

export const upsertLumaEventGuests = async (guests: LumaApiGuest[]) => {
  for (const guest of guests) {
    await prisma.lumaUser.upsert({
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
    })

    await prisma.lumaEventGuest.upsert({
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
    })
  }
}
