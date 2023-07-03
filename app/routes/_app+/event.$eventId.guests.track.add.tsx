import {
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
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { createDemoTrack, getEventById, listEventGuests } from '~/models'

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

  const formData = await zx.parseForm(request, {
    title: z.string().min(1).max(100),
    hostId: z.string().nonempty(),
    zoomUrl: z.string().optional(),
    state: z.enum(['In Preparation', 'On Live', 'Finished']),
  })

  const event = await getEventById(eventId)
  await createDemoTrack({ eventId: event.id, ...formData })

  return redirect('..')
}

export default function TrackAddPage() {
  const { guests } = useTypedLoaderData<typeof loader>()
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
          <Form id="track-edit-form" method="POST">
            <Stack>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" />
              </FormControl>

              <FormControl>
                <FormLabel>Host</FormLabel>
                <Select name="hostId">
                  <option></option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.lumaUser.name ?? 'Anonymous'}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Zoom URL</FormLabel>
                <Input name="zoomUrl" />
              </FormControl>

              <FormControl>
                <FormLabel>State</FormLabel>
                <RadioGroup name="state">
                  <Stack spacing="4" direction="row">
                    <Radio value="In Preparation">In Preparation</Radio>
                    <Radio value="On Live">On Live</Radio>
                    <Radio value="Finished">Finished</Radio>
                  </Stack>
                </RadioGroup>
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
