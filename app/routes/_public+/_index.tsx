import type { LoaderArgs } from '@remix-run/node'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { EventCard } from '~/components/EventCard'
import { Stack } from '~/components/ui'
import { listLumaEvents } from '~/models'

export const loader = async ({ request }: LoaderArgs) => {
  const events = await listLumaEvents()
  return typedjson({ events })
}

export default function IndexPage() {
  const { events } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      {events.length === 0 ? (
        <div>no events</div>
      ) : (
        events.map((event) => (
          <EventCard to={`event/${event.id}`} event={event} key={event.id} />
        ))
      )}
    </Stack>
  )
}
