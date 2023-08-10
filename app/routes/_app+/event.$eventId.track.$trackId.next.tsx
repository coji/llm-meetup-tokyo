import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate, useSubmit } from '@remix-run/react'
import { useState } from 'react'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  HStack,
  Input,
  Label,
  Spacer,
  Stack,
  Switch,
} from '~/components/ui'
import {
  getEventDemoTrack,
  searchEventGuests,
  setDemoTrackCurrentPresenter,
} from '~/models'
import { sendNextPresenterNotifyToDiscord } from '~/services/discord-notify.server'
import { emitter } from '~/services/emitter.server'

export const loader = async ({ params, request }: LoaderArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  const query = zx.parseQuerySafe(request, {
    search: z.string().optional(),
  })
  const search = query.success ? query.data.search : undefined
  const demoTrack = await getEventDemoTrack(trackId)
  const guests = await searchEventGuests(eventId, search)
  return typedjson({ demoTrack, search, guests })
}

export const action = async ({ request, params }: ActionArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  const { presenterId, isPushDiscord } = await zx.parseForm(request, {
    presenterId: z.string().optional(),
    isPushDiscord: zx.BoolAsString,
  })
  const demoTrack = await getEventDemoTrack(trackId)
  await setDemoTrackCurrentPresenter(demoTrack.id, presenterId)

  emitter.emit('event', eventId) // イベント更新をリアルタイム通知
  // discord に通知
  if (isPushDiscord && presenterId) {
    await sendNextPresenterNotifyToDiscord({
      eventId,
      trackId,
      presenterGuestId: presenterId,
    })
  }

  return redirect('..')
}

export default function TrackNextPresenterPage() {
  const { demoTrack, search, guests } = useTypedLoaderData<typeof loader>()
  const [selectedGuest, setSelectedGuest] = useState<
    (typeof guests)[0] | undefined
  >(demoTrack.currentPresenter ?? undefined)
  const submit = useSubmit()
  const navigate = useNavigate()
  const handleOnClose = () => {
    navigate('..')
  }
  return (
    <Dialog open onOpenChange={handleOnClose}>
      <DialogContent className="max-h-[80dvh]">
        <DialogHeader>
          <DialogTitle>Set Presenter</DialogTitle>
        </DialogHeader>
        <Stack>
          <Form id="next-presenter-form" method="POST">
            <Stack>
              <HStack className="h-[64px]">
                <p className="text-sm font-bold text-slate-500">Selected</p>
                {selectedGuest ? (
                  <>
                    <input
                      type="hidden"
                      name="presenterId"
                      defaultValue={selectedGuest?.id}
                    />
                    <Avatar>
                      <AvatarImage src={selectedGuest.lumaUser.avatarUrl} />
                      <AvatarFallback>
                        {selectedGuest.lumaUser.name}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{selectedGuest.lumaUser.name ?? 'Anonymous'}</p>
                      <p className="text-xs text-slate-500">
                        {selectedGuest.answers.sns}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">未選択</p>
                )}
              </HStack>

              <fieldset className="flex items-center">
                <Label>Discordに通知</Label>
                <Switch
                  name="isPushDiscord"
                  defaultChecked
                  defaultValue="true"
                />
              </fieldset>
            </Stack>
          </Form>

          <Form
            onChange={(e) => {
              submit(e.currentTarget, { method: 'GET' })
            }}
          >
            <Input
              type="search"
              name="search"
              placeholder="ゲスト名の一部を入力して検索"
              defaultValue={search}
            />
          </Form>

          <div className="text-sm font-bold text-slate-500">
            {search && <span>"{search}"の検索結果:</span>} {guests.length}人
            アルファベット順
          </div>

          <Stack>
            {guests.map((guest) => {
              const isSelected = selectedGuest?.id === guest.id
              return (
                <HStack
                  key={guest.id}
                  className={`cursor-pointer rounded px-2 py-1 hover:bg-slate-200 ${
                    isSelected ? 'text-blue-200' : ''
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedGuest(undefined)
                    } else {
                      setSelectedGuest(guest)
                    }
                  }}
                >
                  <Avatar>
                    <AvatarImage src={guest.lumaUser.avatarUrl} />
                    <AvatarFallback>{guest.lumaUser.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{guest.lumaUser.name ?? 'Anonymous'}</p>
                    <p className="text-xs text-slate-500">
                      {guest.answers.sns}
                    </p>
                  </div>
                </HStack>
              )
            })}
          </Stack>
        </Stack>

        <DialogFooter className="gap-2">
          <Button form="next-presenter-form" type="submit">
            Submit
          </Button>

          <Spacer />
          <Button variant="ghost" type="button" onClick={handleOnClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
