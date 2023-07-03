import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>hoge</ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
