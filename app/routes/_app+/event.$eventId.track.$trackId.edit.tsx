import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
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
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Stack,
} from '~/components/ui'
import { getEventDemoTrack, listEventGuests, updateDemoTrack } from '~/models'
import { demoTrackSchema } from '~/schemas/model'
import { emitter } from '~/services/emitter.server'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  const demoTrack = await getEventDemoTrack(trackId)
  const guests = await listEventGuests(eventId)
  return typedjson({ eventId, trackId, demoTrack, guests })
}

export const action = async ({ params, request }: ActionArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  const formData = await zx.parseForm(request, demoTrackSchema)
  await updateDemoTrack(trackId, formData)
  emitter.emit('event', eventId) // イベント更新をリアルタイム通知

  return redirect('..')
}

export default function TrackEditPage() {
  const { demoTrack, guests } = useTypedLoaderData<typeof loader>()
  const [form, { title, hostId, zoomUrl, state }] = useForm({
    id: 'track-edit-form',
    defaultValue: demoTrack,
    onValidate({ formData }) {
      return parse(formData, { schema: demoTrackSchema })
    },
  })
  const navigate = useNavigate()
  const handleOnClose = () => {
    navigate('..')
  }

  return (
    <Dialog open onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit a demo track</DialogTitle>
        </DialogHeader>

        <Form method="POST" {...form.props}>
          <Stack>
            <fieldset>
              <Label id={title.id}>Title</Label>
              <Input {...conform.input(title)} autoFocus />
              <div className="text-destructive">{title.error}</div>
            </fieldset>

            <fieldset>
              <Label>Host</Label>
              <Select name={hostId.name} defaultValue={hostId.defaultValue}>
                <SelectTrigger id={hostId.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-auto">
                  {guests.map((guest) => (
                    <SelectItem key={guest.id} value={guest.id}>
                      <HStack>
                        <Avatar className="mr-2">
                          <AvatarImage
                            src={guest.lumaUser.avatarUrl}
                            loading="lazy"
                          />
                          <AvatarFallback>{guest.lumaUser.name}</AvatarFallback>
                        </Avatar>

                        <p>{guest.lumaUser.name ?? 'Anonymous'}</p>
                      </HStack>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-destructive">{hostId.error}</div>
            </fieldset>

            <fieldset>
              <Label htmlFor={zoomUrl.id}>
                Zoom URL{' '}
                <span className="text-xs text-slate-400">Optional</span>
              </Label>
              <Input
                {...conform.input(zoomUrl)}
                name={zoomUrl.name}
                defaultValue={zoomUrl.defaultValue}
              />
              <div className="text-destructive">{zoomUrl.error}</div>
            </fieldset>

            <fieldset>
              <Label htmlFor={state.id}>State</Label>
              <RadioGroup name={state.name} defaultValue={state.defaultValue}>
                <Stack>
                  <HStack>
                    <RadioGroupItem
                      value="In Preparation"
                      id="preparation"
                      defaultChecked
                    />
                    <Label htmlFor="preparation">In Preparation</Label>
                  </HStack>

                  <HStack>
                    <RadioGroupItem value="On Live" id="online" />
                    <Label htmlFor="online">On Live</Label>
                  </HStack>

                  <HStack>
                    <RadioGroupItem value="Finished" id="finished" />
                    <Label htmlFor="finished">Finished</Label>
                  </HStack>
                </Stack>
              </RadioGroup>
              <div className="text-destructive">{state.error}</div>
            </fieldset>
          </Stack>
        </Form>

        <DialogFooter>
          <Button type="submit" form={form.id}>
            Submit
          </Button>
          <Spacer />
          <Button type="button" onClick={handleOnClose} variant="ghost">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
