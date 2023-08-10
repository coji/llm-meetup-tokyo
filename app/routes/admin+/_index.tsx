import { AppLinkButton } from '~/components'
import { Card, CardContent, Stack } from '~/components/ui'

export default function AdminIndex() {
  return (
    <Card>
      <CardContent>
        <Stack>
          <AppLinkButton to="event/import">Import Luma Event</AppLinkButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
