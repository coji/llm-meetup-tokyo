import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { Outlet, Link as RemixLink, useNavigate } from '@remix-run/react'
import { GiPlayerNext } from 'react-icons/gi'
import { MdStart } from 'react-icons/md'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { DemoTrackCard } from '~/components/DemoTrackCard'
import { EventGuestItem } from '~/components/EventGuestItem'
import { getEventDemoTrack, listDemoTrackPresenters } from '~/models'
import type { DemoTrack } from '~/services/database.server'

export const handle = {
  breadcrumb: ({
    eventId,
    demoTrack,
  }: {
    eventId: string
    demoTrack: DemoTrack
  }) => ({
    label: demoTrack.title,
    to: `/event/${eventId}/track/${demoTrack.id}`,
  }),
}

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })

  const demoTrack = await getEventDemoTrack(trackId)
  const presenters = await listDemoTrackPresenters(trackId)

  return typedjson({ eventId, trackId, demoTrack, presenters })
}

export default function DemoTrackDetailPage() {
  const { eventId, trackId, demoTrack, presenters } =
    useTypedLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Stack>
      <DemoTrackCard
        eventId={eventId}
        trackId={demoTrack.id}
        title={demoTrack.title}
        state={demoTrack.state}
        presenter={
          demoTrack.currentPresenter
            ? {
                name: demoTrack.currentPresenter.lumaUser.name || 'Anonymous',
                avatarUrl: demoTrack.currentPresenter.lumaUser.avatarUrl,
                sns: demoTrack.currentPresenter.answers.sns,
                demo: demoTrack.currentPresenter.answers.demo,
              }
            : undefined
        }
        host={{
          name: demoTrack.host.lumaUser.name ?? 'Anonymous',
          avatarUrl: demoTrack.host.lumaUser.avatarUrl,
        }}
        zoomUrl={demoTrack.zoomUrl ?? ''}
        menu={[
          { label: 'Edit', to: `/event/${eventId}/track/${demoTrack.id}/edit` },
          {
            label: 'Delete',
            to: `/event/${eventId}/track/${demoTrack.id}/delete`,
          },
        ]}
      >
        {demoTrack.state !== 'finished' && (
          <Button
            as={RemixLink}
            to={`/event/${eventId}/track/${trackId}/next`}
            colorScheme="pink"
            rightIcon={
              demoTrack.currentPresenter ? <GiPlayerNext /> : <MdStart />
            }
            onClick={(e) => e.stopPropagation()}
          >
            Set Presenter
          </Button>
        )}
      </DemoTrackCard>

      <Card>
        <CardBody px="4">
          <HStack align="start">
            <Heading size="md" mb="4">
              Presenters
            </Heading>
          </HStack>
          {presenters.length > 0 ? (
            <Box rounded="md" border="1px solid" borderColor="gray.200">
              {presenters.map((presenter, idx) => {
                return (
                  <Stack
                    key={`${idx}-${presenter.id}`}
                    gap={{ base: '0', md: '2' }}
                    _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    py="2"
                    px="4"
                    roundedTop={idx === 0 ? 'md' : undefined}
                    roundedBottom={
                      idx === presenters.length - 1 ? 'md' : undefined
                    }
                    borderTop={idx === 0 ? '0' : '0.5px solid'}
                    borderBottom={
                      idx === presenters.length - 1 ? '0' : '0.5px solid'
                    }
                    borderColor="gray.200"
                    onClick={() => {
                      navigate(`presenter/${presenter.id}`, {
                        preventScrollReset: true,
                      })
                    }}
                  >
                    <EventGuestItem
                      name={presenter.lumaUser.name ?? 'Anonymous'}
                      sns={presenter.answers.sns}
                      avatarUrl={presenter.lumaUser.avatarUrl}
                      demo={presenter.answers.demo}
                      clusterIndex={presenter.clusterIndex ?? undefined}
                    />
                  </Stack>
                )
              })}
            </Box>
          ) : (
            <Text textAlign="center" color="gray.500">
              No presenters yet.
            </Text>
          )}
        </CardBody>
      </Card>

      <Outlet />
    </Stack>
  )
}
