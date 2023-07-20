import { Stack } from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { EventCard } from '~/components/EventCard'
import { getEventById } from '~/models'
import type { LumaEvent } from '~/services/database.server'

export const handle = {
  breadcrumb: ({ event }: { event: LumaEvent }) => ({
    label: event.name,
    to: `/event/${event.id}`,
  }),
}

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })
  const event = await getEventById(eventId)
  return typedjson({ event })
}

export default function EventDetailPage() {
  const { event } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      <EventCard
        event={event}
        key={event.id}
        to={`/event/${event.id}`}
        menu={[
          { label: 'Synchronize with luma', to: `/event/${event.id}/sync` },
          { label: 'embedding', to: `/event/${event.id}/embed` },
          { label: 'clustering', to: `/event/${event.id}/cluster` },
        ]}
      />

      <Outlet />
    </Stack>
  )
}
