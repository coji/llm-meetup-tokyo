import { Stack } from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { getEventById } from '~/models/luma-event.server'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)

  return typedjson({ event })
}

export default function AdminEventDetailPage() {
  const { event } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Admin', to: '/admin' },
          { label: event.name, isCurrentPage: true },
        ]}
      />
    </Stack>
  )
}
