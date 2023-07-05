import { getEventById, getEventDemoTrack, getEventGuestById } from '~/models'

const sendDiscordWebhook = async (payload: object) => {
  await fetch(process.env.DISCORD_WEBHOOK_URL ?? '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export const sendNextPresenterNotifyToDiscord = async ({
  eventId,
  trackId,
  presenterGuestId,
}: {
  eventId: string
  trackId: number
  presenterGuestId: string
}) => {
  const event = await getEventById(eventId)
  const demoTrack = await getEventDemoTrack(trackId)
  const presenter = await getEventGuestById(presenterGuestId)
  const host = await getEventGuestById(demoTrack.hostId)

  await sendDiscordWebhook({
    content: 'The next presenter will start the demonstration.',
    username: host.lumaUser.name ?? 'Host',
    avatar_url: host.lumaUser.avatarUrl,
    embeds: [
      {
        type: 'rich',
        title: presenter.lumaUser.name ?? 'Anonymous',
        description: presenter.answers.demo,
        url: `https://llm-meetup-tokyo.fly.dev/event/${event.id}/track/${demoTrack.id}/presenter/${presenter.id}`,
        thumbnail: {
          url: presenter.lumaUser.avatarUrl,
        },
        footer: {
          text: `Host: ${host.lumaUser.name ?? 'Host'}`,
          icon_url: host.lumaUser.avatarUrl,
        },
        fields: [
          {
            name: 'Event',
            value: event.name,
            inline: false,
          },
          {
            name: 'Demo Track',
            value: demoTrack.title,
            inline: false,
          },
        ],
      },
      {
        type: 'rich',
        title: 'Join Zoom',
        url: demoTrack.zoomUrl,
      },
    ],
  })
}
