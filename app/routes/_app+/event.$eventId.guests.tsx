import {
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
import { Outlet, useNavigate } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppLinkButton } from '~/components'
import { DemoTrackCard } from '~/components/DemoTrackCard'
import { EventGuestItem } from '~/components/EventGuestItem'
import { useEventUpdater } from '~/hooks/use-event-updater'
import { listEventDemoTracks, listEventGuests } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const guests = await listEventGuests(eventId)
  const demoTracks = await listEventDemoTracks(eventId)

  return typedjson({ eventId, guests, demoTracks })
}

export default function EventDetailPage() {
  const { eventId, guests, demoTracks } = useTypedLoaderData<typeof loader>()
  const navigate = useNavigate()
  useEventUpdater() // イベント関連情報が更新されたら自動でデータを読み直す

  return (
    <Stack>
      <Card>
        <CardBody>
          <Stack>
            <HStack align="start">
              <Heading size="md" mb="4">
                Demo Tracks
              </Heading>
              <Spacer />
              <AppLinkButton to={`/event/${eventId}/guests/track/add`}>
                Add
              </AppLinkButton>
            </HStack>

            {demoTracks.length > 0 ? (
              <Flex flexWrap="wrap" gap="4">
                {demoTracks.map((demoTrack) => (
                  <DemoTrackCard
                    key={demoTrack.id}
                    eventId={eventId}
                    trackId={demoTrack.id}
                    title={demoTrack.title}
                    state={demoTrack.state}
                    presenter={
                      demoTrack.currentPresenter
                        ? {
                            name:
                              demoTrack.currentPresenter.lumaUser.name ??
                              'Anonymous',
                            avatarUrl:
                              demoTrack.currentPresenter.lumaUser.avatarUrl,
                            demo: demoTrack.currentPresenter.answers.demo,
                          }
                        : undefined
                    }
                    host={{
                      name: demoTrack.host.lumaUser.name ?? 'Anonymous',
                      avatarUrl: demoTrack.host.lumaUser.avatarUrl,
                    }}
                    zoomUrl={demoTrack.zoomUrl ?? undefined}
                    to={`/event/${eventId}/track/${demoTrack.id}`}
                  />
                ))}
              </Flex>
            ) : (
              <Text textAlign="center" color="gray.500">
                No demo tracks yet.
              </Text>
            )}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody px="4">
          <HStack align="start">
            <Heading size="md" mb="4">
              Guests
            </Heading>
            <Spacer />
            <AppLinkButton to={`/event/${eventId}/download`} isExternal>
              Download
            </AppLinkButton>
          </HStack>

          <Box rounded="md" border="1px solid" borderColor="gray.200">
            {guests.map((guest, idx) => {
              return (
                <Stack
                  key={guest.id}
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
                  <EventGuestItem
                    name={guest.lumaUser.name ?? 'Anonymous'}
                    sns={guest.answers.sns}
                    avatarUrl={guest.lumaUser.avatarUrl}
                    demo={guest.answers.demo}
                    clusterIndex={guest.clusterIndex ?? undefined}
                  />
                </Stack>
              )
            })}
          </Box>

          <Outlet />
        </CardBody>
      </Card>
    </Stack>
  )
}
