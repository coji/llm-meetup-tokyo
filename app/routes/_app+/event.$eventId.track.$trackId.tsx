import { Button, Stack } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { Outlet, Link as RemixLink } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { DemoTrackCard } from '~/components/DemoTrackCard'
import { getEventDemoTrack } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })

  const demoTrack = await getEventDemoTrack(trackId)

  return typedjson({ eventId, trackId, demoTrack })
}

export default function DemoTrackDetailPage() {
  const { eventId, trackId, demoTrack } = useTypedLoaderData<typeof loader>()

  return (
    <Stack>
      <DemoTrackCard
        flex="1"
        eventId={eventId}
        trackId={demoTrack.id}
        title={demoTrack.title}
        state={demoTrack.state}
        presenter={{
          name: demoTrack.currentPresenter?.lumaUser.name || '',
          avatarUrl: demoTrack.currentPresenter?.lumaUser.avatarUrl || '',
          sns: demoTrack.currentPresenter?.answers.sns,
          demo: demoTrack.currentPresenter?.answers.demo,
        }}
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
        to={`/event/${eventId}/track/${demoTrack.id}`}
      >
        <Button
          size="sm"
          as={RemixLink}
          to={`/event/${eventId}/track/${trackId}/next`}
          colorScheme="pink"
          onClick={(e) => e.stopPropagation()}
        >
          Next Presenter
        </Button>
      </DemoTrackCard>

      <Outlet />
    </Stack>
  )
}
