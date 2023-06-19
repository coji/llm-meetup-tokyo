import type { Prisma } from '@prisma/client'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { upsertEventGuests } from '~/models/event-guest.server'

export const action = async ({ request }: ActionArgs) => {
  const body = (await request.json()) as {
    rows: Prisma.EventGuestUncheckedCreateInput[]
  }
  await upsertEventGuests(
    1,
    body.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      fullName: row.fullName,
      company: row.company,
      content: row.content,
      sns: row.sns,
    })),
  )
  return json({})
}
