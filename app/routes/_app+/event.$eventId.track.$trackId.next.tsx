import {
  Avatar,
  Box,
  Button,
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
  Text,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate, useSubmit } from '@remix-run/react'
import { useState } from 'react'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  getEventDemoTrack,
  searchEventGuests,
  setDemoTrackPresenter,
} from '~/models'

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
  const { trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  const { presenterId } = await zx.parseForm(request, {
    presenterId: z.string().min(1),
  })
  const demoTrack = await getEventDemoTrack(trackId)
  await setDemoTrackPresenter(demoTrack.id, presenterId)

  return redirect('..')
}

export default function TrackNextPresenterPage() {
  const { demoTrack, search, guests } = useTypedLoaderData<typeof loader>()
  const [selectedGuest, setSelectedGuest] = useState<
    (typeof guests)[0] | undefined
  >()
  const submit = useSubmit()
  const navigate = useNavigate()
  const handleOnClose = () => {
    navigate('..')
  }
  return (
    <Modal isOpen={true} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {demoTrack.currentPresenter
            ? 'Set First Presenter'
            : 'Set Next Presenter'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <HStack align="center" h="32px">
              <Text fontSize="sm" color="gray.500" fontWeight="bold">
                Selected
              </Text>
              {selectedGuest ? (
                <>
                  <Avatar
                    size="sm"
                    src={selectedGuest.lumaUser.avatarUrl}
                  ></Avatar>
                  <Text>{selectedGuest.lumaUser.name ?? 'Anonymous'}</Text>
                </>
              ) : (
                <Box fontSize="sm" color="gray.500">
                  未選択
                </Box>
              )}
            </HStack>
            <Form
              onChange={(e) => {
                submit(e.currentTarget, { method: 'GET' })
              }}
            >
              <Input
                type="search"
                name="search"
                placeholder="ゲストの名前を入力して検索"
                defaultValue={search}
              />
            </Form>

            <Box fontSize="sm" color="gray.600" fontWeight="bold">
              {search && <span>"{search}"の検索結果:</span>} {guests.length}人
            </Box>

            <Box maxH="60dvh" overflow="auto">
              <Stack spacing="1">
                {guests.map((guest) => {
                  return (
                    <HStack
                      key={guest.id}
                      py="1"
                      px="2"
                      rounded="md"
                      bg={
                        selectedGuest?.id === guest.id ? 'blue.200' : undefined
                      }
                      _hover={{ bg: 'gray.200' }}
                      onClick={() => {
                        setSelectedGuest(guest)
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
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter gap="2">
          <Form id="next-presenter-form" method="POST">
            <input
              type="hidden"
              name="presenterId"
              defaultValue={selectedGuest?.id}
            />
            <Button
              form="next-presenter-form"
              type="submit"
              isDisabled={!selectedGuest}
            >
              Submit
            </Button>
          </Form>

          <Spacer />
          <Button variant="ghost" onClick={handleOnClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
