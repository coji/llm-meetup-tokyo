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
import { useNavigate } from '@remix-run/react'

export default function TrackNextPresenterPage() {
  const navigate = useNavigate()

  const handleOnClose = () => {
    navigate('..')
  }
  return (
    <Modal isOpen={true} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>削除します。よろしいですか？</ModalBody>

        <ModalFooter>
          <HStack>
            <Button colorScheme="red">削除</Button>
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
