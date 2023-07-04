import {
  Button,
  FormControl,
  FormErrorMessage,
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
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { createDemoTrack, getEventById, listEventGuests } from '~/models'
import { demoTrackSchema } from '~/schemas/model'
import { emitter } from '~/services/emitter.server'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const guests = await listEventGuests(eventId)
  return typedjson({ eventId, guests })
}

export const action = async ({ params, request }: ActionArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const formData = await zx.parseForm(request, demoTrackSchema)
  const event = await getEventById(eventId)
  await createDemoTrack({ eventId: event.id, ...formData })
  emitter.emit('event', eventId) // イベント更新をリアルタイム通知

  return redirect('..')
}

export default function TrackAddPage() {
  const { guests } = useTypedLoaderData<typeof loader>()
  const [form, { title, hostId, zoomUrl, state }] = useForm({
    defaultValue: { state: 'In Preparation' },
    onValidate({ formData }) {
      return parse(formData, { schema: demoTrackSchema })
    },
  })
  const navigate = useNavigate()
  const handleOnClose = () => {
    navigate('..')
  }

  return (
    <Modal isOpen={true} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a demo track</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form id="track-edit-form" method="POST" {...form.props}>
            <Stack>
              <FormControl isInvalid={!!title.error}>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name={title.name}
                  defaultValue={title.defaultValue}
                  autoFocus
                />
                <FormErrorMessage>{title.error}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!hostId.error}>
                <FormLabel>Host</FormLabel>
                <Select name={hostId.name} defaultValue={hostId.defaultValue}>
                  <option></option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.lumaUser.name ?? 'Anonymous'}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{hostId.error}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!zoomUrl.error}>
                <FormLabel>
                  Zoom URL{' '}
                  <Text display="inline" fontSize="xs" color="gray.400">
                    Optional
                  </Text>
                </FormLabel>
                <Input
                  name={zoomUrl.name}
                  defaultValue={zoomUrl.defaultValue}
                />
                <FormErrorMessage>{zoomUrl.error}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!state.error}>
                <FormLabel>State</FormLabel>
                <RadioGroup name={state.name} defaultValue={state.defaultValue}>
                  <HStack spacing="4">
                    <Radio value="In Preparation" defaultChecked>
                      In Preparation
                    </Radio>
                    <Radio value="On Live">On Live</Radio>
                    <Radio value="Finished">Finished</Radio>
                  </HStack>
                </RadioGroup>
                <FormErrorMessage>{state.error}</FormErrorMessage>
              </FormControl>
            </Stack>
          </Form>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button type="submit" form="track-edit-form">
              Submit
            </Button>
            <Spacer />
            <Button onClick={handleOnClose} variant="ghost">
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
