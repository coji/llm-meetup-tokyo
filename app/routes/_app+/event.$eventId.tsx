import { Stack } from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { EventCard } from '~/components/EventCard'
import { getEventById } from '~/models'

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
      <AppBreadcrumbs
        items={[
          { label: 'Top', to: '/' },
          { label: event.name, isCurrentPage: true },
        ]}
      />

      <EventCard
        event={event}
        key={event.id}
        to={`/event/${event.id}`}
        menu={[
          { label: 'Sync', to: `/event/${event.id}/sync` },
          { label: 'Add Demo Track', to: `/event/${event.id}/track/new` },
        ]}
      ></EventCard>

      <Outlet />
    </Stack>
  )
}
