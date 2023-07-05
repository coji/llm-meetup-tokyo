import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate, useNavigation, useSubmit } from '@remix-run/react'
import { useState } from 'react'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
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
  const navigation = useNavigation()
  const navigate = useNavigate()
  const handleOnClose = () => {
    navigate('..')
  }
  return (
    <Modal isOpen={true} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent maxH="80dvh">
        <ModalHeader>Set Presenter</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto">
          <Form id="next-presenter-form" method="POST">
            <Stack>
              <HStack align="center" h="64px">
                <Text fontSize="sm" color="gray.500" fontWeight="bold">
                  Selected
                </Text>
                {selectedGuest ? (
                  <>
                    <input
                      type="hidden"
                      name="presenterId"
                      defaultValue={selectedGuest?.id}
                    />
                    <Avatar size="md" src={selectedGuest.lumaUser.avatarUrl} />
                    <Box>
                      <Text>{selectedGuest.lumaUser.name ?? 'Anonymous'}</Text>
                      <Text color="gray.500" fontSize="xs">
                        {selectedGuest.answers.sns}
                      </Text>
                    </Box>
                  </>
                ) : (
                  <Box fontSize="sm" color="gray.500">
                    未選択
                  </Box>
                )}
              </HStack>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Discordに通知</FormLabel>
                <Switch name="isPushDiscord" defaultChecked value="true" />
              </FormControl>
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

          <Box fontSize="sm" color="gray.600" fontWeight="bold">
            {search && <span>"{search}"の検索結果:</span>} {guests.length}人
            アルファベット順
          </Box>

          <Stack flex="1" spacing="1">
            {guests.map((guest) => {
              return (
                <HStack
                  key={guest.id}
                  py="1"
                  px="2"
                  rounded="md"
                  bg={selectedGuest?.id === guest.id ? 'blue.200' : undefined}
                  _hover={{ bg: 'gray.200', cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedGuest?.id === guest.id) {
                      setSelectedGuest(undefined)
                    } else {
                      setSelectedGuest(guest)
                    }
                  }}
                >
                  <Avatar size="sm" src={guest.lumaUser.avatarUrl}></Avatar>
                  <Box>
                    <Text>{guest.lumaUser.name ?? 'Anonymous'}</Text>
                    <Text color="gray.500" fontSize="xs">
                      {guest.answers.sns}
                    </Text>
                  </Box>
                </HStack>
              )
            })}
          </Stack>
        </ModalBody>

        <ModalFooter gap="2">
          <Button
            form="next-presenter-form"
            type="submit"
            isLoading={navigation.state !== 'idle'}
          >
            Submit
          </Button>

          <Spacer />
          <Button variant="ghost" onClick={handleOnClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
