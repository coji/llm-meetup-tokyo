import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import dayjs from 'dayjs'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  HStack,
  Heading,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  Stack,
} from '~/components/ui'
import {
  addLumaEventGuestDemoEditLog,
  getEventGuestById,
  listLumaEventGuestDemoEditLogs,
  updateEventGuest,
} from '~/models'
import { requireUser } from '~/services/auth.server'
import { emitter } from '~/services/emitter.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  const { guestId } = zx.parseParams(params, {
    guestId: z.string(),
  })
  const guest = await getEventGuestById(guestId)
  const editLog = await listLumaEventGuestDemoEditLogs(guestId)

  return json({ guest, editLog })
}

export const action = async ({ request, params }: ActionArgs) => {
  const user = await requireUser(request)
  const { eventId, guestId } = zx.parseParams(params, {
    eventId: z.string(),
    guestId: z.string(),
  })

  const { demo } = await zx.parseForm(request, {
    demo: z.string().min(1),
  })

  const guest = await getEventGuestById(guestId)
  if (guest.answers.demo === demo) {
    // 更新ないのでスルー
    return redirect('..')
  }

  await updateEventGuest(guestId, { demo })
  await addLumaEventGuestDemoEditLog({
    userId: user.id,
    lumaEventGuestId: guestId,
    oldValue: guest.answers.demo,
    newValue: demo,
  })
  emitter.emit('event', eventId) // イベント更新をリアルタイム通知

  return redirect('..')
}

export default function GuestEditPage() {
  const { guest, editLog } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Sheet
      defaultOpen
      onOpenChange={() => {
        navigate('..', { preventScrollReset: true })
      }}
    >
      <SheetContent>
        <SheetTitle>{guest.lumaUser.name ?? 'Anonymous'}</SheetTitle>
        <SheetClose />

        <Stack>
          <Form method="POST">
            <Stack>
              <fieldset>
                <Label>
                  飛び入りデモでどのような内容をお話されたいか教えて下さい。
                </Label>
                <Input name="demo" defaultValue={guest.answers.demo}></Input>
              </fieldset>

              <Button type="submit">Submit</Button>
            </Stack>
          </Form>

          {editLog.length > 0 && (
            <Stack className="overflow-auto">
              <Heading size="sm">編集履歴</Heading>
              <Stack className="text-sm">
                {editLog.map((log) => (
                  <Stack key={log.id} direction="row">
                    <Stack>
                      <HStack>
                        <Avatar>
                          <AvatarImage src={log.user.photoUrl || ''} />
                          <AvatarFallback>
                            {log.user.displayName}
                          </AvatarFallback>
                        </Avatar>
                        <p>{log.user.displayName}</p>
                      </HStack>
                      <p>{dayjs(log.createdAt).fromNow()}</p>
                    </Stack>

                    <Stack className="text-xs">
                      <div>
                        <p className="font-bold">編集前</p>
                        <div>{log.oldValue}</div>
                      </div>
                      <div>
                        <p className="font-bold">編集後</p>
                        <div>{log.newValue}</div>
                      </div>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </SheetContent>
    </Sheet>
  )
}
