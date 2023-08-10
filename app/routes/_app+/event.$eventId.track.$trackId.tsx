import type { LoaderArgs } from '@remix-run/node'
import { Link, Outlet, useNavigate } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { DemoTrackCard } from '~/components/DemoTrackCard'
import { EventGuestItem } from '~/components/EventGuestItem'
import {
  Button,
  Card,
  CardContent,
  HStack,
  Heading,
  Stack,
} from '~/components/ui'
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
          <Button asChild onClick={(e) => e.stopPropagation()}>
            <Link to={`/event/${eventId}/track/${trackId}/next`}>
              Set Presenter
            </Link>
          </Button>
        )}
      </DemoTrackCard>

      <Card>
        <CardContent>
          <HStack>
            <Heading>Presenters</Heading>
          </HStack>
          {presenters.length > 0 ? (
            <div className="rounded border border-solid">
              {presenters.map((presenter, idx) => {
                return (
                  <Stack
                    key={`${idx}-${presenter.id}`}
                    className={`cursor-pointer gap-0 border-slate-200 px-4 py-2  md:gap-2 ${
                      idx === 0
                        ? 'rounded-b-md rounded-t-md'
                        : 'border-y-[0.5px] border-solid'
                    }`}
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
            </div>
          ) : (
            <p className="text-center text-slate-500">No presenters yet.</p>
          )}
        </CardContent>
      </Card>

      <Outlet />
    </Stack>
  )
}
