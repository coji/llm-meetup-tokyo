import { Stack } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { AppBreadcrumbs } from '~/components'
import { EventCard } from '~/components/EventCard'
import { listLumaEvents } from '~/models'

export const loader = async ({ request }: LoaderArgs) => {
  const events = await listLumaEvents()
  return typedjson({ events })
}

export default function IndexPage() {
  const { events } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      <AppBreadcrumbs items={[{ label: 'Top', isCurrentPage: true }]} />

      <Stack spacing="4">
        {events.length === 0 ? (
          <div>no events</div>
        ) : (
          events.map((event) => (
            <EventCard to={`event/${event.id}`} event={event} key={event.id} />
          ))
        )}
      </Stack>
    </Stack>
  )
}
