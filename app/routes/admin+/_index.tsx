import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Stack,
} from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { defer } from '@remix-run/node'
import { Await, Link, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { listLumaEvents } from '~/models/luma-event.server'

export const loader = ({ request }: LoaderArgs) => {
  const events = listLumaEvents()
  return defer({ events })
}

export default function AdminIndex() {
  const { events } = useLoaderData<typeof loader>()

  return (
    <Box>
      <HStack>
        <Heading size="md">Events</Heading>
        <Button as={Link} to="events/new" variant="link" size="sm">
          Add
        </Button>
      </HStack>
      <Box>
        <Suspense fallback="Loading...">
          <Await resolve={events}>
            {(events) => {
              if (events.length === 0) {
                return <div>no events</div>
              }

              return (
                <Stack>
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>{event.name}</CardHeader>
                      <CardBody>{event.startAt}</CardBody>
                    </Card>
                  ))}
                </Stack>
              )
            }}
          </Await>
        </Suspense>
      </Box>
    </Box>
  )
}
