import { DownloadIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import Linkify from 'linkify-react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs, AppLinkButton } from '~/components'
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
        <CardBody px="4">
          <HStack align="start">
            <Heading size="md" mb="4">
              Guests
            </Heading>
            <Spacer />
            <AppLinkButton
              to={`/event/${event.id}/download`}
              isExternal
              rightIcon={<DownloadIcon />}
            >
              Download
            </AppLinkButton>
          </HStack>

          <Box rounded="md" border="1px solid" borderColor="gray.200">
            {guests.map((guest, idx) => {
              return (
                <Flex
                  key={guest.id}
                  direction={{ base: 'column', md: 'row' }}
                  gap={{ base: '0', md: '2' }}
                  _hover={{ bg: 'gray.100' }}
                  py="2"
                  px="4"
                  roundedTop={idx === 0 ? 'md' : undefined}
                  roundedBottom={idx === guests.length - 1 ? 'md' : undefined}
                  borderTop={idx === 0 ? '0' : '0.5px solid'}
                  borderBottom={idx === guests.length - 1 ? '0' : '0.5px solid'}
                  borderColor="gray.200"
                >
                  <HStack w={{ base: 'auto', md: '16rem' }} gap="4">
                    <Avatar size="sm" src={guest.lumaUser.avatarUrl}></Avatar>
                    <Box>
                      <Text>{guest.lumaUser.name ?? 'Anonymous'}</Text>

                      <Text
                        fontSize="xs"
                        color="gray.500"
                        wordBreak="break-all"
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
                    flex="1"
                    fontSize="sm"
                    color="gray.500"
                    p="1"
                    wordBreak="break-all"
                  >
                    <Linkify
                      options={{ defaultProtocol: 'https', target: '_blank' }}
                    >
                      {guest.answers.demo}
                    </Linkify>
                  </Box>
                </Flex>
              )
            })}
          </Box>
        </CardBody>
      </Card>
    </Stack>
  )
}
