import {
  Avatar,
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import Linkify from 'linkify-react'
import React from 'react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { EventCard } from '~/components/EventCard'
import { getEventById, listEventGuests } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)
  const guests = await listEventGuests(eventId)

  return typedjson({ event, guests })
}

export default function EventDetailPage() {
  const { event, guests } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Top', to: '/' },
          { label: event.name, isCurrentPage: true },
        ]}
      />

      <EventCard event={event} key={event.id} />

      <Card>
        <CardBody>
          <Heading size="md" mb="4">
            Guests
          </Heading>
          <Grid
            gridTemplateColumns={{ base: 'auto', md: 'auto 1fr' }}
            gap="2"
            alignItems="stretch"
          >
            {guests.map((guest) => {
              return (
                <React.Fragment key={guest.id}>
                  <HStack p="1">
                    <Avatar size="xs" src={guest.lumaUser.avatarUrl}></Avatar>
                    <Box maxW="12rem">
                      <Text color="gray.600">
                        {guest.lumaUser.name ?? 'Anonymous'}
                      </Text>

                      <Text
                        fontSize="xs"
                        color="gray.400"
                        wordBreak="break-word"
                      >
                        <Linkify
                          options={{
                            defaultProtocol: 'https',
                            target: '_blank',
                          }}
                        >
                          {guest.answers.sns}
                        </Linkify>
                      </Text>
                    </Box>
                  </HStack>

                  <Box
                    fontSize="sm"
                    color="gray.600"
                    p="1"
                    roundedRight="md"
                    wordBreak="break-word"
                  >
                    <Linkify
                      options={{ defaultProtocol: 'https', target: '_blank' }}
                    >
                      {guest.answers.demo}
                    </Linkify>
                  </Box>
                </React.Fragment>
              )
            })}
          </Grid>
        </CardBody>
      </Card>
    </Stack>
  )
}
