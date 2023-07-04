import {
  Button,
  FormControl,
  FormLabel,
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
import { getEventDemoTrack, listEventGuests, updateDemoTrack } from '~/models'
import { demoTrackSchema } from '~/schemas/model'

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
  const { trackId } = zx.parseParams(params, { trackId: zx.NumAsString })
  const formData = await zx.parseForm(request, demoTrackSchema)
  await updateDemoTrack(trackId, formData)
  return redirect('..')
}

export default function TrackEditPage() {
  const { demoTrack, guests } = useTypedLoaderData<typeof loader>()
  const navigate = useNavigate()
  const handleOnClose = () => {
    navigate('..')
  }

  return (
    <Modal isOpen={true} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit a demo track</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form id="track-edit-form" method="POST">
            <Stack>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" defaultValue={demoTrack.title} />
              </FormControl>

              <FormControl>
                <FormLabel>Host</FormLabel>
                <Select name="hostId" defaultValue={demoTrack.hostId}>
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
                <Input
                  name="zoomUrl"
                  defaultValue={demoTrack.zoomUrl ?? undefined}
                />
              </FormControl>

              <FormControl>
                <FormLabel>State</FormLabel>
                <RadioGroup name="state" defaultValue={demoTrack.state}>
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
          <Button type="submit" form="track-edit-form">
            Submit
          </Button>
          <Spacer />
          <Button onClick={handleOnClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
