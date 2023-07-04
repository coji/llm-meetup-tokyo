import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react'
import type { ActionArgs } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import { redirect } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { deleteDemoTrack } from '~/models'

export const action = async ({ params }: ActionArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  await deleteDemoTrack(trackId)
  return redirect(`/event/${eventId}`)
}

export default function TrackNextPresenterPage() {
  const navigate = useNavigate()

  const handleOnClose = () => {
    navigate('..')
  }
  return (
    <Modal isOpen={true} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete a Demo Track</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Demo Track を削除します。よろしいですか？</ModalBody>

        <ModalFooter>
          <HStack>
            <form method="POST">
              <Button type="submit" colorScheme="red">
                削除
              </Button>
            </form>
            <Spacer />
            <Button variant="ghost" onClick={handleOnClose}>
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
