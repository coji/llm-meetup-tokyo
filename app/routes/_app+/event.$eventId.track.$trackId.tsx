import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { Outlet, useNavigate } from '@remix-run/react'
import Linkify from 'linkify-react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { DemoTrackCard } from '~/components/DemoTrackCard'
import { listEventGuests } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })

  const guests = await listEventGuests(eventId)

  return typedjson({ eventId, trackId, guests })
}

export default function DemoTrackDetailPage() {
  const { eventId, trackId, guests } = useTypedLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Stack>
      <DemoTrackCard
        flex="1"
        eventId={eventId}
        trackId={trackId}
        title="#3"
        state={{
          label: 'On Live',
          color: 'red',
        }}
        presenter={{
          name: 'Ryoichi Takahashi（Dory）',
          avatarUrl:
            'https://images.lumacdn.com/avatars/qx/54851b63-5b8b-4bf4-afb0-f2b8fb9ca6a0',
          sns: 'https://twitter.com/dory111111',
          demo: '自作のAI AgentフレームワークのMemoryの仕組みについてデモします！',
        }}
        host={{
          name: 'coji',
          avatarUrl:
            'https://images.lumacdn.com/avatars/zv/82b8cc3e-8d10-4b70-8b79-d5ffcc559cb8',
        }}
        zoomUrl="#"
        to={`/event/${eventId}/track/3`}
      >
        <Button size="sm" onClick={(e) => e.stopPropagation()}>
          Action
        </Button>
      </DemoTrackCard>

      <Card>
        <CardBody px="4">
          <HStack align="start">
            <Heading size="md" mb="4">
              Presenters
            </Heading>
          </HStack>
          <Box rounded="md" border="1px solid" borderColor="gray.200">
            {guests.map((guest, idx) => {
              return (
                <Flex
                  key={guest.id}
                  direction={{ base: 'column', md: 'row' }}
                  gap={{ base: '0', md: '2' }}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  py="2"
                  px="4"
                  roundedTop={idx === 0 ? 'md' : undefined}
                  roundedBottom={idx === guests.length - 1 ? 'md' : undefined}
                  borderTop={idx === 0 ? '0' : '0.5px solid'}
                  borderBottom={idx === guests.length - 1 ? '0' : '0.5px solid'}
                  borderColor="gray.200"
                  onClick={() => {
                    navigate(`${guest.id}`, {
                      preventScrollReset: true,
                    })
                  }}
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
          <Outlet />
        </CardBody>
      </Card>
    </Stack>
  )
}
