import { type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { Button, Card, CardContent, Input, Label, Stack } from '~/components/ui'
import { clusterEventGuests } from '~/jobs/cluster-event-guests.server'
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
  const { clusterNum } = await zx.parseForm(request, {
    clusterNum: zx.NumAsString,
  })
  await clusterEventGuests(eventId, clusterNum)
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

            <Stack>
              <fieldset>
                <Label>クラスタ数</Label>
                <Input type="number" name="clusterNum" defaultValue={3}></Input>
              </fieldset>

              <Button
                className="w-full"
                type="submit"
                disabled={navigation.state !== 'idle'}
              >
                {navigation.state === 'submitting'
                  ? 'Clustering...'
                  : 'Start Clustering'}
              </Button>
            </Stack>
          </Form>
        </CardContent>
      </Card>
    </Stack>
  )
}
