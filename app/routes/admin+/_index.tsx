import { Card, CardBody, Stack } from '@chakra-ui/react'
import { AppLinkButton } from '~/components'

export default function AdminIndex() {
  return (
    <Card>
      <CardBody>
        <Stack>
          <AppLinkButton to="event/import">Import Luma Event</AppLinkButton>
        </Stack>
      </CardBody>
    </Card>
  )
}
