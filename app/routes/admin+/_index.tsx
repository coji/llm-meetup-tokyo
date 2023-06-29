import { Button, Grid, HStack, Spacer, Stack } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { Link as RemixLink } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { AppBreadcrumbs, AppExternalLinkButton } from '~/components'
import { EventCard } from '~/components/EventCard'
import { listLumaEvents } from '~/models'

export const loader = async ({ request }: LoaderArgs) => {
  const events = await listLumaEvents()
  return typedjson({ events })
}

export default function AdminIndex() {
  const { events } = useTypedLoaderData<typeof loader>()

  return (
    <Grid gridTemplateRows="auto 1fr" gap="4">
      <HStack align="start">
        <AppBreadcrumbs items={[{ label: 'Admin', isCurrentPage: true }]} />

        <Spacer />
        <Button
          as={RemixLink}
          to="event/import"
          size="xs"
          variant="outline"
          colorScheme="blue"
        >
          Import
        </Button>
      </HStack>

      <Stack spacing="4">
        {events.length === 0 ? (
          <div>no events</div>
        ) : (
          events.map((event) => (
            <EventCard
              to={`event/${event.id}`}
              event={event}
              key={event.id}
              action={
                <HStack>
                  <AppExternalLinkButton url={event.url} />

                  <Button
                    size="sm"
                    as={RemixLink}
                    to={`event/${event.id}/sync`}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    Sync
                  </Button>
                </HStack>
              }
            />
          ))
        )}
      </Stack>
    </Grid>
  )
}
