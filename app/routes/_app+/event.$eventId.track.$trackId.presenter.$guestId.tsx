import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import dayjs from 'dayjs'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
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

  return typedjson({ guest, editLog })
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
  const { guest, editLog } = useTypedLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Sheet
      open
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
                <Label htmlFor="demo">
                  飛び入りデモでどのような内容をお話されたいか教えて下さい。
                </Label>
                <Input
                  id="demo"
                  name="demo"
                  defaultValue={guest.answers.demo}
                ></Input>
              </fieldset>

              <Button type="submit">Submit</Button>
            </Stack>
          </Form>

          {editLog.length > 0 && (
            <Stack className="overflow-auto">
              <Heading size="sm">編集履歴</Heading>
              <Stack>
                {editLog.map((log) => (
                  <HStack key={log.id}>
                    <Stack>
                      <p className="text-sm">
                        {dayjs(log.createdAt).fromNow()}
                      </p>
                      <HStack>
                        <Avatar>
                          <AvatarImage src={log.user.photoUrl || ''} />
                          <AvatarFallback>
                            {' '}
                            {log.user.displayName}
                          </AvatarFallback>
                        </Avatar>
                        <p>{log.user.displayName}</p>
                      </HStack>
                    </Stack>

                    <Stack className="text-xs">
                      <div>
                        <p className="font-bold">編集前</p>
                        <p>{log.oldValue}</p>
                      </div>
                      <div>
                        <p className="font-bold">編集後</p>
                        <p>{log.newValue}</p>
                      </div>
                    </Stack>
                  </HStack>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </SheetContent>
    </Sheet>
  )
}
