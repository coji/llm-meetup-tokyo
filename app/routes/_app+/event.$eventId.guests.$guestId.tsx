import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import dayjs from 'dayjs'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
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
    <Drawer
      placement="right"
      size={{ base: 'xs', sm: 'sm' }}
      isOpen={true}
      onClose={() => {
        navigate('..', { preventScrollReset: true })
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          <DrawerCloseButton />

          <Stack>
            <Heading>{guest.lumaUser.name ?? 'Anonymous'}</Heading>

            <Form method="POST">
              <Stack>
                <FormControl>
                  <FormLabel>
                    飛び入りデモでどのような内容をお話されたいか教えて下さい。
                  </FormLabel>
                  <Input name="demo" defaultValue={guest.answers.demo}></Input>
                </FormControl>

                <Button type="submit">Submit</Button>
              </Stack>
            </Form>

            {editLog.length > 0 && (
              <Stack w="full" overflow="auto">
                <Heading size="sm">編集履歴</Heading>
                <Stack>
                  {editLog.map((log) => (
                    <HStack key={log.id} align="start">
                      <Stack>
                        <Text fontSize="sm">
                          {dayjs(log.createdAt).fromNow()}
                        </Text>
                        <HStack>
                          <Avatar
                            size="sm"
                            src={log.user.photoUrl || ''}
                            name={log.user.displayName}
                          />
                          <Text>{log.user.displayName}</Text>
                        </HStack>
                      </Stack>

                      <Stack fontSize="xs">
                        <Box>
                          <Text fontWeight="bold">編集前</Text>
                          <Text>{log.oldValue}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">編集後</Text>
                          <Text>{log.newValue}</Text>
                        </Box>
                      </Stack>
                    </HStack>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
