import { type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { Button, Card, CardContent, Stack } from '~/components/ui'
import { embedEventGuests } from '~/jobs/embed-event-guests.server'
import { getEventById } from '~/models'
import { emitter } from '~/services/emitter.server'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)

  return typedjson({ event })
}

export const action = async ({ params, request }: ActionArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  await embedEventGuests(eventId)
  emitter.emit('event', eventId) // イベント更新をリアルタイム通知

  return typedjson({})
}

export default function EventSyncPage() {
  const { event } = useTypedLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <Stack>
      <Card>
        <CardContent>
          <Form method="POST">
            <input type="hidden" name="url" value={event.url}></input>
            <Button
              className="w-full"
              type="submit"
              disabled={navigation.state !== 'idle'}
            >
              {navigation.state === 'submitting'
                ? 'Embedding...'
                : 'Start Embedding'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </Stack>
  )
}
