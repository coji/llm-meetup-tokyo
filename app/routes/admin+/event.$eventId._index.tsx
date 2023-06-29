import { Box, HStack, Stack } from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import dayjs from 'dayjs'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { getEventById, listEventGuests } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)
  const guests = await listEventGuests(eventId)

  return typedjson({ event, guests })
}

export default function AdminEventDetailPage() {
  const { event, guests } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Admin', to: '/admin' },
          { label: event.name, isCurrentPage: true },
        ]}
      />

      <Stack>
        {guests.map((guest, idx) => {
          return (
            <HStack key={guest.id}>
              <Box>{idx + 1}</Box>
              <Box>{dayjs(guest.createdAt).format('YYYY-MM-DD HH:mm')}</Box>
              <Box>{JSON.stringify(guest.lumaUser.name ?? 'Anonymous')}</Box>
              <Box>{guest.approvalStatus}</Box>
            </HStack>
          )
        })}
      </Stack>
    </Stack>
  )
}
