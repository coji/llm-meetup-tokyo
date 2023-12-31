import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppLinkButton } from '~/components'
import { DemoTrackCard } from '~/components/DemoTrackCard'
import { EventGuestItem } from '~/components/EventGuestItem'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  Spacer,
  Stack,
} from '~/components/ui'
import { useEventUpdater } from '~/hooks/use-event-updater'
import { listEventDemoTracks, listEventGuests } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const guests = await listEventGuests(eventId)
  const demoTracks = await listEventDemoTracks(eventId)

  return json({ eventId, guests, demoTracks })
}

export default function EventDetailPage() {
  const { eventId, guests, demoTracks } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  useEventUpdater() // イベント関連情報が更新されたら自動でデータを読み直す

  return (
    <Stack>
      <Card>
        <CardHeader>
          <HStack>
            <CardTitle>Demo Tracks</CardTitle>
            <Spacer />
            <AppLinkButton to={`/event/${eventId}/guests/track/add`}>
              Add
            </AppLinkButton>
          </HStack>
        </CardHeader>
        <CardContent>
          {demoTracks.length > 0 ? (
            <div className="flex flex-wrap gap-4">
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
            </div>
          ) : (
            <p className="text-center text-slate-500">No demo tracks yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <HStack>
            <CardTitle>Guests</CardTitle>
            <Spacer />
            <AppLinkButton to={`/event/${eventId}/download`} isExternal>
              Download
            </AppLinkButton>
          </HStack>
        </CardHeader>
        <CardContent>
          <div className="rounded border border-solid border-slate-200">
            {guests.map((guest, idx) => {
              const isFirst = idx === 0
              const isLast = idx === guests.length - 1
              return (
                <Stack
                  key={guest.id}
                  className={`border-solid border-slate-200 px-4 py-2 hover:bg-slate-100 md:gap-2
                  ${isFirst ? 'rounded-t-md' : 'border-t'}
                  ${isLast ? '' : 'rounded-b-md'}`}
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
          </div>

          <Outlet />
        </CardContent>
      </Card>
    </Stack>
  )
}
