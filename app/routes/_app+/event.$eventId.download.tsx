import { type LoaderArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { getEventById, listEventGuests } from '~/models'

import pptxgen from 'pptxgenjs'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)
  const guests = await listEventGuests(eventId)

  const pres = new pptxgen()
  for (const guest of guests) {
    const slide = pres.addSlide()

    // Title
    slide.addText(event.name, { x: 0.5, y: 0.5, fontSize: 12, color: 'a0a0a0' })

    // Avatar
    slide.addImage({
      path: guest.lumaUser.avatarUrl,
      x: 1,
      y: 1,
      w: 1,
      h: 1,
    })
    // 名前
    slide.addText(guest.lumaUser.name ?? 'Anonymous', {
      x: 2.1,
      y: 1.5,
      color: '363636',
      fontSize: 24,
    })
    // SNS
    slide.addText(guest.answers.sns ?? '', {
      x: 2.1,
      y: 1.8,
      color: '727272',
      fontSize: 12,
    })
    // Demo
    slide.addText(guest.answers.demo ?? '', { x: 1, y: 3.5, color: '363636' })
  }

  const blob = await pres.stream({ compression: true })
  return new Response(blob, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${event.name}-guests.pptx"`,
    },
  })
}
